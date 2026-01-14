"""Mentorship schemas."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class SessionStatus(str, Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    MISSED = "missed"


class WeekFocus(str, Enum):
    CODING_BASICS = "coding_basics"
    DIGITAL_LITERACY = "digital_literacy"
    RESPONSIBILITY = "responsibility"
    DISCIPLINE = "discipline"
    FINANCIAL_AWARENESS = "financial_awareness"
    GROWTH_MINDSET = "growth_mindset"
    PROJECT_WORK = "project_work"


# ============== Session Schemas ==============

class SessionCreate(BaseModel):
    assignment_id: str
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    topic: Optional[str] = None
    week_focus: Optional[WeekFocus] = None
    session_date: datetime
    duration_minutes: Optional[int] = 60
    learning_objectives: Optional[List[str]] = None


class SessionUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    topic: Optional[str] = None
    session_date: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    learning_objectives: Optional[List[str]] = None


class SessionComplete(BaseModel):
    reflection: str
    rating: int = Field(..., ge=1, le=5)
    mentor_notes: Optional[str] = None


class SessionResponse(BaseModel):
    id: str
    assignment_id: str
    mentor_id: str
    mentee_id: str
    title: str
    description: Optional[str] = None
    topic: Optional[str] = None
    week_focus: Optional[WeekFocus] = None
    session_date: datetime
    duration_minutes: int
    status: SessionStatus
    meeting_url: Optional[str] = None
    learning_objectives: List[str] = []
    resources: List[dict] = []
    mentor_notes: Optional[str] = None
    mentee_reflection: Optional[str] = None
    session_rating: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============== Assignment Schemas ==============

class MentorInfo(BaseModel):
    id: str
    username: str
    full_name: Optional[str] = None
    profile_picture_url: Optional[str] = None


class AssignmentResponse(BaseModel):
    id: str
    mentor_id: str
    mentee_id: str
    mentor: Optional[MentorInfo] = None
    mentee: Optional[MentorInfo] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    is_active: bool
    current_week: int
    completed_modules: List[str] = []
    overall_progress: float
    mentee_satisfaction: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
