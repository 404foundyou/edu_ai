# models/user.py
# Defines the User data structure using Pydantic
# Pydantic validates data automatically — wrong types = instant error

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Used when registering a new user (input)
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

# Used when logging in (input)
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Used when returning user data to frontend (output)
# Notice: no password field — never send password to frontend
class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime