# ==============================================================================
# Agent A: Demand Forecasting Agent
# Specialization: Predictive Time-Series Analytics & Anomaly Detection
# Uses: Scikit-learn Ridge Regression & Rolling Time-Series Feature Engineering
# ==============================================================================

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, r2_score

from database import get_db
from config import MIN_HISTORICAL_DAYS_FOR_FORECAST

class DemandForecastingAgent:
    """
    Analyzes historical product sales velocity, seasonality, and moving averages
    to predict 7-day demand horizons with 95% confidence intervals.
    """

    def __init__(self, min_days: int = MIN_HISTORICAL_DAYS_FOR_FORECAST):
        self.min_days = min_days

    def get_sales_history(self, sku: str) -> pd.DataFrame:
        """Fetch historical daily sales for a given SKU from SQLite database."""
        with get_db() as conn:
            query = """
            SELECT sale_date, quantity_sold, revenue 
            FROM daily_sales 
            WHERE sku = ? 
            ORDER BY sale_date ASC;
            """
            cursor = conn.cursor()
            cursor.execute(query, (sku,))
            rows = cursor.fetchall()

        if not rows:
            return pd.DataFrame()

        df = pd.DataFrame(rows)
        df["sale_date"] = pd.to_datetime(df["sale_date"])
        df = df.sort_values("sale_date").reset_index(drop=True)
        return df

    def predict_7_day_demand(self, sku: str) -> Dict[str, Any]:
        """
        Train a Scikit-Learn regression model on daily sales time-series
        and forecast the next 7 calendar days.
        """
        df = self.get_sales_history(sku)

        # Transparency check: verify sufficient data points
        if len(df) < self.min_days:
            return {
                "sku": sku,
                "isReliable": False,
                "warning": f"Insufficient historical data: {len(df)} days found (minimum {self.min_days} days required).",
                "chartData": [],
                "metadata": {
                    "r2Score": 0.0,
                    "mae": 0.0,
                    "projected7DayDemand": 0,
                    "model": "Fallback Heuristic"
                }
            }

        # Feature Engineering:
        # 1. Day of week (0 to 6)
        # 2. Time index (trend component)
        # 3. Rolling 7-day moving average
        df["day_of_week"] = df["sale_date"].dt.dayofweek
        df["time_idx"] = np.arange(len(df))
        df["rolling_7"] = df["quantity_sold"].rolling(window=7, min_periods=1).mean()

        # One-hot encode day of week
        dow_dummies = pd.get_dummies(df["day_of_week"], prefix="dow", drop_first=False)
        for d in range(7):
            col_name = f"dow_{d}"
            if col_name not in dow_dummies.columns:
                dow_dummies[col_name] = 0

        X = pd.concat([df[["time_idx", "rolling_7"]], dow_dummies], axis=1)
        y = df["quantity_sold"].values

        # Train Scikit-Learn Regularized Ridge Regression
        model = Ridge(alpha=1.0)
        model.fit(X, y)

        # In-sample predictions & error statistics
        y_pred = model.predict(X)
        r2 = max(0.0, float(r2_score(y, y_pred)))
        mae = float(mean_absolute_error(y, y_pred))
        residuals = y - y_pred
        std_error = float(np.std(residuals)) if len(residuals) > 1 else 2.0
        confidence_margin = 1.96 * std_error

        # Generate 7 Future Days Forecast
        last_date = df["sale_date"].max()
        last_time_idx = df["time_idx"].max()
        last_rolling = df["quantity_sold"].tail(7).mean()

        future_rows = []
        future_chart_points = []
        projected_sum = 0

        current_rolling = last_rolling

        for i in range(1, 8):
            future_date = last_date + timedelta(days=i)
            future_dow = future_date.weekday()
            future_time_idx = last_time_idx + i

            # Construct feature vector
            feat_dict = {
                "time_idx": future_time_idx,
                "rolling_7": current_rolling
            }
            for d in range(7):
                feat_dict[f"dow_{d}"] = 1 if d == future_dow else 0

            feat_df = pd.DataFrame([feat_dict])
            pred_val = max(1, int(round(model.predict(feat_df)[0])))
            projected_sum += pred_val

            # Update rolling mean estimate for next step
            current_rolling = (current_rolling * 6 + pred_val) / 7

            lower_bound = max(0, int(round(pred_val - confidence_margin)))
            upper_bound = int(round(pred_val + confidence_margin))

            date_label = f"{future_date.strftime('%m/%d')} (+{i}d)"

            future_chart_points.append({
                "date": date_label,
                "historical": None,
                "predicted": pred_val,
                "lowerBound": lower_bound,
                "upperBound": upper_bound
            })

        # Format historical chart points (display last 14 days for clean visualization)
        historical_chart_points = []
        recent_df = df.tail(14)

        for _, row in recent_df.iterrows():
            d_str = row["sale_date"].strftime("%m/%d")
            historical_chart_points.append({
                "date": d_str,
                "historical": int(row["quantity_sold"]),
                "predicted": None,
                "lowerBound": None,
                "upperBound": None
            })

        # Connect the last historical point with the first forecast point
        if historical_chart_points and future_chart_points:
            last_hist = historical_chart_points[-1]
            last_hist["date"] = f"{last_hist['date']} (Today)"
            last_hist["predicted"] = last_hist["historical"]
            last_hist["lowerBound"] = max(0, int(round(last_hist["historical"] - confidence_margin)))
            last_hist["upperBound"] = int(round(last_hist["historical"] + confidence_margin))

        chart_data = historical_chart_points + future_chart_points

        return {
            "sku": sku,
            "isReliable": True,
            "model": "Scikit-Learn Ridge Time-Series Regressor",
            "r2Score": round(r2, 3),
            "mae": round(mae, 2),
            "projected7DayDemand": int(projected_sum),
            "dataPointsUsed": len(df),
            "chartData": chart_data
        }
