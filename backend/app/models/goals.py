"""MongoDB models for Goals system using Pydantic."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic."""
    
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


# ============== Goal Models ==============

class MilestoneDB(BaseModel):
    """Milestone database model."""
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    goal_id: str
    title: str
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    target_value: Optional[float] = None
    current_value: float = 0
    is_completed: bool = False
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class GoalDB(BaseModel):
    """Goal database model."""
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str
    title: str
    description: Optional[str] = None
    category: str  # learning, career, health, finance, personal, creativity
    priority: str  # low, medium, high, critical
    status: str = "active"  # active, completed, paused, abandoned
    target_date: Optional[datetime] = None
    target_value: Optional[float] = None
    current_value: float = 0
    unit: Optional[str] = None
    progress_percentage: float = 0
    is_public: bool = False
    tags: List[str] = []
    streak_days: int = 0
    total_check_ins: int = 0
    supporters_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# ============== Habit Models ==============

class HabitDB(BaseModel):
    """Habit database model."""
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str
    title: str
    description: Optional[str] = None
    category: str
    frequency: str  # daily, weekly, monthly
    target_count: int = 1
    reminder_time: Optional[str] = None
    linked_goal_id: Optional[str] = None
    is_active: bool = True
    is_public: bool = False
    current_streak: int = 0
    longest_streak: int = 0
    total_completions: int = 0
    completion_rate: float = 0
    this_week_completions: int = 0
    this_month_completions: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class HabitCompletionDB(BaseModel):
    """Habit completion database model."""
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    habit_id: str
    user_id: str
    note: Optional[str] = None
    completed_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# ============== Check-in Models ==============

class CheckInDB(BaseModel):
    """Check-in database model."""
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str
    goal_id: Optional[str] = None
    habit_id: Optional[str] = None
    mood: str  # excellent, good, neutral, struggling, need_help
    progress_note: Optional[str] = None
    challenges: Optional[str] = None
    wins: Optional[str] = None
    progress_value: Optional[float] = None
    is_public: bool = False
    supporters_count: int = 0
    comments_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# ============== Metric Models ==============

class MetricDB(BaseModel):
    """Metric database model."""
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str
    name: str
    description: Optional[str] = None
    unit: str
    target_value: Optional[float] = None
    category: str
    linked_goal_id: Optional[str] = None
    current_value: Optional[float] = None
    entries_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class MetricEntryDB(BaseModel):
    """Metric entry database model."""
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    metric_id: str
    value: float
    note: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# ============== Support Models ==============

class GoalSupportDB(BaseModel):
    """Goal support database model."""
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    goal_id: str
    supporter_id: str
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
