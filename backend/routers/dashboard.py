from fastapi import APIRouter, HTTPException
from database import get_db
from schemas import DashboardSummary

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary():
    """Compute live dashboard summary KPIs from SQLite database."""
    with get_db() as conn:
        cursor = conn.cursor()

        # Total Products
        cursor.execute("SELECT COUNT(*) as count FROM products;")
        total_products = cursor.fetchone()["count"]

        # Low Stock or Critical Products
        cursor.execute("SELECT COUNT(*) as count FROM products WHERE stock <= reorder_level;")
        low_stock_products = cursor.fetchone()["count"]

        # Pending or In-Transit Orders
        cursor.execute("SELECT COUNT(*) as count FROM purchase_orders WHERE status IN ('Pending', 'In Transit');")
        pending_orders = cursor.fetchone()["count"]

        # Active Risks
        cursor.execute("SELECT COUNT(*) as count FROM risk_alerts WHERE status = 'Active Alert';")
        active_risks = cursor.fetchone()["count"]

        # Total Inventory Value
        cursor.execute("SELECT SUM(stock * unit_cost) as val FROM products;")
        row_val = cursor.fetchone()["val"]
        total_inventory_value = round(float(row_val or 0.0), 2)

        # Average Supplier On-time rate
        cursor.execute("SELECT AVG(on_time_rate) as avg_rate FROM suppliers;")
        avg_row = cursor.fetchone()["avg_rate"]
        avg_rate_str = f"{float(avg_row or 90.0):.1f}"

    return {
        "totalProducts": total_products,
        "lowStockProducts": low_stock_products,
        "pendingOrders": pending_orders,
        "activeRisks": active_risks,
        "totalInventoryValue": total_inventory_value,
        "avgOnTimeDelivery": avg_rate_str,
        "isDemo": True
    }
