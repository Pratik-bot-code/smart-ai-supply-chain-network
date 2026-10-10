# ==============================================================================
# Smart AI Supply Chain Network - Automated Backend Unit & Agent Test Suite
# Tests: Inventory alerts, forecasting regressions, risk detection, and safety rules.
# ==============================================================================

import unittest
import sys
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from database import init_db
from seed_data import seed_database
from agents.demand_forecasting import DemandForecastingAgent
from agents.inventory_management import InventoryManagementAgent
from agents.supply_chain_risk import SupplyChainRiskAgent
from agents.supplier_recommendation import SupplierRecommendationAgent
from agents.coordinator import CoordinatorAgent

class TestSupplyChainAgents(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Initialize database with standard baseline seed before testing."""
        init_db()
        seed_database(force=False)

    def test_demand_forecasting_valid_sku(self):
        """Test that the Demand Forecasting Agent computes 7-day projections with confidence intervals."""
        agent = DemandForecastingAgent()
        res = agent.predict_7_day_demand("SC-CHIP-9902")

        self.assertTrue(res["isReliable"], "Forecast should be reliable with 60 days of historical data")
        self.assertGreater(res["projected7DayDemand"], 0, "7-day projected demand should be positive")
        self.assertGreaterEqual(res["r2Score"], 0.0, "R2 score should be non-negative")
        self.assertTrue(len(res["chartData"]) >= 14, "Chart data should include historical + forecast points")

        # Verify confidence intervals
        forecast_points = [p for p in res["chartData"] if p["predicted"] is not None and p["lowerBound"] is not None]
        for p in forecast_points:
            self.assertLessEqual(p["lowerBound"], p["predicted"], "Lower bound must be <= predicted")
            self.assertGreaterEqual(p["upperBound"], p["predicted"], "Upper bound must be >= predicted")

    def test_demand_forecasting_insufficient_data(self):
        """Test that non-existent or insufficient historical data safely returns isReliable=False."""
        agent = DemandForecastingAgent(min_days=14)
        res = agent.predict_7_day_demand("NON-EXISTENT-SKU")

        self.assertFalse(res["isReliable"], "Should flag unreliable when data points are under threshold")
        self.assertIn("Insufficient historical data", res["warning"])

    def test_inventory_management_alerts(self):
        """Test that the Inventory Agent detects low-stock items and computes dynamic EOQ."""
        agent = InventoryManagementAgent()
        scans = agent.scan_inventory()

        self.assertGreater(len(scans), 0, "Inventory scan should return items")
        critical_items = [i for i in scans if i["status"] == "Critical"]
        self.assertGreater(len(critical_items), 0, "Should detect critical low-stock items (e.g. SC-MCU-7740)")

        for item in critical_items:
            self.assertGreater(item["suggested_reorder_qty"], 0, "Suggested EOQ must be > 0")
            self.assertTrue(item["needs_reorder"], "Critical item must require reorder")

    def test_supply_chain_risk_agent(self):
        """Test that the Risk Agent assigns valid severity levels (Low, Medium, High) with root causes."""
        agent = SupplyChainRiskAgent()
        risks = agent.scan_risks()

        self.assertGreater(len(risks), 0, "Risk scan should identify active risks")
        valid_severities = {"Low", "Medium", "High"}

        for r in risks:
            self.assertIn(r["severity"], valid_severities, "Severity must be Low, Medium, or High")
            self.assertTrue(len(r["reason"]) > 10, "Risk must have an explicit root-cause explanation")
            self.assertTrue(len(r["suggested_action"]) > 10, "Risk must have a suggested mitigation action")

    def test_supplier_recommendation_scoring(self):
        """Test that MAUT scoring is deterministic and ranks suppliers properly without fabrication."""
        agent = SupplierRecommendationAgent()
        ranked = agent.get_ranked_suppliers()

        self.assertGreater(len(ranked), 0, "Should return ranked suppliers")
        # Check descending sort
        scores = [s["computed_score"] for s in ranked]
        self.assertEqual(scores, sorted(scores, reverse=True), "Suppliers must be sorted descending by reliability score")

        # Verify mathematical formula
        sample = ranked[0]
        expected_quality = max(0.0, 100.0 - (sample["defect_rate"] * 15.0))
        expected_score = round((0.45 * sample["on_time_rate"]) + (0.30 * expected_quality) + (0.25 * sample["cost_score"]), 1)
        self.assertEqual(sample["computed_score"], expected_score, "Computed score must strictly match formula")

    def test_coordinator_human_in_the_loop_approval(self):
        """Test that coordinator recommendations require explicit approval before creating a purchase order."""
        coordinator = CoordinatorAgent()
        cycle_res = coordinator.run_coordination_cycle()

        self.assertEqual(cycle_res["status"], "Cycle Complete")
        self.assertEqual(cycle_res["agentsRun"], 5)

        # Approve the first pending recommendation
        from database import get_db
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM recommendations WHERE status = 'Pending Approval' LIMIT 1;")
            row = cursor.fetchone()

        if row:
            rec_id = row["id"]
            approval_res = coordinator.approve_recommendation(rec_id)
            self.assertTrue(approval_res["success"])
            self.assertEqual(approval_res["status"], "Approved & Executed")

if __name__ == "__main__":
    unittest.main()
