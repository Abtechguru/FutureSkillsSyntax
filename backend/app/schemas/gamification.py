"""Gamification schemas."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class BadgeTier(str, Enum):
    BRONZE = "bronze"
    SILVER = "silver"
    GOLD = "gold"
    PLATINUM = "platinum"


class BadgeRarity(str, Enum):
    COMMON = "common"
    UNCOMMON = "uncommon"
    RARE = "rare"
    EPIC = "epic"
    LEGENDARY = "legendary"


class QuestType(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    SPECIAL = "special"
    ACHIEVEMENT = "achievement"


# ============== Profile ==============

class GamificationProfile(BaseModel):
    user_id: str
    experience_points: int
    current_level: int
    xp_to_next_level: int
    level_progress_percentage: float
    current_streak: int
    longest_streak: int
    badges_count: int
    rank: Optional[int] = None


# ============== Badges ==============

class BadgeResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    icon: str
    color: Optional[str] = None
    tier: BadgeTier
    rarity: BadgeRarity
    category: str
    requirement_type: str
    requirement_value: int
    xp_reward: int
    progress: int = 0
    is_unlocked: bool = False
    unlocked_at: Optional[datetime] = None


# ============== Quests ==============

class QuestResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    quest_type: QuestType
    category: Optional[str] = None
    requirement_type: str
    requirement_value: int
    xp_reward: int
    progress: int = 0
    is_completed: bool = False
    is_claimed: bool = False
    completed_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None


# ============== Streak ==============

class StreakResponse(BaseModel):
    current_streak: int
    longest_streak: int
    last_activity_date: Optional[str] = None
    streak_frozen_until: Optional[str] = None
    milestones_reached: List[int] = []


# ============== Leaderboard ==============

class LeaderboardEntry(BaseModel):
    rank: int
    user_id: str
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    experience_points: int
    current_level: int
    current_streak: int = 0
    is_current_user: bool = False


# ============== Rewards ==============

class RewardResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    reward_type: str
    xp_cost: Optional[int] = None
    is_claimed: bool = False


class RewardClaim(BaseModel):
    reward_id: str
