"""Gamification service for XP, levels, badges, and streaks."""

from datetime import datetime, date, timedelta
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class GamificationService:
    """Service for managing gamification features."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.level_thresholds = settings.LEVEL_THRESHOLDS
    
    def calculate_level(self, xp: int) -> int:
        """Calculate user level from XP."""
        level = 1
        for threshold in self.level_thresholds:
            if xp >= threshold:
                level += 1
            else:
                break
        return level
    
    def get_level_progress(self, xp: int, level: int) -> Dict[str, Any]:
        """Get progress towards next level."""
        if level <= len(self.level_thresholds):
            current_threshold = self.level_thresholds[level - 2] if level > 1 else 0
            next_threshold = self.level_thresholds[level - 1]
        else:
            current_threshold = self.level_thresholds[-1]
            next_threshold = current_threshold
        
        xp_in_level = xp - current_threshold
        xp_for_level = next_threshold - current_threshold
        progress = (xp_in_level / xp_for_level) * 100 if xp_for_level > 0 else 100
        
        return {
            "xp_in_level": xp_in_level,
            "xp_for_level": xp_for_level,
            "progress_percentage": min(100, max(0, progress)),
            "xp_to_next": max(0, next_threshold - xp),
        }
    
    async def award_xp(
        self,
        user_id: str,
        amount: int,
        source_type: str,
        source_id: Optional[str] = None,
        description: Optional[str] = None
    ) -> Dict[str, Any]:
        """Award XP to a user."""
        # Get current user data
        result = await self.db.execute(
            "SELECT experience_points, current_level FROM users WHERE id = :user_id",
            {"user_id": user_id}
        )
        user = result.first()
        
        if not user:
            raise ValueError("User not found")
        
        old_xp = user.experience_points
        old_level = user.current_level
        new_xp = old_xp + amount
        new_level = self.calculate_level(new_xp)
        
        # Update user
        await self.db.execute(
            """
            UPDATE users 
            SET experience_points = :new_xp, current_level = :new_level
            WHERE id = :user_id
            """,
            {"new_xp": new_xp, "new_level": new_level, "user_id": user_id}
        )
        
        # Log transaction
        await self.db.execute(
            """
            INSERT INTO xp_transactions (user_id, amount, balance_after, source_type, source_id, description)
            VALUES (:user_id, :amount, :balance, :source_type, :source_id, :description)
            """,
            {
                "user_id": user_id,
                "amount": amount,
                "balance": new_xp,
                "source_type": source_type,
                "source_id": source_id,
                "description": description,
            }
        )
        
        await self.db.commit()
        
        leveled_up = new_level > old_level
        
        if leveled_up:
            logger.info(f"User {user_id} leveled up to {new_level}")
            # Could trigger notification here
        
        return {
            "xp_earned": amount,
            "new_total": new_xp,
            "new_level": new_level,
            "leveled_up": leveled_up,
        }
    
    async def update_streak(self, user_id: str) -> Dict[str, Any]:
        """Update user's daily streak."""
        today = date.today()
        
        # Get current streak data
        result = await self.db.execute(
            "SELECT * FROM user_streaks WHERE user_id = :user_id",
            {"user_id": user_id}
        )
        streak = result.first()
        
        if not streak:
            # Create new streak record
            await self.db.execute(
                """
                INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date)
                VALUES (:user_id, 1, 1, :today)
                """,
                {"user_id": user_id, "today": today}
            )
            await self.db.commit()
            return {"current_streak": 1, "longest_streak": 1, "streak_extended": True}
        
        last_activity = streak.last_activity_date
        current_streak = streak.current_streak
        longest_streak = streak.longest_streak
        
        # Check if streak is frozen
        if streak.streak_frozen_until and streak.streak_frozen_until >= today:
            # Streak is frozen, just update activity date
            await self.db.execute(
                "UPDATE user_streaks SET last_activity_date = :today WHERE user_id = :user_id",
                {"today": today, "user_id": user_id}
            )
            await self.db.commit()
            return {
                "current_streak": current_streak,
                "longest_streak": longest_streak,
                "streak_extended": False,
                "is_frozen": True,
            }
        
        if last_activity == today:
            # Already logged activity today
            return {
                "current_streak": current_streak,
                "longest_streak": longest_streak,
                "streak_extended": False,
            }
        elif last_activity == today - timedelta(days=1):
            # Consecutive day - extend streak
            new_streak = current_streak + 1
            new_longest = max(new_streak, longest_streak)
            
            # Check for milestone
            milestones = [7, 14, 30, 60, 90, 180, 365]
            milestone_reached = new_streak in milestones
            
            await self.db.execute(
                """
                UPDATE user_streaks 
                SET current_streak = :new_streak, 
                    longest_streak = :new_longest,
                    last_activity_date = :today,
                    milestones_reached = milestones_reached || :milestone::jsonb
                WHERE user_id = :user_id
                """,
                {
                    "new_streak": new_streak,
                    "new_longest": new_longest,
                    "today": today,
                    "user_id": user_id,
                    "milestone": f'[{new_streak}]' if milestone_reached else '[]',
                }
            )
            await self.db.commit()
            
            return {
                "current_streak": new_streak,
                "longest_streak": new_longest,
                "streak_extended": True,
                "milestone_reached": new_streak if milestone_reached else None,
            }
        else:
            # Streak broken - reset
            await self.db.execute(
                """
                UPDATE user_streaks 
                SET current_streak = 1, last_activity_date = :today
                WHERE user_id = :user_id
                """,
                {"today": today, "user_id": user_id}
            )
            await self.db.commit()
            
            return {
                "current_streak": 1,
                "longest_streak": longest_streak,
                "streak_extended": True,
                "streak_reset": True,
            }
    
    async def check_badge_progress(self, user_id: str, event_type: str, count: int = 1) -> List[Dict]:
        """Check and update badge progress for an event."""
        unlocked_badges = []
        
        # Get badges matching this event type that user hasn't unlocked
        result = await self.db.execute(
            """
            SELECT b.*, COALESCE(ub.progress, 0) as current_progress, ub.is_unlocked
            FROM badges b
            LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = :user_id
            WHERE b.requirement_type = :event_type 
              AND b.is_active = true
              AND (ub.is_unlocked IS NULL OR ub.is_unlocked = false)
            """,
            {"user_id": user_id, "event_type": event_type}
        )
        badges = result.fetchall()
        
        for badge in badges:
            new_progress = badge.current_progress + count
            is_unlocked = new_progress >= badge.requirement_value
            
            # Upsert progress
            await self.db.execute(
                """
                INSERT INTO user_badges (user_id, badge_id, progress, is_unlocked, unlocked_at)
                VALUES (:user_id, :badge_id, :progress, :is_unlocked, :unlocked_at)
                ON CONFLICT (user_id, badge_id) DO UPDATE SET
                    progress = :progress,
                    is_unlocked = :is_unlocked,
                    unlocked_at = CASE WHEN :is_unlocked THEN :unlocked_at ELSE user_badges.unlocked_at END
                """,
                {
                    "user_id": user_id,
                    "badge_id": str(badge.id),
                    "progress": new_progress,
                    "is_unlocked": is_unlocked,
                    "unlocked_at": datetime.utcnow() if is_unlocked else None,
                }
            )
            
            if is_unlocked:
                # Award XP for badge
                await self.award_xp(
                    user_id=user_id,
                    amount=badge.xp_reward,
                    source_type="badge",
                    source_id=str(badge.id),
                    description=f"Unlocked badge: {badge.name}"
                )
                
                unlocked_badges.append({
                    "id": str(badge.id),
                    "name": badge.name,
                    "tier": badge.tier,
                    "xp_reward": badge.xp_reward,
                })
        
        await self.db.commit()
        return unlocked_badges
