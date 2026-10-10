import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import PlainTextResponse
from typing import Dict, Any

from database import get_db

router = APIRouter(prefix="/api/data", tags=["Dataset Ingestion"])

REQUIRED_SALES_COLUMNS = {"sku", "date", "quantity_sold"}

@router.post("/import-csv")
async def import_csv_dataset(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Ingest custom or Kaggle supply-chain CSV dataset.
    Validates schema and appends valid daily sales rows into the database for forecasting models.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a .csv file.")

    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")

    # Clean header column names (lower case and strip whitespace)
    df.columns = [col.strip().lower() for col in df.columns]

    # Flexible column matching
    column_mapping = {}
    for col in df.columns:
        if col in ["sku", "product_sku", "product_id"]:
            column_mapping[col] = "sku"
        elif col in ["date", "sale_date", "timestamp"]:
            column_mapping[col] = "date"
        elif col in ["quantity_sold", "quantity", "units_sold", "sales", "demand"]:
            column_mapping[col] = "quantity_sold"
        elif col in ["revenue", "sales_value", "total_price"]:
            column_mapping[col] = "revenue"

    df = df.rename(columns=column_mapping)

    missing = REQUIRED_SALES_COLUMNS - set(df.columns)
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"CSV schema invalid. Missing required columns: {list(missing)}. Expected: sku, date, quantity_sold"
        )

    # Insert into database
    imported_count = 0
    with get_db() as conn:
        cursor = conn.cursor()
        for _, row in df.iterrows():
            try:
                sku_val = str(row["sku"]).strip()
                date_val = str(row["date"]).strip()
                qty_val = int(row["quantity_sold"])
                rev_val = float(row.get("revenue", qty_val * 45.0))

                cursor.execute("""
                INSERT INTO daily_sales (sku, sale_date, quantity_sold, revenue, is_demo)
                VALUES (?, ?, ?, ?, 0);
                """, (sku_val, date_val, qty_val, rev_val))
                imported_count += 1
            except Exception:
                continue

    return {
        "success": True,
        "filename": file.filename,
        "recordsImported": imported_count,
        "message": f"Successfully ingested {imported_count} sales time-series records. Machine learning models will now train on updated data."
    }

@router.get("/template", response_class=PlainTextResponse)
def get_sample_csv_template():
    """Download standard CSV template header for sales ingestion."""
    template = "date,sku,quantity_sold,revenue\n2026-10-01,SC-CHIP-9902,34,9520.00\n2026-10-02,SC-CHIP-9902,28,7840.00\n2026-10-01,SC-CONN-8812,19,1501.00\n"
    return template
