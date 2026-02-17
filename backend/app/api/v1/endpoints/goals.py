"""Goal tracking and accountability API endpoints - MongoDB Implementation."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime, date

from app.schemas.goals import (
    GoalCreate, GoalUpdate, GoalResponse,
    HabitCreate, HabitUpdate, HabitResponse,
    CheckInCreate, CheckInResponse,
    GoalStatus, GoalCategory, GoalPriority
)
from app.core.mongodb import get_mongodb
from app.core.security import get_current_user
from app.models.user import User
from app.services.goals_service import GoalsService, HabitsService, CheckInsService

router = APIRouter()


# ============== Goals ==============

@router.post("/", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
async def create_goal(
    goal: GoalCreate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    """Create a new goal with optional milestones."""
    try:
        service = GoalsService(db)
        goal_db = await service.create_goal(current_user.id, goal)
        
        # Convert to response model
        return GoalResponse(
            id=goal_db.id,
            user_id=goal_db.user_id,
            title=goal_db.title,
            description=goal_db.description,
            category=goal_db.category,
            priority=goal_db.priority,
            status=goal_db.status,
            target_date=goal_db.target_date,
            target_value=goal_db.target_value,
            current_value=goal_db.current_value,
            unit=goal_db.unit,
            progress_percentage=goal_db.progress_percentage,
            is_public=goal_db.is_public,
            milestones=[],  # TODO: Fetch milestones
            tags=goal_db.tags,
            streak_days=goal_db.streak_days,
            total_check_ins=goal_db.total_check_ins,
            supporters_count=goal_db.supporters_count,
            created_at=goal_db.created_at,
            updated_at=goal_db.updated_at,
            completed_at=goal_db.completed_at
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create goal: {str(e)}"
        )


@router.get("/", response_model=List[GoalResponse])
async def get_goals(
    status_filter: Optional[GoalStatus] = None,
    category: Optional[GoalCategory] = None,
    priority: Optional[GoalPriority] = None,
    is_public: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    """Get all goals for the current user with optional filters."""
    try:
        service = GoalsService(db)
        goals = await service.get_goals(
            user_id=current_user.id,
            status=status_filter.value if status_filter else None,
            category=category.value if category else None,
            priority=priority.value if priority else None,
            is_public=is_public,
            skip=skip,
            limit=limit
        )
        
        return [
            GoalResponse(
                id=g.id,
                user_id=g.user_id,
                title=g.title,
                description=g.description,
                category=g.category,
                priority=g.priority,
                status=g.status,
                target_date=g.target_date,
                target_value=g.target_value,
                current_value=g.current_value,
                unit=g.unit,
                progress_percentage=g.progress_percentage,
                is_public=g.is_public,
                milestones=[],
                tags=g.tags,
                streak_days=g.streak_days,
                total_check_ins=g.total_check_ins,
                supporters_count=g.supporters_count,
                created_at=g.created_at,
                updated_at=g.updated_at,
                completed_at=g.completed_at
            )
            for g in goals
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch goals: {str(e)}"
        )


@router.get("/{goal_id}", response_model=GoalResponse)
async def get_goal(
    goal_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    """Get a specific goal by ID."""
    try:
        service = GoalsService(db)
        goal = await service.get_goal_by_id(goal_id, current_user.id)
        
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return GoalResponse(
            id=goal.id,
            user_id=goal.user_id,
            title=goal.title,
            description=goal.description,
            category=goal.category,
            priority=goal.priority,
            status=goal.status,
            target_date=goal.target_date,
            target_value=goal.target_value,
            current_value=goal.current_value,
            unit=goal.unit,
            progress_percentage=goal.progress_percentage,
            is_public=goal.is_public,
            milestones=[],
            tags=goal.tags,
            streak_days=goal.streak_days,
            total_check_ins=goal.total_check_ins,
            supporters_count=goal.supporters_count,
            created_at=goal.created_at,
            updated_at=goal.updated_at,
            completed_at=goal.completed_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch goal: {str(e)}"
        )


@router.put("/{goal_id}", response_model=GoalResponse)
async def update_goal(
    goal_id: str,
    goal_update: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    """Update a goal."""
    try:
        service = GoalsService(db)
        goal = await service.update_goal(goal_id, current_user.id, goal_update)
        
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return GoalResponse(
            id=goal.id,
            user_id=goal.user_id,
            title=goal.title,
            description=goal.description,
            category=goal.category,
            priority=goal.priority,
            status=goal.status,
            target_date=goal.target_date,
            target_value=goal.target_value,
            current_value=goal.current_value,
            unit=goal.unit,
            progress_percentage=goal.progress_percentage,
            is_public=goal.is_public,
            milestones=[],
            tags=goal.tags,
            streak_days=goal.streak_days,
            total_check_ins=goal.total_check_ins,
            supporters_count=goal.supporters_count,
            created_at=goal.created_at,
            updated_at=goal.updated_at,
            completed_at=goal.completed_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update goal: {str(e)}"
        )


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(
    goal_id: str,
    current_user: User = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    """Delete a goal."""
    try:
        service = GoalsService(db)
        deleted = await service.delete_goal(goal_id, current_user.id)
        
        if not deleted:
            raise HTTPException(status_code=404, detail="Goal not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete goal: {str(e)}"
        )


@router.post("/{goal_id}/progress")
async def update_goal_progress(
    goal_id: str,
    progress_value: float,
    note: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    """Update goal progress."""
    try:
        service = GoalsService(db)
        goal = await service.update_progress(goal_id, current_user.id, progress_value)
        
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return {
            "message": "Progress updated successfully",
            "progress": goal.progress_percentage,
            "status": goal.status
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update progress: {str(e)}"
        )


# ============== Habits ==============

@router.post("/habits", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
async def create_habit(
    habit: HabitCreate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    """Create a new habit to build consistency."""
    try:
        service = HabitsService(db)
        habit_db = await service.create_habit(current_user.id, habit)
        
        return HabitResponse(
            id=habit_db.id,
            user_id=habit_db.user_id,
            title=habit_db.title,
            description=habit_db.description,
            category=habit_db.category,
            frequency=habit_db.frequency,
            target_count=habit_db.target_count,
            reminder_time=habit_db.reminder_time,
            linked_goal_id=habit_db.linked_goal_id,
            is_active=habit_db.is_active,
            is_public=habit_db.is_public,
            current_streak=habit_db.current_streak,
            longest_streak=habit_db.longest_streak,
            total_completions=habit_db.total_completions,
            completion_rate=habit_db.completion_rate,
            this_week_completions=habit_db.this_week_completions,
            this_month_completions=habit_db.this_month_completions,
            created_at=habit_db.created_at,
            updated_at=habit_db.updated_at
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create habit: {str(e)}"
        )


@router.get("/habits", response_model=List[HabitResponse])
async def get_habits(
    category: Optional[GoalCategory] = None,
    is_active: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    """Get all habits for the current user."""
    try:
        service = HabitsService(db)
        habits = await service.get_habits(
            user_id=current_user.id,
            category=category.value if category else None,
            is_active=is_active
        )
        
        return [
            HabitResponse(
                id=h.id,
                user_id=h.user_id,
                title=h.title,
                description=h.description,
                category=h.category,
                frequency=h.frequency,
                target_count=h.target_count,
                reminder_time=h.reminder_time,
                linked_goal_id=h.linked_goal_id,
                is_active=h.is_active,
                is_public=h.is_public,
                current_streak=h.current_streak,
                longest_streak=h.longest_streak,
                total_completions=h.total_completions,
                completion_rate=h.completion_rate,
                this_week_completions=h.this_week_completions,
                this_month_completions=h.this_month_completions,
                created_at=h.created_at,
                updated_at=h.updated_at
            )
            for h in habits
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch habits: {str(e)}"
        )


@router.post("/habits/{habit_id}/complete")
async def complete_habit(
    habit_id: str,
    note: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    """Mark a habit as completed for today."""
    try:
        service = HabitsService(db)
        result = await service.complete_habit(habit_id, current_user.id, note)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to complete habit: {str(e)}"
        )


# ============== Check-ins ==============

@router.post("/check-ins", response_model=CheckInResponse, status_code=status.HTTP_201_CREATED)
async def create_check_in(
    check_in: CheckInCreate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    """Create a daily check-in for accountability."""
    try:
        service = CheckInsService(db)
        check_in_db = await service.create_check_in(current_user.id, check_in)
        
        return CheckInResponse(
            id=check_in_db.id,
            user_id=check_in_db.user_id,
            goal_id=check_in_db.goal_id,
            habit_id=check_in_db.habit_id,
            mood=check_in_db.mood,
            progress_note=check_in_db.progress_note,
            challenges=check_in_db.challenges,
            wins=check_in_db.wins,
            progress_value=check_in_db.progress_value,
            is_public=check_in_db.is_public,
            supporters_count=check_in_db.supporters_count,
            comments_count=check_in_db.comments_count,
            created_at=check_in_db.created_at
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create check-in: {str(e)}"
        )


@router.get("/check-ins", response_model=List[CheckInResponse])
async def get_check_ins(
    goal_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(30, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    """Get check-ins with optional filters."""
    try:
        service = CheckInsService(db)
        check_ins = await service.get_check_ins(
            user_id=current_user.id,
            goal_id=goal_id,
            skip=skip,
            limit=limit
        )
        
        return [
            CheckInResponse(
                id=ci.id,
                user_id=ci.user_id,
                goal_id=ci.goal_id,
                habit_id=ci.habit_id,
                mood=ci.mood,
                progress_note=ci.progress_note,
                challenges=ci.challenges,
                wins=ci.wins,
                progress_value=ci.progress_value,
                is_public=ci.is_public,
                supporters_count=ci.supporters_count,
                comments_count=ci.comments_count,
                created_at=ci.created_at
            )
            for ci in check_ins
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch check-ins: {str(e)}"
        )


@router.get("/check-ins/community", response_model=List[CheckInResponse])
async def get_community_check_ins(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db = Depends(get_mongodb)
):
    """Get public check-ins from the community."""
    try:
        service = CheckInsService(db)
        check_ins = await service.get_community_check_ins(skip=skip, limit=limit)
        
        return [
            CheckInResponse(
                id=ci.id,
                user_id=ci.user_id,
                goal_id=ci.goal_id,
                habit_id=ci.habit_id,
                mood=ci.mood,
                progress_note=ci.progress_note,
                challenges=ci.challenges,
                wins=ci.wins,
                progress_value=ci.progress_value,
                is_public=ci.is_public,
                supporters_count=ci.supporters_count,
                comments_count=ci.comments_count,
                created_at=ci.created_at
            )
            for ci in check_ins
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch community check-ins: {str(e)}"
        )
