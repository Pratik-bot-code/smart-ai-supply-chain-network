# ==============================================================================
# Agent D: Supplier Recommendation Agent
# Specialization: Multi-Attribute Utility Scoring & Vendor Optimization
# Strict Rule: Zero fabricated ratings or external market assumptions.
# ==============================================================================

from typing import List, Dict, Any, Optional
from database import get_db

class SupplierRecommendationAgent:
    """
    Ranks and recommends suppliers using recorded delivery performance,
    defect statistics, and cost index scores via Multi-Attribute Utility Theory (MAUT).
    """

    def calculate_supplier_score(self, on_time_rate: float, defect_rate: float, cost_score: int) -> float:
        """
        Deterministic scoring formula:
        - 45% Weight: On-Time Delivery Rate
        - 30% Weight: Quality Defect Prevention (100 - defect_rate * 15)
        - 25% Weight: Cost Competitiveness Score
        """
        quality_score = max(0.0, 100.0 - (defect_rate * 15.0))
        composite = (0.45 * on_time_rate) + (0.30 * quality_score) + (0.25 * cost_score)
        return round(composite, 1)

    def get_ranked_suppliers(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Fetch suppliers from database and rank them deterministically based on real recorded metrics.
        """
        with get_db() as conn:
            cursor = conn.cursor()
            if category:
                cursor.execute("SELECT * FROM suppliers WHERE category = ?;", (category,))
            else:
                cursor.execute("SELECT * FROM suppliers;")
            suppliers = cursor.fetchall()

        ranked = []
        for s in suppliers:
            score = self.calculate_supplier_score(
                on_time_rate=s["on_time_rate"],
                defect_rate=s["defect_rate"],
                cost_score=s["cost_score"]
            )
            s_dict = dict(s)
            s_dict["computed_score"] = score
            ranked.append(s_dict)

        # Sort descending by composite score
        ranked.sort(key=lambda x: x["computed_score"], reverse=True)
        return ranked

    def recommend_alternative_supplier(self, current_supplier_id: str) -> Optional[Dict[str, Any]]:
        """
        When a primary supplier is facing bottlenecks, find the highest-ranking certified alternative.
        """
        all_suppliers = self.get_ranked_suppliers()
        alternatives = [s for s in all_suppliers if s["id"] != current_supplier_id and s["on_time_rate"] >= 90.0]

        if alternatives:
            top_choice = alternatives[0]
            return {
                "supplier_id": top_choice["id"],
                "supplier_name": top_choice["name"],
                "on_time_rate": top_choice["on_time_rate"],
                "lead_time_days": top_choice["avg_lead_days"],
                "reliability_score": top_choice["computed_score"],
                "reasoning": (
                    f"Selected {top_choice['name']} due to high on-time fulfillment ({top_choice['on_time_rate']}%), "
                    f"low defect rate ({top_choice['defect_rate']}%), and proven average lead time of {top_choice['avg_lead_days']} days."
                )
            }
        return None
