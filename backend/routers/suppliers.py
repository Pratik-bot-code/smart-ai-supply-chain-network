from fastapi import APIRouter
from typing import List
from database import get_db
from schemas import SupplierSchema

router = APIRouter(prefix="/api/suppliers", tags=["Suppliers"])

@router.get("", response_model=List[SupplierSchema])
def list_suppliers():
    """Retrieve certified supplier records with reliability and defect metrics."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM suppliers ORDER BY reliability_score DESC;")
        rows = cursor.fetchall()
    return rows
