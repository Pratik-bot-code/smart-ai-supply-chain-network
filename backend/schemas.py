# ==============================================================================
# Smart AI Supply Chain Network - Pydantic Request/Response Schemas
# ==============================================================================

from typing import List, Optional
from pydantic import BaseModel, Field

# --- Dashboard & Summary ---
class DashboardSummary(BaseModel):
    totalProducts: int
    lowStockProducts: int
    pendingOrders: int
    activeRisks: int
    totalInventoryValue: float
    avgOnTimeDelivery: str
    isDemo: bool = True

# --- Products & Inventory ---
class ProductSchema(BaseModel):
    id: str
    sku: str
    name: str
    category: str
    stock: int
    reorderLevel: int = Field(alias="reorder_level")
    safetyStock: int = Field(alias="safety_stock")
    unitCost: float = Field(alias="unit_cost")
    sellingPrice: float = Field(alias="selling_price")
    supplierId: str = Field(alias="supplier_id")
    supplierName: str = Field(alias="supplier_name")
    leadTimeDays: int = Field(alias="lead_time_days")
    status: str
    velocity: str
    isDemo: bool = Field(default=True, alias="is_demo")

    class Config:
        populate_by_name = True

class StockUpdate(BaseModel):
    stock: int = Field(..., ge=0, description="New physical stock count")

# --- Suppliers ---
class SupplierSchema(BaseModel):
    id: str
    name: str
    category: str
    location: str
    onTimeRate: float = Field(alias="on_time_rate")
    defectRate: float = Field(alias="defect_rate")
    avgLeadDays: int = Field(alias="avg_lead_days")
    costScore: int = Field(alias="cost_score")
    reliabilityScore: float = Field(alias="reliability_score")
    activeOrders: int = Field(alias="active_orders")
    status: str
    isDemo: bool = Field(default=True, alias="is_demo")

    class Config:
        populate_by_name = True

# --- Orders ---
class PurchaseOrderCreate(BaseModel):
    sku: str
    productName: Optional[str] = None
    supplierId: Optional[str] = None
    supplierName: Optional[str] = None
    quantity: int = Field(..., gt=0)
    totalValue: Optional[float] = None
    expectedDelivery: Optional[str] = None

class PurchaseOrderSchema(BaseModel):
    id: str
    sku: str
    productName: str = Field(alias="product_name")
    supplierId: str = Field(alias="supplier_id")
    supplierName: str = Field(alias="supplier_name")
    quantity: int
    totalValue: float = Field(alias="total_value")
    orderDate: str = Field(alias="order_date")
    expectedDelivery: str = Field(alias="expected_delivery")
    status: str
    riskAssessment: Optional[str] = Field(default=None, alias="risk_assessment")
    isDemo: bool = Field(default=True, alias="is_demo")

    class Config:
        populate_by_name = True

# --- Risk Alerts ---
class RiskAlertSchema(BaseModel):
    id: str
    severity: str
    title: str
    category: str
    affectedSku: str = Field(alias="affected_sku")
    productName: str = Field(alias="product_name")
    supplier: str
    currentStock: int = Field(alias="current_stock")
    daysUntilDepletion: float = Field(alias="days_until_depletion")
    reason: str
    impact: str
    suggestedAction: str = Field(alias="suggested_action")
    detectedBy: str = Field(alias="detected_by")
    detectedAt: str = Field(alias="detected_at")
    status: str
    isDemo: bool = Field(default=True, alias="is_demo")

    class Config:
        populate_by_name = True

# --- Recommendations ---
class RecommendationSchema(BaseModel):
    id: str
    title: str
    priority: str
    agentSource: str = Field(alias="agent_source")
    summary: str
    details: str
    suggestedQuantity: int = Field(alias="suggested_quantity")
    estimatedCost: str = Field(alias="estimated_cost")
    recommendedSupplier: str = Field(alias="recommended_supplier")
    actionType: str = Field(alias="action_type")
    sku: str
    status: str
    isDemo: bool = Field(default=True, alias="is_demo")

    class Config:
        populate_by_name = True

# --- Demand Forecasting ---
class ForecastPoint(BaseModel):
    date: str
    historical: Optional[int] = None
    predicted: Optional[int] = None
    lowerBound: Optional[int] = None
    upperBound: Optional[int] = None

class ForecastMetadata(BaseModel):
    sku: str
    productName: str
    model: str
    r2Score: float
    mae: float
    projected7DayDemand: int
    dataPointsUsed: int
    isReliable: bool
    warning: Optional[str] = None

# --- AI Agents Status ---
class AgentInfo(BaseModel):
    id: str
    name: str
    type: str
    status: str
    lastRun: str
    confidence: str
    description: str
    model: str

class AgentCycleResult(BaseModel):
    status: str
    agentsRun: int
    timestamp: str
    newInsightsGenerated: int
    details: List[str]
