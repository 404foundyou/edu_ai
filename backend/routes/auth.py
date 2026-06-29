# routes/auth.py
# Handles all authentication endpoints
# /register — create new user
# /login    — get JWT token
# /me       — get current logged in user

from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from bson import ObjectId
from models.user import UserRegister, UserLogin, UserResponse
from services.auth_service import hash_password, verify_password, generate_token
from middleware.auth_middleware import get_current_user
from database import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

# ── Register ─────────────────────────────────────────────

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    db = get_db()

    # Check if email already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password before saving
    hashed = hash_password(user.password)

    # Build user document
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed,
        "created_at": datetime.utcnow()
    }

    # Save to MongoDB
    result = await db.users.insert_one(new_user)

    # Generate JWT token
    token = generate_token(str(result.inserted_id))

    return {
        "message": "Account created successfully",
        "token": token,
        "user": {
            "id": str(result.inserted_id),
            "name": user.name,
            "email": user.email
        }
    }

# ── Login ─────────────────────────────────────────────────

@router.post("/login")
async def login(credentials: UserLogin):
    db = get_db()

    # Find user by email
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Generate JWT token
    token = generate_token(str(user["_id"]))

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }

# ── Me (get current user) ─────────────────────────────────

@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "created_at": current_user["created_at"]
    }