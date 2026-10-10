# ==============================================================================
# Agent C: Supply Chain Risk Agent
# Specialization: Early Warning Disruption Radar & Bottleneck Detection
# Assigns: Transparent Low, Medium, High risk ratings with explicit root causes.
# ==============================================================================

from datetime import datetime
from typing import List, Dict, Any
from database import get_db

class SupplyChainRiskAgent:
    """
    Detects delayed orders, imminent stockouts, supplier delivery variance,
    and velocity surges. Assigns transparent risk levels with detailed explanations.
    """

    def scan_risks(self) -> List[Dict[str, Any]]:
        """
        Execute multi-factor risk detection across suppliers, orders, and products.
        """
        detected_risks = []
        today_str = datetime.now().strftime("%Y-%m-%d")

        with get_db() as conn:
            cursor = conn.cursor()

            # 1. Delayed Purchase Orders Detection
            cursor.execute("""
            SELECT id, sku, product_name, supplier_name, expected_delivery, status, quantity
            FROM purchase_orders 
            WHERE status = 'Delayed' OR (status = 'In Transit' AND expected_delivery < ?);
            """, (today_str,))
            delayed_pos = cursor.fetchall()

            for po in delayed_pos:
                # Get current stock of the delayed SKU
                cursor.execute("SELECT stock, safety_stock, reorder_level FROM products WHERE sku = ?;", (po["sku"],))
                prod = cursor.fetchone()
                current_stock = prod["stock"] if prod else 50

                days_depletion = round(current_stock / 22.0, 1)  # average daily burn
                severity = "High" if current_stock < 100 else "Medium"

                detected_risks.append({
                    "id": f"RSK-ORD-{po['id'][-3:]}",
                    "severity": severity,
                    "title": f"Supplier Delayed Shipment on Critical SKU: {po['sku']}",
                    "category": "Supplier Bottleneck",
                    "affected_sku": po["sku"],
                    "product_name": po["product_name"],
                    "supplier": po["supplier_name"],
                    "current_stock": current_stock,
                    "days_until_depletion": days_depletion,
                    "reason": f"Order {po['id']} is delayed beyond expected delivery date ({po['expected_delivery']}). Current stock is {current_stock} units.",
                    "impact": f"Risk of assembly line stoppage in {days_depletion} days if delay persists.",
                    "suggested_action": f"Request expedite notice from {po['supplier_name']} or split allocation with alternate certified vendor.",
                    "detected_by": "Supply Chain Risk Agent",
                    "detected_at": "Today, Real-time Scan",
                    "status": "Active Alert",
                    "is_demo": 1
                })

            # 2. Critical Inventory Depletion (Stock <= Safety Stock)
            cursor.execute("""
            SELECT sku, name, stock, safety_stock, reorder_level, supplier_name, velocity
            FROM products 
            WHERE stock <= safety_stock;
            """)
            critical_prods = cursor.fetchall()

            for p in critical_prods:
                burn_rate = 25 if p["velocity"] == "High" else 15
                days_left = round(p["stock"] / burn_rate, 1)

                detected_risks.append({
                    "id": f"RSK-STK-{p['sku'][-4:]}",
                    "severity": "High",
                    "title": f"Imminent Stockout for {p['name']}",
                    "category": "Inventory Depletion",
                    "affected_sku": p["sku"],
                    "product_name": p["name"],
                    "supplier": p["supplier_name"],
                    "current_stock": p["stock"],
                    "days_until_depletion": days_left,
                    "reason": f"Current stock ({p['stock']} units) is critically below safety threshold ({p['safety_stock']} units). Burn rate: ~{burn_rate} units/day.",
                    "impact": f"Projected complete stockout within {days_left} business days without intervention.",
                    "suggested_action": f"Approve emergency reorder batch with {p['supplier_name']} via air freight priority.",
                    "detected_by": "Supply Chain Risk Agent",
                    "detected_at": "Today, Real-time Scan",
                    "status": "Active Alert",
                    "is_demo": 1
                })

            # 3. Supplier Performance Degradation (On-time rate < 80%)
            cursor.execute("""
            SELECT id, name, on_time_rate, defect_rate, avg_lead_days
            FROM suppliers 
            WHERE on_time_rate < 80.0 OR defect_rate > 2.5;
            """)
            at_risk_suppliers = cursor.fetchall()

            for s in at_risk_suppliers:
                detected_risks.append({
                    "id": f"RSK-SUP-{s['id'][-3:]}",
                    "severity": "Medium" if s["on_time_rate"] >= 70.0 else "High",
                    "title": f"Supplier Reliability Degradation: {s['name']}",
                    "category": "Vendor Performance",
                    "affected_sku": "Multiple Category SKUs",
                    "product_name": f"Supplied components by {s['name']}",
                    "supplier": s["name"],
                    "current_stock": 100,
                    "days_until_depletion": 8.0,
                    "reason": f"Vendor on-time rate dropped to {s['on_time_rate']}% (benchmark > 90%) and defect rate reached {s['defect_rate']}%.",
                    "impact": "Higher lead-time volatility and defective batch inspection hold-ups.",
                    "suggested_action": "Place supplier on performance watchlist and reallocate 40% of future orders to secondary vendor.",
                    "detected_by": "Supply Chain Risk Agent",
                    "detected_at": "Today, Real-time Scan",
                    "status": "Active Alert",
                    "is_demo": 1
                })

        return detected_risks
