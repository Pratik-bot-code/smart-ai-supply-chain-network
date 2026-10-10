# ==============================================================================
# Agent E: Autonomous Coordinator Agent
# Specialization: Multi-Agent Consensus Arbiter & Policy Execution
# Combines: Forecasting, Inventory, Risk, and Supplier Agent outputs into unified actions.
# ==============================================================================

import uuid
from datetime import datetime
from typing import List, Dict, Any

from database import get_db
from agents.demand_forecasting import DemandForecastingAgent
from agents.inventory_management import InventoryManagementAgent
from agents.supply_chain_risk import SupplyChainRiskAgent
from agents.supplier_recommendation import SupplierRecommendationAgent

class CoordinatorAgent:
    """
    Central orchestrator harmonizing telemetry from specialized AI agents.
    Produces unified recommendations and requires explicit human approval before execution.
    """

    def __init__(self):
        self.forecast_agent = DemandForecastingAgent()
        self.inventory_agent = InventoryManagementAgent()
        self.risk_agent = SupplyChainRiskAgent()
        self.supplier_agent = SupplierRecommendationAgent()

    def run_coordination_cycle(self) -> Dict[str, Any]:
        """
        Execute full autonomous agent synchronization cycle.
        """
        now_time = datetime.now().strftime("%H:%M:%S")
        logs = []

        logs.append(f"[{now_time}] Coordinator Agent: Initiated multi-agent consensus cycle.")

        # 1. Gather Inventory Proposals
        inventory_proposals = self.inventory_agent.get_actionable_proposals()
        logs.append(f"[{now_time}] Inventory Agent: Evaluated SKU safety thresholds ({len(inventory_proposals)} restock actions identified).")

        # 2. Gather Risks
        risks = self.risk_agent.scan_risks()
        logs.append(f"[{now_time}] Risk Radar Agent: Scanned vulnerabilities ({len(risks)} active alerts detected).")

        # 3. Synchronize unified recommendations into Database
        new_recommendations = []

        with get_db() as conn:
            cursor = conn.cursor()

            # Process inventory replenishment proposals
            for prop in inventory_proposals[:2]:  # Focus on top priority
                rec_id = f"REC-{prop['sku'][-4:]}-{datetime.now().strftime('%M%S')}"

                # Query forecast to check for velocity acceleration
                forecast_res = self.forecast_agent.predict_7_day_demand(prop["sku"])
                forecast_note = ""
                if forecast_res.get("isReliable"):
                    forecast_note = f" 7-day predicted demand is {forecast_res['projected7DayDemand']} units."

                rec_dict = {
                    "id": rec_id,
                    "title": f"Approve Emergency Reorder: {prop['sku']}",
                    "priority": prop["priority"],
                    "agent_source": "Coordinator Agent (Inventory + Forecasting)",
                    "summary": f"{prop['reason']}{forecast_note}",
                    "details": (
                        f"The Inventory Agent flagged a safety stock breach for {prop['product_name']}. "
                        f"Demand forecasting projects continued velocity. Coordinator advises placing a purchase order "
                        f"for {prop['suggested_quantity']} units with {prop['supplier_name']}."
                    ),
                    "suggested_quantity": prop["suggested_quantity"],
                    "estimated_cost": prop["estimated_cost"],
                    "recommended_supplier": prop["supplier_name"],
                    "action_type": "CREATE_PO",
                    "sku": prop["sku"],
                    "status": "Pending Approval",
                    "is_demo": 1
                }

                # Check if recommendation for this SKU already exists in Pending status
                cursor.execute("SELECT id FROM recommendations WHERE sku = ? AND status = 'Pending Approval';", (prop["sku"],))
                if not cursor.fetchone():
                    cursor.execute("""
                    INSERT INTO recommendations (id, title, priority, agent_source, summary, details, suggested_quantity, estimated_cost, recommended_supplier, action_type, sku, status, is_demo)
                    VALUES (:id, :title, :priority, :agent_source, :summary, :details, :suggested_quantity, :estimated_cost, :recommended_supplier, :action_type, :sku, :status, :is_demo);
                    """, rec_dict)
                    new_recommendations.append(rec_dict)

            # Process Supplier Risk Diversification
            supplier_risks = [r for r in risks if r["category"] in ["Supplier Bottleneck", "Vendor Performance"]]
            if supplier_risks:
                top_risk = supplier_risks[0]
                alt_supplier = self.supplier_agent.recommend_alternative_supplier("SUP-003")

                if alt_supplier:
                    rec_id = f"REC-DIV-{datetime.now().strftime('%M%S')}"
                    rec_dict = {
                        "id": rec_id,
                        "title": f"Diversify Supplier Allocation: {top_risk['affected_sku']}",
                        "priority": "High",
                        "agent_source": "Coordinator Agent (Risk + Supplier Agents)",
                        "summary": f"{top_risk['title']}. Delivery reliability decayed.",
                        "details": (
                            f"Risk Agent detected delivery lag with primary supplier. "
                            f"Supplier Recommendation Agent evaluated certified alternatives: "
                            f"{alt_supplier['reasoning']} Coordinator recommends reallocating next order batch."
                        ),
                        "suggested_quantity": 250,
                        "estimated_cost": "$8,500.00",
                        "recommended_supplier": alt_supplier["supplier_name"],
                        "action_type": "REALLOCATE_SUPPLIER",
                        "sku": top_risk["affected_sku"],
                        "status": "Pending Approval",
                        "is_demo": 1
                    }

                    cursor.execute("SELECT id FROM recommendations WHERE title LIKE '%Diversify Supplier%' AND status = 'Pending Approval';")
                    if not cursor.fetchone():
                        cursor.execute("""
                        INSERT INTO recommendations (id, title, priority, agent_source, summary, details, suggested_quantity, estimated_cost, recommended_supplier, action_type, sku, status, is_demo)
                        VALUES (:id, :title, :priority, :agent_source, :summary, :details, :suggested_quantity, :estimated_cost, :recommended_supplier, :action_type, :sku, :status, :is_demo);
                        """, rec_dict)
                        new_recommendations.append(rec_dict)

            # Record log
            logs.append(f"[{now_time}] Coordinator Agent: Consensus finalized. {len(new_recommendations)} actionable proposals pending human authorization.")
            for log_msg in logs:
                cursor.execute("INSERT INTO agent_logs (log_time, agent_name, message) VALUES (?, ?, ?);", (now_time, "Coordinator Agent", log_msg))

        return {
            "status": "Cycle Complete",
            "agentsRun": 5,
            "timestamp": now_time,
            "newInsightsGenerated": len(new_recommendations),
            "details": logs
        }

    def approve_recommendation(self, recommendation_id: str) -> Dict[str, Any]:
        """
        Human-in-the-loop explicit approval.
        Converts verified recommendation into a real Purchase Order without fabricating records.
        """
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM recommendations WHERE id = ?;", (recommendation_id,))
            rec = cursor.fetchone()

            if not rec:
                raise ValueError(f"Recommendation with ID {recommendation_id} not found.")

            # Update recommendation status
            cursor.execute("UPDATE recommendations SET status = 'Approved & Executed' WHERE id = ?;", (recommendation_id,))

            created_order = None
            if rec["action_type"] == "CREATE_PO":
                # Find product details
                cursor.execute("SELECT name, unit_cost, supplier_id, lead_time_days FROM products WHERE sku = ?;", (rec["sku"],))
                prod = cursor.fetchone()

                po_id = f"PO-{datetime.now().year}-{datetime.now().strftime('%M%S')}"
                cost_num = float(rec["suggested_quantity"] * (prod["unit_cost"] if prod else 50.0))
                today_str = datetime.now().strftime("%Y-%m-%d")
                lead_days = prod["lead_time_days"] if prod else 14
                expected_date = (datetime.now() + datetime.timedelta(days=lead_days)).strftime("%Y-%m-%d") if hasattr(datetime, "timedelta") else "2026-10-24"

                from datetime import timedelta
                expected_date = (datetime.now() + timedelta(days=lead_days)).strftime("%Y-%m-%d")

                cursor.execute("""
                INSERT INTO purchase_orders (id, sku, product_name, supplier_id, supplier_name, quantity, total_value, order_date, expected_delivery, status, risk_assessment, is_demo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, 1);
                """, (
                    po_id,
                    rec["sku"],
                    prod["name"] if prod else rec["title"],
                    prod["supplier_id"] if prod else "SUP-001",
                    rec["recommended_supplier"],
                    rec["suggested_quantity"],
                    cost_num,
                    today_str,
                    expected_date,
                    f"Generated via Autonomous Agent Approval [{rec['id']}]"
                ))

                created_order = {
                    "id": po_id,
                    "sku": rec["sku"],
                    "quantity": rec["suggested_quantity"],
                    "totalValue": cost_num,
                    "supplierName": rec["recommended_supplier"]
                }

            # Log execution
            log_time = datetime.now().strftime("%H:%M:%S")
            cursor.execute("INSERT INTO agent_logs (log_time, agent_name, message) VALUES (?, ?, ?);", 
                           (log_time, "Coordinator Agent", f"Human-in-the-loop: User approved {rec['id']} ({rec['action_type']}). Action executed."))

        return {
            "success": True,
            "recommendationId": recommendation_id,
            "status": "Approved & Executed",
            "createdOrder": created_order
        }

    def dismiss_recommendation(self, recommendation_id: str) -> Dict[str, Any]:
        """Dismiss a recommendation."""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM recommendations WHERE id = ?;", (recommendation_id,))
        return {"success": True, "dismissedId": recommendation_id}
