from .dashboard import router as dashboard_router
from .products import router as products_router
from .orders import router as orders_router
from .suppliers import router as suppliers_router
from .forecasting import router as forecasting_router
from .risks import router as risks_router
from .recommendations import router as recommendations_router
from .agents import router as agents_router
from .data_import import router as data_import_router
from .auth import router as auth_router

__all__ = [
    "dashboard_router",
    "products_router",
    "orders_router",
    "suppliers_router",
    "forecasting_router",
    "risks_router",
    "recommendations_router",
    "agents_router",
    "data_import_router",
    "auth_router"
]

