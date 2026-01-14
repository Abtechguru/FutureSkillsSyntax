"""Learning schemas."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class Difficulty(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class ContentType(str, Enum):
    VIDEO = "video"
    ARTICLE = "article"
    QUIZ = "quiz"
    EXERCISE = "exercise"
    PROJECT = "project"


class ProgressStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class EnrollmentStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    ABANDONED = "abandoned"


# ============== Modules ==============

class ModuleResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    order_index: int
    content_type: ContentType
    duration_minutes: int
    xp_reward: int
    status: ProgressStatus = ProgressStatus.NOT_STARTED
    progress_percentage: float = 0
    completed_at: Optional[datetime] = None


# ============== Learning Paths ==============

class LearningPathResponse(BaseModel):
    id: str
    title: str
    slug: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[Difficulty] = None
    estimated_hours: Optional[int] = None
    total_modules: int = 0
    skills_covered: List[str] = []
    is_featured: bool = False
    is_enrolled: bool = False
    progress_percentage: float = 0
    enrollment_status: Optional[EnrollmentStatus] = None
    current_module_id: Optional[str] = None
    modules: Optional[List[ModuleResponse]] = None


# ============== Enrollment ==============

class EnrollmentResponse(BaseModel):
    user_id: str
    path_id: str
    status: EnrollmentStatus
    progress_percentage: float = 0
    enrolled_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


# ============== Progress ==============

class ProgressUpdate(BaseModel):
    video_progress_seconds: Optional[int] = None
    quiz_score: Optional[float] = None


class ModuleProgressResponse(BaseModel):
    module_id: str
    status: ProgressStatus
    progress_percentage: float
    video_progress_seconds: Optional[int] = None
    quiz_score: Optional[float] = None
    completed_at: Optional[datetime] = None


# ============== Certificate ==============

class CertificateResponse(BaseModel):
    id: str
    path_id: str
    certificate_number: str
    issue_date: datetime
    verification_url: Optional[str] = None
    pdf_url: Optional[str] = None
