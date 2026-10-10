import random
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException
from typing import List
from database import get_db
from schemas import PurchaseOrderSchema, PurchaseOrderCreate

router = APIRouter(prefix="/api/orders", tags=["Purchase Orders"])

@router.get("", response_model=List[PurchaseOrderSchema])
def list_orders():
    """Retrieve all recorded purchase orders."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM purchase_orders ORDER BY order_date DESC;")
        rows = cursor.fetchall()
    return rows

@router.post("", response_model=PurchaseOrderSchema, status_code=201)
def create_order(payload: PurchaseOrderCreate):
    """
    Issue a new purchase order with explicit human validation.
    """
    with get_db() as conn:
        cursor = conn.cursor()

        # Query product to fetch supplier and pricing if missing
        cursor.execute("SELECT name, unit_cost, supplier_id, supplier_name, lead_time_days FROM products WHERE sku = ?;", (payload.sku,))
        prod = cursor.fetchone()

        prod_name = payload.productName or (prod["name"] if prod else payload.sku)
        supp_id = payload.supplierId or (prod["supplier_id"] if prod else "SUP-001")
        supp_name = payload.supplierName or (prod["supplier_name"] if prod else "Standard Vendor")
        unit_cost = prod["unit_cost"] if prod else 50.0
        lead_days = prod["lead_time_days"] if prod else 14
        total_val = payload.totalValue or (payload.quantity * unit_cost)

        po_id = f"PO-{datetime.now().year}-{random.randint(100, 999)}"
        today_str = datetime.now().strftime("%Y-%m-%d")
        expected_str = payload.expectedDelivery or (datetime.now() + timedelta(days=lead_days)).strftime("%Y-%m-%d")

        cursor.execute("""
        INSERT INTO purchase_orders (id, sku, product_name, supplier_id, supplier_name, quantity, total_value, order_date, expected_delivery, status, risk_assessment, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Manual / API Procurement', 1);
        """, (po_id, payload.sku, prod_name, supp_id, supp_name, payload.quantity, total_val, today_str, expected_str))

        cursor.execute("SELECT * FROM purchase_orders WHERE id = ?;", (po_id,))
        created = cursor.fetchone()

    return created
