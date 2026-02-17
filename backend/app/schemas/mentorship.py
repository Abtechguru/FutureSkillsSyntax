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
    id: int
    assignment_id: int
    mentor_id: int
    mentee_id: int
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


# ============== Task Schemas ==============

class TaskCreate(BaseModel):
    assignment_id: int
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    code_stub: Optional[str] = None
    language: str = "javascript"
    due_date: Optional[datetime] = None


class SubmissionCreate(BaseModel):
    task_id: int
    submitted_code: str
    output: Optional[str] = None


class TaskResponse(BaseModel):
    id: int
    assignment_id: int
    title: str
    description: Optional[str] = None
    code_stub: Optional[str] = None
    language: str
    due_date: Optional[datetime] = None
    status: str
    mentor_feedback: Optional[str] = None
    grade: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class SubmissionResponse(BaseModel):
    id: int
    task_id: int
    mentee_id: int
    submitted_code: str
    output: Optional[str] = None
    mentor_comments: Optional[str] = None
    submitted_at: datetime
    
    class Config:
        from_attributes = True


# ============== Collaboration Schemas ==============

class CollaborationSync(BaseModel):
    session_id: int
    code: str
    language: Optional[str] = None


class CollaborationResponse(CollaborationSync):
    id: int
    is_active: bool
    last_updated_at: datetime
    
    class Config:
        from_attributes = True


# ============== Assignment Schemas ==============

class MentorInfo(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None
    profile_picture_url: Optional[str] = None


class AssignmentResponse(BaseModel):
    id: int
    mentor_id: int
    mentee_id: int
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
    tasks: List[TaskResponse] = []
    
    class Config:
        from_attributes = True
