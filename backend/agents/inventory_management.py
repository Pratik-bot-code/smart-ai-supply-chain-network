# ==============================================================================
# Agent B: Inventory Management Agent
# Specialization: Safety Stock Auditing & Dynamic Economic Order Quantity (EOQ)
# Strict Safety Constraint: NEVER creates actual purchase orders autonomously.
# ==============================================================================

import math
from typing import List, Dict, Any
from database import get_db

class InventoryManagementAgent:
    """
    Monitors warehouse stock levels against safety stock and reorder buffers.
    Calculates suggested reorder quantities using Economic Order Quantity (EOQ) heuristics.
    """

    def scan_inventory(self) -> List[Dict[str, Any]]:
        """
        Scan all products to detect stockout threats, safety breaches, and reorder levels.
        """
        findings = []

        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT id, sku, name, stock, reorder_level, safety_stock, unit_cost, lead_time_days, supplier_id, supplier_name, velocity
            FROM products;
            """)
            products = cursor.fetchall()

        for p in products:
            stock = p["stock"]
            reorder_lvl = p["reorder_level"]
            safety = p["safety_stock"]

            status = "Optimal"
            needs_reorder = False
            urgency = "Normal"

            if stock <= safety:
                status = "Critical"
                needs_reorder = True
                urgency = "Urgent"
            elif stock <= reorder_lvl:
                status = "Low Stock"
                needs_reorder = True
                urgency = "High"

            # Compute Dynamic Economic Order Quantity (EOQ)
            # Annual demand proxy based on velocity:
            annual_units = 9000 if p["velocity"] == "High" else 5000 if p["velocity"] == "Medium" else 2500
            order_cost = 50.0  # Assumed procurement processing cost
            holding_cost = max(1.0, p["unit_cost"] * 0.20)  # 20% holding cost rate

            eoq = math.sqrt((2 * annual_units * order_cost) / holding_cost)
            # Round to sensible batch
            suggested_qty = max(int(round(eoq / 25.0) * 25), reorder_lvl - stock + safety)

            findings.append({
                "product_id": p["id"],
                "sku": p["sku"],
                "name": p["name"],
                "stock": stock,
                "reorder_level": reorder_lvl,
                "safety_stock": safety,
                "unit_cost": p["unit_cost"],
                "lead_time_days": p["lead_time_days"],
                "supplier_name": p["supplier_name"],
                "supplier_id": p["supplier_id"],
                "status": status,
                "needs_reorder": needs_reorder,
                "urgency": urgency,
                "suggested_reorder_qty": suggested_qty,
                "estimated_po_cost": round(suggested_qty * p["unit_cost"], 2)
            })

        return findings

    def get_actionable_proposals(self) -> List[Dict[str, Any]]:
        """
        Returns proposals for items that need replenishment.
        Strict rule: Generates proposals only; does not write to purchase_orders.
        """
        all_scans = self.scan_inventory()
        proposals = []

        for item in all_scans:
            if item["needs_reorder"]:
                proposals.append({
                    "sku": item["sku"],
                    "product_name": item["name"],
                    "supplier_id": item["supplier_id"],
                    "supplier_name": item["supplier_name"],
                    "current_stock": item["stock"],
                    "suggested_quantity": item["suggested_reorder_qty"],
                    "estimated_cost": f"${item['estimated_po_cost']:,.2f}",
                    "priority": item["urgency"],
                    "reason": (
                        f"Current stock ({item['stock']}) is below "
                        f"{'safety buffer (' + str(item['safety_stock']) + ')' if item['status'] == 'Critical' else 'reorder threshold (' + str(item['reorder_level']) + ')'}. "
                        f"Lead time: {item['lead_time_days']} days."
                    )
                })

        return proposals
