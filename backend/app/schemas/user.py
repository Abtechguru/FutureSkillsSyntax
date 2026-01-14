"""User schemas."""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    MENTOR = "mentor"
    MENTEE = "mentee"
    CAREER_SEEKER = "career_seeker"
    PARENT_GUARDIAN = "parent_guardian"


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    NON_BINARY = "non_binary"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


# ============== Auth Schemas ==============

class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None
    role: UserRole = UserRole.CAREER_SEEKER
    gender: Optional[Gender] = None


class LoginRequest(BaseModel):
    username: str  # Can be email or username
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    password: str = Field(..., min_length=8)


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


# ============== User Schemas ==============

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    role: UserRole
    gender: Optional[Gender] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None
    phone_number: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    phone_number: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    gender: Optional[Gender] = None


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    role: UserRole
    gender: Optional[Gender] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None
    phone_number: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    experience_points: int = 0
    current_level: int = 1
    is_verified: bool = False
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserPublicResponse(BaseModel):
    """Public user info (for other users to see)."""
    id: str
    username: str
    full_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    bio: Optional[str] = None
    current_level: int = 1
    
    class Config:
        from_attributes = True