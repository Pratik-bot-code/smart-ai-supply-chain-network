# ==============================================================================
# Smart AI Supply Chain Network - Authentication & Registration Router
# Supports secure account registration, login verification & SQLite persistence.
# ==============================================================================

import uuid
import hashlib
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from database import get_db

router = APIRouter(prefix="/api/auth", tags=["Authentication & Registration"])

SALT = "smart_supply_chain_salt_2026"

def hash_password(password: str) -> str:
    """Hash password using SHA-256 with cryptographic application salt."""
    return hashlib.sha256(f"{password}:{SALT}".encode("utf-8")).hexdigest()

# --- Schemas ---
class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=120)
    password: str = Field(..., min_length=6)
    role: Optional[str] = "Supply Chain Employee"
    company: Optional[str] = "Nexus Global Supply Inc."

class UserLoginRequest(BaseModel):
    email: str = Field(..., min_length=5)
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    company: str
    avatar: str

class AuthResponse(BaseModel):
    success: bool
    message: str
    token: str
    user: UserResponse

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegisterRequest):
    """
    Register a new user account and persist directly into the SQLite database.
    """
    email_clean = payload.email.lower().strip()
    name_clean = payload.name.strip()
    role_clean = payload.role.strip() if payload.role else "Supply Chain Employee"
    company_clean = payload.company.strip() if payload.company else "Nexus Global Supply Inc."

    with get_db() as conn:
        cursor = conn.cursor()

        # Check for existing email
        cursor.execute("SELECT id FROM users WHERE email = ?;", (email_clean,))
        existing = cursor.fetchone()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address is already registered. Please sign in instead."
            )

        # Generate User ID & hash password
        user_id = f"USR-{uuid.uuid4().hex[:8].upper()}"
        pwd_hash = hash_password(payload.password)

        cursor.execute("""
        INSERT INTO users (id, name, email, password_hash, role, company)
        VALUES (?, ?, ?, ?, ?, ?);
        """, (user_id, name_clean, email_clean, pwd_hash, role_clean, company_clean))

    initials = "".join([part[0] for part in name_clean.split()[:2]]).upper() or "US"
    user_data = UserResponse(
        id=user_id,
        name=name_clean,
        email=email_clean,
        role=role_clean,
        company=company_clean,
        avatar=initials
    )

    return AuthResponse(
        success=True,
        message=f"Account successfully registered for {name_clean}! You can now log in.",
        token=f"jwt_sim_{user_id}_{uuid.uuid4().hex[:12]}",
        user=user_data
    )

@router.post("/login", response_model=AuthResponse)
def login_user(payload: UserLoginRequest):
    """
    Authenticate registered user against credentials stored in SQLite database.
    """
    email_clean = payload.email.lower().strip()
    pwd_hash = hash_password(payload.password)

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?;", (email_clean,))
        user_row = cursor.fetchone()

    if not user_row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account not found with this email. Please register first."
        )

    if user_row["password_hash"] != pwd_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your password."
        )

    initials = "".join([part[0] for part in user_row["name"].split()[:2]]).upper() or "US"
    user_data = UserResponse(
        id=user_row["id"],
        name=user_row["name"],
        email=user_row["email"],
        role=user_row["role"],
        company=user_row["company"] or "Nexus Global Supply Inc.",
        avatar=initials
    )

    return AuthResponse(
        success=True,
        message=f"Welcome back, {user_row['name']}!",
        token=f"jwt_sim_{user_row['id']}_{uuid.uuid4().hex[:12]}",
        user=user_data
    )

@router.get("/users")
def list_registered_users():
    """List registered users (excluding sensitive password hashes)."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, role, company, created_at FROM users ORDER BY created_at DESC;")
        rows = cursor.fetchall()
    return rows
