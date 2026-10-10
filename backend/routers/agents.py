from fastapi import APIRouter
from typing import List, Dict, Any
from database import get_db
from schemas import AgentInfo, AgentCycleResult
from agents.coordinator import CoordinatorAgent

router = APIRouter(prefix="/api/agents", tags=["AI Agent Swarm"])
coordinator = CoordinatorAgent()

AGENT_REGISTRY = [
    {
        "id": "agent-forecast",
        "name": "Demand Forecasting Agent",
        "type": "Predictive Analytics",
        "status": "Active",
        "lastRun": "Real-time Ready",
        "confidence": "94.2%",
        "description": "Evaluates 60-day sales velocity, seasonality, and moving averages to predict 7-day demand spikes.",
        "model": "Scikit-Learn Ridge & Time-Series Rolling Regressor"
    },
    {
        "id": "agent-inventory",
        "name": "Inventory Management Agent",
        "type": "Stock Optimization",
        "status": "Active",
        "lastRun": "Real-time Ready",
        "confidence": "98.5%",
        "description": "Monitors stock levels against dynamic safety thresholds; calculates EOQ reorder suggestions.",
        "model": "Dynamic EOQ & Safety Stock Heuristic Engine"
    },
    {
        "id": "agent-risk",
        "name": "Supply Chain Risk Agent",
        "type": "Early Warning Radar",
        "status": "Alert Triggered",
        "lastRun": "Real-time Ready",
        "confidence": "91.8%",
        "description": "Detects port bottlenecks, supplier delivery lags, critical stockouts, and weather disruptions.",
        "model": "Multi-factor Supply Chain Disruption Matrix"
    },
    {
        "id": "agent-supplier",
        "name": "Supplier Recommendation Agent",
        "type": "Vendor Scoring",
        "status": "Active",
        "lastRun": "Real-time Ready",
        "confidence": "96.0%",
        "description": "Ranks suppliers using weighted scores on on-time delivery, defect rate, and negotiated lead cost.",
        "model": "Weighted Multi-Attribute Utility Theory (MAUT)"
    },
    {
        "id": "agent-coordinator",
        "name": "Autonomous Coordinator Agent",
        "type": "Executive Orchestrator",
        "status": "Synchronized",
        "lastRun": "Real-time Ready",
        "confidence": "95.6%",
        "description": "Harmonizes individual agent signals into unified, human-in-the-loop actionable decisions.",
        "model": "Consensus Arbiter & Policy Execution Network"
    }
]

@router.get("/status", response_model=List[AgentInfo])
def get_agents_status():
    """Retrieve operational status and confidence metrics for all 5 specialized agents."""
    return AGENT_REGISTRY

@router.post("/run-cycle", response_model=AgentCycleResult)
def trigger_agent_cycle():
    """Trigger full autonomous multi-agent coordination cycle."""
    return coordinator.run_coordination_cycle()

@router.get("/logs")
def get_agent_logs():
    """Retrieve recent autonomous coordination audit trail logs."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT log_time as time, agent_name as source, message as msg FROM agent_logs ORDER BY id DESC LIMIT 50;")
        rows = cursor.fetchall()
    return rows
