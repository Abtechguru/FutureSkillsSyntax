from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime
from app.models.user import UserRole

class UserSummary(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    role: UserRole
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True

class MentorCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str
    bio: Optional[str] = None
    phone_number: Optional[str] = None

class AssignmentCreate(BaseModel):
    mentor_id: int
    mentee_id: int
    start_date: datetime
    end_date: Optional[datetime] = None

class TransactionResponse(BaseModel):
    id: int
    user_id: int
    amount: float
    provider: str
    status: str
    reference: str
    purpose: str
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_users: int
    total_mentors: int
    total_mentees: int
    total_revenue: float
    pending_transactions: int
