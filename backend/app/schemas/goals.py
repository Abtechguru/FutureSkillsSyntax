"""Goal tracking and accountability schemas."""

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from enum import Enum


class GoalStatus(str, Enum):
    """Goal status enumeration."""
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    ABANDONED = "abandoned"


class GoalPriority(str, Enum):
    """Goal priority enumeration."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class GoalCategory(str, Enum):
    """Goal category enumeration."""
    CAREER = "career"
    LEARNING = "learning"
    HEALTH = "health"
    FINANCE = "finance"
    PERSONAL = "personal"
    RELATIONSHIPS = "relationships"
    CREATIVITY = "creativity"
    OTHER = "other"


class HabitFrequency(str, Enum):
    """Habit frequency enumeration."""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    CUSTOM = "custom"


class CheckInMood(str, Enum):
    """Check-in mood enumeration."""
    EXCELLENT = "excellent"
    GOOD = "good"
    NEUTRAL = "neutral"
    STRUGGLING = "struggling"
    NEED_HELP = "need_help"


# ============== Goals ==============

class MilestoneCreate(BaseModel):
    """Milestone creation schema."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    target_date: Optional[date] = None
    target_value: Optional[float] = None


class MilestoneResponse(BaseModel):
    """Milestone response schema."""
    id: str
    title: str
    description: Optional[str] = None
    target_date: Optional[date] = None
    target_value: Optional[float] = None
    current_value: float = 0
    is_completed: bool = False
    completed_at: Optional[datetime] = None
    created_at: datetime


class GoalCreate(BaseModel):
    """Goal creation schema."""
    title: str = Field(..., min_length=1, max_length=300)
    description: Optional[str] = Field(None, max_length=2000)
    category: GoalCategory
    priority: GoalPriority = GoalPriority.MEDIUM
    target_date: Optional[date] = None
    target_value: Optional[float] = None
    current_value: float = 0
    unit: Optional[str] = None  # e.g., "hours", "pages", "kg"
    is_public: bool = False
    milestones: Optional[List[MilestoneCreate]] = []
    tags: Optional[List[str]] = []
    
    @validator('target_date')
    def validate_target_date(cls, v):
        if v and v < date.today():
            raise ValueError('Target date must be in the future')
        return v


class GoalUpdate(BaseModel):
    """Goal update schema."""
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    description: Optional[str] = Field(None, max_length=2000)
    category: Optional[GoalCategory] = None
    priority: Optional[GoalPriority] = None
    target_date: Optional[date] = None
    target_value: Optional[float] = None
    current_value: Optional[float] = None
    unit: Optional[str] = None
    status: Optional[GoalStatus] = None
    is_public: Optional[bool] = None
    tags: Optional[List[str]] = None


class GoalResponse(BaseModel):
    """Goal response schema."""
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    category: GoalCategory
    priority: GoalPriority
    status: GoalStatus
    target_date: Optional[date] = None
    target_value: Optional[float] = None
    current_value: float = 0
    unit: Optional[str] = None
    progress_percentage: float = 0
    is_public: bool = False
    milestones: List[MilestoneResponse] = []
    tags: List[str] = []
    streak_days: int = 0
    total_check_ins: int = 0
    supporters_count: int = 0
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None


# ============== Habits ==============

class HabitCreate(BaseModel):
    """Habit creation schema."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    category: GoalCategory
    frequency: HabitFrequency
    target_count: int = Field(1, ge=1)  # How many times per frequency period
    reminder_time: Optional[str] = None  # e.g., "09:00"
    linked_goal_id: Optional[str] = None
    is_public: bool = False


class HabitUpdate(BaseModel):
    """Habit update schema."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    category: Optional[GoalCategory] = None
    frequency: Optional[HabitFrequency] = None
    target_count: Optional[int] = Field(None, ge=1)
    reminder_time: Optional[str] = None
    is_active: Optional[bool] = None
    is_public: Optional[bool] = None


class HabitResponse(BaseModel):
    """Habit response schema."""
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    category: GoalCategory
    frequency: HabitFrequency
    target_count: int
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
    created_at: datetime
    updated_at: datetime


# ============== Check-ins ==============

class CheckInCreate(BaseModel):
    """Daily check-in creation schema."""
    goal_id: Optional[str] = None
    habit_id: Optional[str] = None
    mood: CheckInMood
    progress_note: Optional[str] = Field(None, max_length=1000)
    challenges: Optional[str] = Field(None, max_length=1000)
    wins: Optional[str] = Field(None, max_length=1000)
    progress_value: Optional[float] = None
    is_public: bool = False


class CheckInResponse(BaseModel):
    """Check-in response schema."""
    id: str
    user_id: str
    goal_id: Optional[str] = None
    habit_id: Optional[str] = None
    mood: CheckInMood
    progress_note: Optional[str] = None
    challenges: Optional[str] = None
    wins: Optional[str] = None
    progress_value: Optional[float] = None
    is_public: bool = False
    supporters_count: int = 0
    comments_count: int = 0
    created_at: datetime


# ============== Metrics ==============

class MetricCreate(BaseModel):
    """Custom metric creation schema."""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    unit: str = Field(..., min_length=1, max_length=20)
    target_value: Optional[float] = None
    category: GoalCategory
    linked_goal_id: Optional[str] = None


class MetricEntryCreate(BaseModel):
    """Metric entry creation schema."""
    value: float
    note: Optional[str] = Field(None, max_length=500)


class MetricEntryResponse(BaseModel):
    """Metric entry response schema."""
    id: str
    metric_id: str
    value: float
    note: Optional[str] = None
    created_at: datetime


class MetricResponse(BaseModel):
    """Metric response schema."""
    id: str
    user_id: str
    name: str
    description: Optional[str] = None
    unit: str
    target_value: Optional[float] = None
    category: GoalCategory
    linked_goal_id: Optional[str] = None
    current_value: Optional[float] = None
    entries_count: int = 0
    recent_entries: List[MetricEntryResponse] = []
    created_at: datetime
    updated_at: datetime


# ============== AI Suggestions ==============

class AIGoalSuggestion(BaseModel):
    """AI-generated goal suggestion."""
    title: str
    description: str
    category: GoalCategory
    priority: GoalPriority
    suggested_milestones: List[str]
    estimated_duration_days: int
    difficulty_level: str  # "beginner", "intermediate", "advanced"
    reasoning: str


class AIHabitSuggestion(BaseModel):
    """AI-generated habit suggestion."""
    title: str
    description: str
    category: GoalCategory
    frequency: HabitFrequency
    target_count: int
    reasoning: str
    tips: List[str]


# ============== Analytics ==============

class GoalAnalytics(BaseModel):
    """Goal analytics response."""
    total_goals: int
    active_goals: int
    completed_goals: int
    completion_rate: float
    average_completion_time_days: Optional[float] = None
    goals_by_category: Dict[str, int]
    goals_by_priority: Dict[str, int]
    current_streak_days: int
    longest_streak_days: int


class HabitAnalytics(BaseModel):
    """Habit analytics response."""
    total_habits: int
    active_habits: int
    average_completion_rate: float
    total_completions: int
    habits_by_category: Dict[str, int]
    best_performing_habit: Optional[str] = None
    needs_attention_habits: List[str] = []


class OverallProgress(BaseModel):
    """Overall progress dashboard."""
    goals_analytics: GoalAnalytics
    habits_analytics: HabitAnalytics
    total_check_ins: int
    check_ins_this_week: int
    total_supporters: int
    total_support_given: int
    xp_earned_from_goals: int
    achievements_unlocked: int


# ============== Community Support ==============

class GoalSupport(BaseModel):
    """Goal support/encouragement."""
    goal_id: str
    message: Optional[str] = Field(None, max_length=500)


class SupportResponse(BaseModel):
    """Support response schema."""
    id: str
    goal_id: str
    supporter_id: str
    supporter_name: str
    supporter_avatar: Optional[str] = None
    message: Optional[str] = None
    created_at: datetime
