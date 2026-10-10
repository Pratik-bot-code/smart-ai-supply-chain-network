from fastapi import APIRouter, HTTPException
from typing import List
from database import get_db
from schemas import ProductSchema, StockUpdate

router = APIRouter(prefix="/api/products", tags=["Products & Inventory"])

@router.get("", response_model=List[ProductSchema])
def list_products():
    """Retrieve full catalog of monitored inventory SKUs."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products ORDER BY stock ASC;")
        rows = cursor.fetchall()
    return rows

@router.get("/{product_id}", response_model=ProductSchema)
def get_product(product_id: str):
    """Retrieve single product by ID or SKU."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE id = ? OR sku = ?;", (product_id, product_id))
        row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return row

@router.patch("/{product_id}/stock", response_model=ProductSchema)
def update_stock(product_id: str, payload: StockUpdate):
    """
    Adjust physical warehouse stock count.
    Dynamically recalculates status (Optimal, Low Stock, Critical).
    """
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE id = ? OR sku = ?;", (product_id, product_id))
        prod = cursor.fetchone()
        if not prod:
            raise HTTPException(status_code=404, detail="Product not found")

        new_stock = payload.stock
        reorder_lvl = prod["reorder_level"]
        safety = prod["safety_stock"]

        # Recalculate status
        if new_stock <= safety:
            new_status = "Critical"
        elif new_stock <= reorder_lvl:
            new_status = "Low Stock"
        else:
            new_status = "Optimal"

        cursor.execute("""
        UPDATE products 
        SET stock = ?, status = ? 
        WHERE id = ?;
        """, (new_stock, new_status, prod["id"]))

        cursor.execute("SELECT * FROM products WHERE id = ?;", (prod["id"],))
        updated = cursor.fetchone()

    return updated
