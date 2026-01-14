"""Gamification API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func, and_
from typing import Dict, Any, List, Optional
from datetime import datetime, date

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.schemas.gamification import (
    GamificationProfile,
    BadgeResponse,
    QuestResponse,
    LeaderboardEntry,
    StreakResponse,
)

router = APIRouter()


# ============== Profile ==============

@router.get("/profile", response_model=GamificationProfile)
async def get_gamification_profile(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's gamification profile with XP, level, and streak."""
    user_id = current_user["user_id"]
    
    # Get user
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get streak info
    streak_result = await db.execute(
        select("*").select_from(
            func.table("user_streaks")
        ).where(
            func.column("user_id") == user_id
        )
    )
    streak = streak_result.first()
    
    # Get badge count
    badge_result = await db.execute(
        select(func.count()).select_from(
            func.table("user_badges")
        ).where(
            and_(
                func.column("user_id") == user_id,
                func.column("is_unlocked") == True
            )
        )
    )
    badges_count = badge_result.scalar() or 0
    
    # Calculate level progress
    current_level = user.current_level
    xp = user.experience_points
    
    # Get XP thresholds for current and next level
    thresholds = settings.LEVEL_THRESHOLDS
    current_threshold = thresholds[min(current_level - 1, len(thresholds) - 1)] if current_level > 0 else 0
    next_threshold = thresholds[min(current_level, len(thresholds) - 1)] if current_level < len(thresholds) else thresholds[-1]
    
    xp_to_next = next_threshold - xp
    progress_percentage = ((xp - current_threshold) / (next_threshold - current_threshold)) * 100 if next_threshold > current_threshold else 100
    
    return {
        "user_id": str(user.id),
        "experience_points": xp,
        "current_level": current_level,
        "xp_to_next_level": max(0, xp_to_next),
        "level_progress_percentage": min(100, max(0, progress_percentage)),
        "current_streak": streak.current_streak if streak else 0,
        "longest_streak": streak.longest_streak if streak else 0,
        "badges_count": badges_count,
        "rank": None,  # Would be calculated from leaderboard
    }


# ============== Badges ==============

@router.get("/badges", response_model=List[BadgeResponse])
async def get_badges(
    unlocked_only: bool = Query(False),
    category: Optional[str] = Query(None),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all badges with user's progress."""
    user_id = current_user["user_id"]
    
    # Raw SQL for complex join with user_badges
    query = """
        SELECT 
            b.*,
            COALESCE(ub.progress, 0) as user_progress,
            COALESCE(ub.is_unlocked, false) as is_unlocked,
            ub.unlocked_at
        FROM badges b
        LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = :user_id
        WHERE b.is_active = true
    """
    
    params = {"user_id": user_id}
    
    if unlocked_only:
        query += " AND ub.is_unlocked = true"
    
    if category:
        query += " AND b.category = :category"
        params["category"] = category
    
    query += " ORDER BY b.tier, b.name"
    
    result = await db.execute(query, params)
    badges = result.fetchall()
    
    return [
        {
            "id": str(b.id),
            "name": b.name,
            "slug": b.slug,
            "description": b.description,
            "icon": b.icon,
            "color": b.color,
            "tier": b.tier,
            "rarity": b.rarity,
            "category": b.category,
            "requirement_type": b.requirement_type,
            "requirement_value": b.requirement_value,
            "xp_reward": b.xp_reward,
            "progress": b.user_progress,
            "is_unlocked": b.is_unlocked,
            "unlocked_at": b.unlocked_at,
        }
        for b in badges
    ]


# ============== Quests ==============

@router.get("/quests", response_model=List[QuestResponse])
async def get_quests(
    quest_type: Optional[str] = Query(None),
    active_only: bool = Query(True),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get available quests with user's progress."""
    user_id = current_user["user_id"]
    now = datetime.utcnow()
    
    query = """
        SELECT 
            q.*,
            COALESCE(uq.progress, 0) as user_progress,
            COALESCE(uq.is_completed, false) as is_completed,
            COALESCE(uq.is_claimed, false) as is_claimed,
            uq.completed_at
        FROM quests q
        LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = :user_id
        WHERE q.is_active = true
    """
    
    params = {"user_id": user_id}
    
    if quest_type:
        query += " AND q.quest_type = :quest_type"
        params["quest_type"] = quest_type
    
    if active_only:
        query += " AND (q.expires_at IS NULL OR q.expires_at > :now)"
        params["now"] = now
    
    query += " ORDER BY q.quest_type, q.xp_reward DESC"
    
    result = await db.execute(query, params)
    quests = result.fetchall()
    
    return [
        {
            "id": str(q.id),
            "title": q.title,
            "description": q.description,
            "quest_type": q.quest_type,
            "category": q.category,
            "requirement_type": q.requirement_type,
            "requirement_value": q.requirement_value,
            "xp_reward": q.xp_reward,
            "progress": q.user_progress,
            "is_completed": q.is_completed,
            "is_claimed": q.is_claimed,
            "completed_at": q.completed_at,
            "expires_at": q.expires_at,
        }
        for q in quests
    ]


@router.post("/quests/{quest_id}/complete")
async def complete_quest(
    quest_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Claim rewards for a completed quest."""
    user_id = current_user["user_id"]
    
    # Check if quest exists and is completed but not claimed
    query = """
        SELECT q.*, uq.is_completed, uq.is_claimed
        FROM quests q
        JOIN user_quests uq ON q.id = uq.quest_id
        WHERE q.id = :quest_id AND uq.user_id = :user_id
    """
    
    result = await db.execute(query, {"quest_id": quest_id, "user_id": user_id})
    quest = result.first()
    
    if not quest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quest not found or not started"
        )
    
    if not quest.is_completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quest not yet completed"
        )
    
    if quest.is_claimed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quest rewards already claimed"
        )
    
    # Claim rewards
    await db.execute(
        """
        UPDATE user_quests 
        SET is_claimed = true, claimed_at = :now 
        WHERE quest_id = :quest_id AND user_id = :user_id
        """,
        {"quest_id": quest_id, "user_id": user_id, "now": datetime.utcnow()}
    )
    
    # Award XP
    await db.execute(
        """
        UPDATE users 
        SET experience_points = experience_points + :xp 
        WHERE id = :user_id
        """,
        {"xp": quest.xp_reward, "user_id": user_id}
    )
    
    # Log XP transaction
    await db.execute(
        """
        INSERT INTO xp_transactions (user_id, amount, balance_after, source_type, source_id, description)
        SELECT :user_id, :amount, u.experience_points, 'quest', :quest_id, :description
        FROM users u WHERE u.id = :user_id
        """,
        {
            "user_id": user_id,
            "amount": quest.xp_reward,
            "quest_id": quest_id,
            "description": f"Completed quest: {quest.title}"
        }
    )
    
    await db.commit()
    
    return {
        "message": "Quest rewards claimed",
        "xp_earned": quest.xp_reward
    }


# ============== Leaderboard ==============

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    scope: str = Query("global", regex="^(global|friends)$"),
    period: str = Query("all_time", regex="^(daily|weekly|monthly|all_time)$"),
    limit: int = Query(50, ge=1, le=100),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get leaderboard rankings."""
    user_id = current_user["user_id"]
    
    if scope == "global":
        # Get from cache or calculate
        query = """
            SELECT 
                u.id as user_id,
                u.username,
                u.full_name,
                u.profile_picture_url as avatar_url,
                u.experience_points,
                u.current_level,
                COALESCE(s.current_streak, 0) as current_streak,
                ROW_NUMBER() OVER (ORDER BY u.experience_points DESC) as rank
            FROM users u
            LEFT JOIN user_streaks s ON u.id = s.user_id
            WHERE u.is_active = true
            ORDER BY u.experience_points DESC
            LIMIT :limit
        """
        result = await db.execute(query, {"limit": limit})
    else:
        # Friends leaderboard - users you follow
        query = """
            SELECT 
                u.id as user_id,
                u.username,
                u.full_name,
                u.profile_picture_url as avatar_url,
                u.experience_points,
                u.current_level,
                COALESCE(s.current_streak, 0) as current_streak,
                ROW_NUMBER() OVER (ORDER BY u.experience_points DESC) as rank
            FROM users u
            LEFT JOIN user_streaks s ON u.id = s.user_id
            WHERE u.id IN (
                SELECT following_id FROM follows WHERE follower_id = :user_id
            ) OR u.id = :user_id
            ORDER BY u.experience_points DESC
            LIMIT :limit
        """
        result = await db.execute(query, {"user_id": user_id, "limit": limit})
    
    entries = result.fetchall()
    
    return [
        {
            "rank": e.rank,
            "user_id": str(e.user_id),
            "username": e.username,
            "full_name": e.full_name,
            "avatar_url": e.avatar_url,
            "experience_points": e.experience_points,
            "current_level": e.current_level,
            "current_streak": e.current_streak,
            "is_current_user": str(e.user_id) == user_id,
        }
        for e in entries
    ]


# ============== Rewards ==============

@router.post("/rewards/{reward_id}/claim")
async def claim_reward(
    reward_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Claim a reward from the shop."""
    user_id = current_user["user_id"]
    
    # Get reward
    result = await db.execute(
        "SELECT * FROM rewards WHERE id = :reward_id AND is_active = true",
        {"reward_id": reward_id}
    )
    reward = result.first()
    
    if not reward:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reward not found"
        )
    
    # Check if already claimed
    claimed = await db.execute(
        "SELECT id FROM user_rewards WHERE user_id = :user_id AND reward_id = :reward_id",
        {"user_id": user_id, "reward_id": reward_id}
    )
    if claimed.first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reward already claimed"
        )
    
    # Check XP cost if applicable
    if reward.xp_cost:
        user_result = await db.execute(
            "SELECT experience_points FROM users WHERE id = :user_id",
            {"user_id": user_id}
        )
        user = user_result.first()
        
        if user.experience_points < reward.xp_cost:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient XP"
            )
        
        # Deduct XP
        await db.execute(
            "UPDATE users SET experience_points = experience_points - :cost WHERE id = :user_id",
            {"cost": reward.xp_cost, "user_id": user_id}
        )
    
    # Claim reward
    await db.execute(
        "INSERT INTO user_rewards (user_id, reward_id) VALUES (:user_id, :reward_id)",
        {"user_id": user_id, "reward_id": reward_id}
    )
    
    await db.commit()
    
    return {
        "message": "Reward claimed successfully",
        "reward": {
            "id": str(reward.id),
            "name": reward.name,
            "type": reward.reward_type,
        }
    }
