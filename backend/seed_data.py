# ==============================================================================
# Smart AI Supply Chain Network - Seed Data Initializer
# Populates realistic, verifiable DEMO DATA for products, 60-day daily sales,
# suppliers, orders, risk alerts, and coordinator recommendations.
# ==============================================================================

import random
from datetime import datetime, timedelta
from database import get_db, init_db

DEMO_PRODUCTS = [
  {
    "id": "PRD-101",
    "sku": "SC-CHIP-9902",
    "name": "High-Bandwidth Neural Edge Processor",
    "category": "Semiconductors",
    "stock": 142,
    "reorder_level": 250,
    "safety_stock": 100,
    "unit_cost": 145.0,
    "selling_price": 280.0,
    "supplier_id": "SUP-001",
    "supplier_name": "Apex Microelectronics Corp",
    "lead_time_days": 14,
    "status": "Low Stock",
    "velocity": "High",
    "is_demo": 1
  },
  {
    "id": "PRD-102",
    "sku": "SC-POLY-4410",
    "name": "Thermoplastic Polymer Housing v4",
    "category": "Materials",
    "stock": 820,
    "reorder_level": 400,
    "safety_stock": 250,
    "unit_cost": 18.5,
    "selling_price": 42.0,
    "supplier_id": "SUP-002",
    "supplier_name": "Nordic Polychem Logistics",
    "lead_time_days": 8,
    "status": "Optimal",
    "velocity": "Medium",
    "is_demo": 1
  },
  {
    "id": "PRD-103",
    "sku": "SC-CONN-8812",
    "name": "Gold-Plated Industrial Wire Harness",
    "category": "Connectors",
    "stock": 85,
    "reorder_level": 300,
    "safety_stock": 150,
    "unit_cost": 34.0,
    "selling_price": 79.0,
    "supplier_id": "SUP-003",
    "supplier_name": "Shenzhen FastLink Electronics",
    "lead_time_days": 22,
    "status": "Critical",
    "velocity": "High",
    "is_demo": 1
  },
  {
    "id": "PRD-104",
    "sku": "SC-CHAS-3001",
    "name": "Precision Aluminum Unibody Chassis",
    "category": "Structural",
    "stock": 460,
    "reorder_level": 200,
    "safety_stock": 120,
    "unit_cost": 95.0,
    "selling_price": 210.0,
    "supplier_id": "SUP-004",
    "supplier_name": "Rhine Heavy Castings GmbH",
    "lead_time_days": 18,
    "status": "Optimal",
    "velocity": "Low",
    "is_demo": 1
  },
  {
    "id": "PRD-105",
    "sku": "SC-BATT-6200",
    "name": "Solid-State Li-Ion Modular Cell Pack",
    "category": "Power",
    "stock": 98,
    "reorder_level": 180,
    "safety_stock": 80,
    "unit_cost": 220.0,
    "selling_price": 490.0,
    "supplier_id": "SUP-005",
    "supplier_name": "Solaria Battery Cell Tech",
    "lead_time_days": 19,
    "status": "Low Stock",
    "velocity": "High",
    "is_demo": 1
  },
  {
    "id": "PRD-106",
    "sku": "SC-SENS-5520",
    "name": "Optical LiDAR Distance Sensor Module",
    "category": "Sensors",
    "stock": 310,
    "reorder_level": 150,
    "safety_stock": 75,
    "unit_cost": 82.0,
    "selling_price": 195.0,
    "supplier_id": "SUP-001",
    "supplier_name": "Apex Microelectronics Corp",
    "lead_time_days": 14,
    "status": "Optimal",
    "velocity": "Medium",
    "is_demo": 1
  },
  {
    "id": "PRD-107",
    "sku": "SC-COOL-1029",
    "name": "Micro-Channel Vapor Chamber Cooler",
    "category": "Thermal",
    "stock": 640,
    "reorder_level": 350,
    "safety_stock": 180,
    "unit_cost": 28.0,
    "selling_price": 65.0,
    "supplier_id": "SUP-004",
    "supplier_name": "Rhine Heavy Castings GmbH",
    "lead_time_days": 12,
    "status": "Optimal",
    "velocity": "Medium",
    "is_demo": 1
  },
  {
    "id": "PRD-108",
    "sku": "SC-MCU-7740",
    "name": "Low-Power Dual-Core Controller IC",
    "category": "Semiconductors",
    "stock": 45,
    "reorder_level": 220,
    "safety_stock": 110,
    "unit_cost": 16.5,
    "selling_price": 38.0,
    "supplier_id": "SUP-001",
    "supplier_name": "Apex Microelectronics Corp",
    "lead_time_days": 14,
    "status": "Critical",
    "velocity": "High",
    "is_demo": 1
  }
]

DEMO_SUPPLIERS = [
  {
    "id": "SUP-001",
    "name": "Apex Microelectronics Corp",
    "category": "Semiconductors & Sensors",
    "location": "Hsinchu, Taiwan",
    "on_time_rate": 96.4,
    "defect_rate": 0.8,
    "avg_lead_days": 14,
    "cost_score": 88,
    "reliability_score": 94.2,
    "active_orders": 3,
    "status": "Preferred",
    "is_demo": 1
  },
  {
    "id": "SUP-002",
    "name": "Nordic Polychem Logistics",
    "category": "Industrial Polymers",
    "location": "Gothenburg, Sweden",
    "on_time_rate": 98.1,
    "defect_rate": 0.4,
    "avg_lead_days": 8,
    "cost_score": 82,
    "reliability_score": 96.8,
    "active_orders": 2,
    "status": "Preferred",
    "is_demo": 1
  },
  {
    "id": "SUP-003",
    "name": "Shenzhen FastLink Electronics",
    "category": "Connectors & Wiring",
    "location": "Shenzhen, China",
    "on_time_rate": 74.5,
    "defect_rate": 3.2,
    "avg_lead_days": 22,
    "cost_score": 95,
    "reliability_score": 68.4,
    "active_orders": 4,
    "status": "At Risk",
    "is_demo": 1
  },
  {
    "id": "SUP-004",
    "name": "Rhine Heavy Castings GmbH",
    "category": "Chassis & Structural",
    "location": "Dusseldorf, Germany",
    "on_time_rate": 91.2,
    "defect_rate": 1.1,
    "avg_lead_days": 18,
    "cost_score": 76,
    "reliability_score": 89.5,
    "active_orders": 1,
    "status": "Standard",
    "is_demo": 1
  },
  {
    "id": "SUP-005",
    "name": "Solaria Battery Cell Tech",
    "category": "Energy Storage",
    "location": "Austin, TX, USA",
    "on_time_rate": 83.0,
    "defect_rate": 2.1,
    "avg_lead_days": 19,
    "cost_score": 79,
    "reliability_score": 79.8,
    "active_orders": 2,
    "status": "Watchlist",
    "is_demo": 1
  }
]

DEMO_ORDERS = [
  {
    "id": "PO-2026-901",
    "sku": "SC-CHIP-9902",
    "product_name": "High-Bandwidth Neural Edge Processor",
    "supplier_id": "SUP-001",
    "supplier_name": "Apex Microelectronics Corp",
    "quantity": 350,
    "total_value": 50750.0,
    "order_date": "2026-09-28",
    "expected_delivery": "2026-10-12",
    "status": "In Transit",
    "risk_assessment": "Normal - On Track",
    "is_demo": 1
  },
  {
    "id": "PO-2026-902",
    "sku": "SC-CONN-8812",
    "product_name": "Gold-Plated Industrial Wire Harness",
    "supplier_id": "SUP-003",
    "supplier_name": "Shenzhen FastLink Electronics",
    "quantity": 500,
    "total_value": 17000.0,
    "order_date": "2026-09-18",
    "expected_delivery": "2026-10-04",
    "status": "Delayed",
    "risk_assessment": "High Risk: Port of Shenzhen congestion (6 days late)",
    "is_demo": 1
  },
  {
    "id": "PO-2026-903",
    "sku": "SC-POLY-4410",
    "product_name": "Thermoplastic Polymer Housing v4",
    "supplier_id": "SUP-002",
    "supplier_name": "Nordic Polychem Logistics",
    "quantity": 1200,
    "total_value": 22200.0,
    "order_date": "2026-10-02",
    "expected_delivery": "2026-10-10",
    "status": "Delivered",
    "risk_assessment": "Completed Ahead of Schedule",
    "is_demo": 1
  },
  {
    "id": "PO-2026-904",
    "sku": "SC-BATT-6200",
    "product_name": "Solid-State Li-Ion Modular Cell Pack",
    "supplier_id": "SUP-005",
    "supplier_name": "Solaria Battery Cell Tech",
    "quantity": 200,
    "total_value": 44000.0,
    "order_date": "2026-10-06",
    "expected_delivery": "2026-10-25",
    "status": "Pending",
    "risk_assessment": "Awaiting Procurement Signature",
    "is_demo": 1
  },
  {
    "id": "PO-2026-905",
    "sku": "SC-CHAS-3001",
    "product_name": "Precision Aluminum Unibody Chassis",
    "supplier_id": "SUP-004",
    "supplier_name": "Rhine Heavy Castings GmbH",
    "quantity": 400,
    "total_value": 38000.0,
    "order_date": "2026-10-01",
    "expected_delivery": "2026-10-19",
    "status": "In Transit",
    "risk_assessment": "Normal - Rail Transit",
    "is_demo": 1
  }
]

DEMO_RISKS = [
  {
    "id": "RSK-801",
    "severity": "High",
    "title": "Supplier Delayed Shipment on Critical SKU",
    "category": "Supplier Bottleneck",
    "affected_sku": "SC-CONN-8812",
    "product_name": "Gold-Plated Industrial Wire Harness",
    "supplier": "Shenzhen FastLink Electronics",
    "current_stock": 85,
    "days_until_depletion": 3.5,
    "reason": "Port of Shenzhen freight container backlogs combined with supplier on-time rating dropping to 74.5%. Stock is 85 units vs reorder threshold 300.",
    "impact": "Potential production line halt within 4 business days if connector stock depletes.",
    "suggested_action": "Trigger emergency split order to qualified alternate vendor (Nordic Polychem Logistics) for 200 units via air freight.",
    "detected_by": "Supply Chain Risk Agent",
    "detected_at": "Today, 08:15 AM",
    "status": "Active Alert",
    "is_demo": 1
  },
  {
    "id": "RSK-802",
    "severity": "High",
    "title": "Imminent Stockout for Dual-Core Controller IC",
    "category": "Inventory Depletion",
    "affected_sku": "SC-MCU-7740",
    "product_name": "Low-Power Dual-Core Controller IC",
    "supplier": "Apex Microelectronics Corp",
    "current_stock": 45,
    "days_until_depletion": 2.1,
    "reason": "Consumption rate jumped by 34% this week. Current on-hand (45 units) is critically under safety stock (110 units).",
    "impact": "Backorder risk on primary IoT assembly line; 180 customer units in jeopardy.",
    "suggested_action": "Expedite PO reorder of 350 units with Apex Microelectronics; approve immediate release.",
    "detected_by": "Inventory Management Agent",
    "detected_at": "Today, 07:40 AM",
    "status": "Active Alert",
    "is_demo": 1
  },
  {
    "id": "RSK-803",
    "severity": "Medium",
    "title": "Forecast Surge Mismatch for Edge Processors",
    "category": "Demand Anomaly",
    "affected_sku": "SC-CHIP-9902",
    "product_name": "High-Bandwidth Neural Edge Processor",
    "supplier": "Apex Microelectronics Corp",
    "current_stock": 142,
    "days_until_depletion": 7.0,
    "reason": "7-day demand model predicts +42% spike due to seasonal enterprise rollouts, exceeding baseline safety buffer.",
    "impact": "Stockout possible by next Friday if in-transit PO-2026-901 faces customs delay.",
    "suggested_action": "Pre-authorize secondary buffer PO for 150 units with 48h SLA clause.",
    "detected_by": "Demand Forecasting Agent",
    "detected_at": "Yesterday, 04:30 PM",
    "status": "Monitoring",
    "is_demo": 1
  },
  {
    "id": "RSK-804",
    "severity": "Low",
    "title": "Supplier On-Time Drift for Battery Cells",
    "category": "Vendor Performance",
    "affected_sku": "SC-BATT-6200",
    "product_name": "Solid-State Li-Ion Modular Cell Pack",
    "supplier": "Solaria Battery Cell Tech",
    "current_stock": 98,
    "days_until_depletion": 11.2,
    "reason": "Average lead time expanded from 15 to 19 days over the past 3 shipments.",
    "impact": "Mild lead time variance; inventory remains within safe threshold for 11 days.",
    "suggested_action": "Re-negotiate SLA terms or adjust safety stock formula by +15%.",
    "detected_by": "Supplier Recommendation Agent",
    "detected_at": "2 days ago",
    "status": "Acknowledged",
    "is_demo": 1
  }
]

DEMO_RECOMMENDATIONS = [
  {
    "id": "REC-101",
    "title": "Approve Emergency Reorder: SC-MCU-7740",
    "priority": "Urgent",
    "agent_source": "Coordinator Agent (Inventory + Forecasting)",
    "summary": "Stock at 45 units (below critical safety buffer 110). Projected 7-day demand is 148 units.",
    "details": "The Demand Forecasting Agent detected a 34% velocity acceleration, while the Inventory Agent flagged safety stock breach. Coordinator recommends placing a purchase order for 350 units with Apex Microelectronics (lead time: 14 days).",
    "suggested_quantity": 350,
    "estimated_cost": "$5,775.00",
    "recommended_supplier": "Apex Microelectronics Corp",
    "action_type": "CREATE_PO",
    "sku": "SC-MCU-7740",
    "status": "Pending Approval",
    "is_demo": 1
  },
  {
    "id": "REC-102",
    "title": "Diversify Supplier Allocation: Gold Wire Harness",
    "priority": "High",
    "agent_source": "Coordinator Agent (Risk + Supplier Agents)",
    "summary": "Shenzhen FastLink order PO-2026-902 delayed 6 days; on-time rate down to 74.5%.",
    "details": "Supplier Recommendation Agent computed alternative scoring: Nordic Polychem has a 96.8% reliability rating and 8-day lead time. Coordinator advises re-allocating upcoming PO batch of 300 units to Nordic Polychem.",
    "suggested_quantity": 300,
    "estimated_cost": "$10,200.00",
    "recommended_supplier": "Nordic Polychem Logistics",
    "action_type": "REALLOCATE_SUPPLIER",
    "sku": "SC-CONN-8812",
    "status": "Pending Approval",
    "is_demo": 1
  },
  {
    "id": "REC-103",
    "title": "Dynamic Safety Buffer Adjustment: SC-CHIP-9902",
    "priority": "Medium",
    "agent_source": "Demand Forecasting Agent",
    "summary": "Quarterly sales trend indicates structural +28% demand shift across enterprise edge chips.",
    "details": "Machine learning time-series regression projects baseline daily sales to increase from 18 to 25 units. Recommend increasing ERP safety buffer from 100 to 160 units to prevent stockouts.",
    "suggested_quantity": 60,
    "estimated_cost": "Policy Update",
    "recommended_supplier": "Apex Microelectronics Corp",
    "action_type": "ADJUST_SAFETY_STOCK",
    "sku": "SC-CHIP-9902",
    "status": "Pending Approval",
    "is_demo": 1
  }
]

def seed_database(force: bool = False):
    """Seed the database with initial DEMO DATA if empty or forced."""
    init_db()

    with get_db() as conn:
        cursor = conn.cursor()

        # Check if already seeded
        cursor.execute("SELECT COUNT(*) as count FROM products;")
        prod_count = cursor.fetchone()["count"]

        if prod_count > 0 and not force:
            print("Database already contains records. Skipping seed.")
            return

        if force:
            cursor.execute("DELETE FROM daily_sales;")
            cursor.execute("DELETE FROM recommendations;")
            cursor.execute("DELETE FROM risk_alerts;")
            cursor.execute("DELETE FROM purchase_orders;")
            cursor.execute("DELETE FROM products;")
            cursor.execute("DELETE FROM suppliers;")
            cursor.execute("DELETE FROM agent_logs;")

        print("Seeding suppliers...")
        for s in DEMO_SUPPLIERS:
            cursor.execute("""
            INSERT INTO suppliers (id, name, category, location, on_time_rate, defect_rate, avg_lead_days, cost_score, reliability_score, active_orders, status, is_demo)
            VALUES (:id, :name, :category, :location, :on_time_rate, :defect_rate, :avg_lead_days, :cost_score, :reliability_score, :active_orders, :status, :is_demo)
            """, s)

        print("Seeding products...")
        for p in DEMO_PRODUCTS:
            cursor.execute("""
            INSERT INTO products (id, sku, name, category, stock, reorder_level, safety_stock, unit_cost, selling_price, supplier_id, supplier_name, lead_time_days, status, velocity, is_demo)
            VALUES (:id, :sku, :name, :category, :stock, :reorder_level, :safety_stock, :unit_cost, :selling_price, :supplier_id, :supplier_name, :lead_time_days, :status, :velocity, :is_demo)
            """, p)

        print("Generating 60 days of historical daily sales for machine learning regression...")
        random.seed(42)  # Deterministic seed for reproducible evaluation
        base_date = datetime(2026, 10, 9)

        for p in DEMO_PRODUCTS:
            sku = p["sku"]
            base_sales = 25 if p["velocity"] == "High" else 15 if p["velocity"] == "Medium" else 8

            for day_offset in range(60, 0, -1):
                cur_date = base_date - timedelta(days=day_offset)
                date_str = cur_date.strftime("%Y-%m-%d")

                # Day of week seasonality: Mon-Fri higher, Sat-Sun lower
                day_of_week = cur_date.weekday()
                seasonality = 1.25 if day_of_week in [1, 2, 3] else (0.75 if day_of_week in [5, 6] else 1.0)
                
                # Upward trend for semiconductors/connectors
                trend = 1.0 + (60 - day_offset) * 0.005 if sku in ["SC-CHIP-9902", "SC-MCU-7740"] else 1.0
                noise = random.uniform(0.85, 1.15)

                qty = max(1, int(base_sales * seasonality * trend * noise))
                revenue = round(qty * p["selling_price"], 2)

                cursor.execute("""
                INSERT INTO daily_sales (sku, sale_date, quantity_sold, revenue, is_demo)
                VALUES (?, ?, ?, ?, 1)
                """, (sku, date_str, qty, revenue))

        print("Seeding purchase orders...")
        for o in DEMO_ORDERS:
            cursor.execute("""
            INSERT INTO purchase_orders (id, sku, product_name, supplier_id, supplier_name, quantity, total_value, order_date, expected_delivery, status, risk_assessment, is_demo)
            VALUES (:id, :sku, :product_name, :supplier_id, :supplier_name, :quantity, :total_value, :order_date, :expected_delivery, :status, :risk_assessment, :is_demo)
            """, o)

        print("Seeding risk alerts...")
        for r in DEMO_RISKS:
            cursor.execute("""
            INSERT INTO risk_alerts (id, severity, title, category, affected_sku, product_name, supplier, current_stock, days_until_depletion, reason, impact, suggested_action, detected_by, detected_at, status, is_demo)
            VALUES (:id, :severity, :title, :category, :affected_sku, :product_name, :supplier, :current_stock, :days_until_depletion, :reason, :impact, :suggested_action, :detected_by, :detected_at, :status, :is_demo)
            """, r)

        print("Seeding recommendations...")
        for rec in DEMO_RECOMMENDATIONS:
            cursor.execute("""
            INSERT INTO recommendations (id, title, priority, agent_source, summary, details, suggested_quantity, estimated_cost, recommended_supplier, action_type, sku, status, is_demo)
            VALUES (:id, :title, :priority, :agent_source, :summary, :details, :suggested_quantity, :estimated_cost, :recommended_supplier, :action_type, :sku, :status, :is_demo)
            """, rec)

        print("Seeding agent audit trail logs...")
        initial_logs = [
            ("10:14:02", "Coordinator Agent", "Synchronized cycle triggered. Polling agents for state updates..."),
            ("10:14:03", "Demand Forecasting Agent", "Computed 7-day regression curves for 8 active SKUs. High surge (+42%) detected on SC-CHIP-9902."),
            ("10:14:03", "Inventory Management Agent", "Scanned 8 SKUs. 2 SKUs breached safety buffer (SC-MCU-7740, SC-CONN-8812). Calculated EOQ reorders."),
            ("10:14:04", "Supply Chain Risk Agent", "Flagged High Disruption Risk: PO-2026-902 delayed 6 days by Shenzhen FastLink. Stock buffer 3.5 days."),
            ("10:14:04", "Supplier Recommendation Agent", "Evaluated alternative suppliers for SC-CONN-8812. Ranked Nordic Polychem (Reliability: 96.8) as top alternative."),
            ("10:14:05", "Coordinator Agent", "Synthesized 3 unified mitigation proposals with human-in-the-loop authorization gates.")
        ]
        print("Seeding demo user accounts...")
        cursor.execute("SELECT COUNT(*) as count FROM users;")
        if cursor.fetchone()["count"] == 0:
            import hashlib
            SALT = "smart_supply_chain_salt_2026"
            pwd_hash = hashlib.sha256(f"password123:{SALT}".encode()).hexdigest()
            demo_users = [
                ("USR-DIR01", "Alex Rivera", "director@nexussupply.ai", pwd_hash, "Logistics Director", "Nexus Global Supply Inc."),
                ("USR-MGR02", "Sarah Chen", "sarah@supply.ai", pwd_hash, "Inventory Manager", "Nexus Global Supply Inc."),
                ("USR-PRC03", "David Morales", "david@supply.ai", pwd_hash, "Procurement Lead", "Nexus Global Supply Inc.")
            ]
            for u in demo_users:
                cursor.execute("""
                INSERT OR IGNORE INTO users (id, name, email, password_hash, role, company)
                VALUES (?, ?, ?, ?, ?, ?);
                """, u)

        print("Database successfully seeded with realistic DEMO DATA!")

if __name__ == "__main__":
    seed_database(force=True)
