from fastapi import APIRouter, HTTPException, Query
from typing import List, Union, Dict, Any
from agents.demand_forecasting import DemandForecastingAgent

router = APIRouter(prefix="/api/forecast", tags=["Demand Forecasting"])
agent = DemandForecastingAgent()

@router.get("/{sku}")
def get_forecast(sku: str, details: bool = Query(default=False)):
    """
    Run the Demand Forecasting Agent Scikit-Learn regression model for a given SKU.
    Returns 14-day historical consumption + 7-day predicted curve with 95% confidence bounds.
    """
    res = agent.predict_7_day_demand(sku)

    if not res.get("isReliable") and not res.get("chartData"):
        raise HTTPException(
            status_code=400,
            detail=res.get("warning", "Insufficient historical sales data for forecasting.")
        )

    if details:
        return res

    # By default, return the list of chart data points for seamless Recharts rendering
    return res["chartData"]

@router.get("/{sku}/details")
def get_forecast_details(sku: str):
    """Return forecast predictions alongside full regression metrics (R2, MAE, data points)."""
    return agent.predict_7_day_demand(sku)
