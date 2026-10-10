# ==============================================================================
# Smart AI Supply Chain Network - Database Engine & Connection Manager
# Default: SQLite (zero-config, portable) with MySQL migration support.
# ==============================================================================

import os
import sqlite3
from pathlib import Path
from contextlib import contextmanager
from typing import Generator

DB_FILE = Path(__file__).parent / "supply_chain.db"

def dict_factory(cursor, row):
    """Convert SQLite row tuple into a Python dictionary."""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def get_connection() -> sqlite3.Connection:
    """Create a thread-safe connection to SQLite with row dictionary factory."""
    conn = sqlite3.connect(str(DB_FILE), check_same_thread=False)
    conn.row_factory = dict_factory
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

@contextmanager
def get_db() -> Generator[sqlite3.Connection, None, None]:
    """Context manager for database transactions."""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    """Create all required tables for the Supply Chain Network if they do not exist."""
    with get_db() as conn:
        cursor = conn.cursor()

        # 1. Products & Inventory Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            sku TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            stock INTEGER NOT NULL DEFAULT 0,
            reorder_level INTEGER NOT NULL DEFAULT 100,
            safety_stock INTEGER NOT NULL DEFAULT 50,
            unit_cost REAL NOT NULL DEFAULT 0.0,
            selling_price REAL NOT NULL DEFAULT 0.0,
            supplier_id TEXT NOT NULL,
            supplier_name TEXT NOT NULL,
            lead_time_days INTEGER NOT NULL DEFAULT 7,
            status TEXT NOT NULL DEFAULT 'Optimal',
            velocity TEXT NOT NULL DEFAULT 'Medium',
            is_demo INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # 2. Suppliers Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS suppliers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            location TEXT NOT NULL,
            on_time_rate REAL NOT NULL DEFAULT 90.0,
            defect_rate REAL NOT NULL DEFAULT 1.0,
            avg_lead_days INTEGER NOT NULL DEFAULT 10,
            cost_score INTEGER NOT NULL DEFAULT 80,
            reliability_score REAL NOT NULL DEFAULT 85.0,
            active_orders INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'Preferred',
            is_demo INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # 3. Daily Sales History (Used by Demand Forecasting Agent)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS daily_sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sku TEXT NOT NULL,
            sale_date TEXT NOT NULL,
            quantity_sold INTEGER NOT NULL,
            revenue REAL NOT NULL,
            is_demo INTEGER NOT NULL DEFAULT 1,
            FOREIGN KEY (sku) REFERENCES products(sku) ON DELETE CASCADE
        );
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_sales_sku_date ON daily_sales(sku, sale_date);")

        # 4. Purchase Orders Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS purchase_orders (
            id TEXT PRIMARY KEY,
            sku TEXT NOT NULL,
            product_name TEXT NOT NULL,
            supplier_id TEXT NOT NULL,
            supplier_name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            total_value REAL NOT NULL,
            order_date TEXT NOT NULL,
            expected_delivery TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Pending',
            risk_assessment TEXT,
            is_demo INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # 5. Supply Chain Risk Alerts Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS risk_alerts (
            id TEXT PRIMARY KEY,
            severity TEXT NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            affected_sku TEXT NOT NULL,
            product_name TEXT NOT NULL,
            supplier TEXT NOT NULL,
            current_stock INTEGER NOT NULL,
            days_until_depletion REAL NOT NULL,
            reason TEXT NOT NULL,
            impact TEXT NOT NULL,
            suggested_action TEXT NOT NULL,
            detected_by TEXT NOT NULL,
            detected_at TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Active Alert',
            is_demo INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # 6. Autonomous Coordinator Recommendations Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS recommendations (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            priority TEXT NOT NULL,
            agent_source TEXT NOT NULL,
            summary TEXT NOT NULL,
            details TEXT NOT NULL,
            suggested_quantity INTEGER NOT NULL,
            estimated_cost TEXT NOT NULL,
            recommended_supplier TEXT NOT NULL,
            action_type TEXT NOT NULL,
            sku TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Pending Approval',
            is_demo INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # 7. Agent Audit Trail Logs
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS agent_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            log_time TEXT NOT NULL,
            agent_name TEXT NOT NULL,
            message TEXT NOT NULL
        );
        """)

        # 8. User Accounts Table (Registration & Authentication)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'Logistics Director',
            company TEXT DEFAULT 'Nexus Global Supply Inc.',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

