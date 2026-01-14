"""Learning API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from typing import Dict, Any, List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.schemas.learning import (
    LearningPathResponse,
    ModuleResponse,
    EnrollmentResponse,
    ProgressUpdate,
)

router = APIRouter()


# ============== Learning Paths ==============

@router.get("/paths", response_model=List[LearningPathResponse])
async def get_learning_paths(
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    enrolled_only: bool = Query(False),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get available learning paths."""
    user_id = current_user["user_id"]
    
    query = """
        SELECT 
            lp.*,
            e.id as enrollment_id,
            e.progress_percentage,
            e.status as enrollment_status,
            e.enrolled_at
        FROM learning_paths lp
        LEFT JOIN enrollments e ON lp.id = e.path_id AND e.user_id = :user_id
        WHERE lp.is_published = true
    """
    
    params = {"user_id": user_id}
    
    if category:
        query += " AND lp.category = :category"
        params["category"] = category
    
    if difficulty:
        query += " AND lp.difficulty = :difficulty"
        params["difficulty"] = difficulty
    
    if search:
        query += " AND (lp.title ILIKE :search OR lp.description ILIKE :search)"
        params["search"] = f"%{search}%"
    
    if enrolled_only:
        query += " AND e.id IS NOT NULL"
    
    query += " ORDER BY lp.is_featured DESC, lp.created_at DESC"
    
    result = await db.execute(query, params)
    paths = result.fetchall()
    
    return [
        {
            "id": str(p.id),
            "title": p.title,
            "slug": p.slug,
            "description": p.description,
            "short_description": p.short_description,
            "thumbnail_url": p.thumbnail_url,
            "category": p.category,
            "difficulty": p.difficulty,
            "estimated_hours": p.estimated_hours,
            "total_modules": p.total_modules,
            "skills_covered": p.skills_covered or [],
            "is_featured": p.is_featured,
            "is_enrolled": p.enrollment_id is not None,
            "progress_percentage": p.progress_percentage or 0,
            "enrollment_status": p.enrollment_status,
        }
        for p in paths
    ]


@router.get("/paths/{path_id}", response_model=LearningPathResponse)
async def get_learning_path(
    path_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get detailed learning path with modules."""
    user_id = current_user["user_id"]
    
    # Get path
    path_query = """
        SELECT 
            lp.*,
            e.id as enrollment_id,
            e.progress_percentage,
            e.status as enrollment_status,
            e.current_module_id
        FROM learning_paths lp
        LEFT JOIN enrollments e ON lp.id = e.path_id AND e.user_id = :user_id
        WHERE lp.id = :path_id AND lp.is_published = true
    """
    
    result = await db.execute(path_query, {"path_id": path_id, "user_id": user_id})
    path = result.first()
    
    if not path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning path not found"
        )
    
    # Get modules with progress
    modules_query = """
        SELECT 
            m.*,
            mp.status as progress_status,
            mp.progress_percentage as module_progress,
            mp.completed_at
        FROM learning_modules m
        LEFT JOIN module_progress mp ON m.id = mp.module_id AND mp.user_id = :user_id
        WHERE m.path_id = :path_id AND m.is_published = true
        ORDER BY m.order_index
    """
    
    modules_result = await db.execute(modules_query, {"path_id": path_id, "user_id": user_id})
    modules = modules_result.fetchall()
    
    return {
        "id": str(path.id),
        "title": path.title,
        "slug": path.slug,
        "description": path.description,
        "short_description": path.short_description,
        "thumbnail_url": path.thumbnail_url,
        "cover_image_url": path.cover_image_url,
        "category": path.category,
        "difficulty": path.difficulty,
        "estimated_hours": path.estimated_hours,
        "total_modules": path.total_modules,
        "skills_covered": path.skills_covered or [],
        "is_featured": path.is_featured,
        "is_enrolled": path.enrollment_id is not None,
        "progress_percentage": path.progress_percentage or 0,
        "enrollment_status": path.enrollment_status,
        "current_module_id": str(path.current_module_id) if path.current_module_id else None,
        "modules": [
            {
                "id": str(m.id),
                "title": m.title,
                "description": m.description,
                "order_index": m.order_index,
                "content_type": m.content_type,
                "duration_minutes": m.duration_minutes,
                "xp_reward": m.xp_reward,
                "status": m.progress_status or "not_started",
                "progress_percentage": m.module_progress or 0,
                "completed_at": m.completed_at,
            }
            for m in modules
        ]
    }


@router.post("/paths/{path_id}/enroll", response_model=EnrollmentResponse)
async def enroll_in_path(
    path_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Enroll in a learning path."""
    user_id = current_user["user_id"]
    
    # Check if path exists
    path_result = await db.execute(
        "SELECT id, total_modules FROM learning_paths WHERE id = :path_id AND is_published = true",
        {"path_id": path_id}
    )
    path = path_result.first()
    
    if not path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning path not found"
        )
    
    # Check if already enrolled
    enrollment_result = await db.execute(
        "SELECT id FROM enrollments WHERE user_id = :user_id AND path_id = :path_id",
        {"user_id": user_id, "path_id": path_id}
    )
    
    if enrollment_result.first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already enrolled in this path"
        )
    
    # Get first module
    first_module = await db.execute(
        "SELECT id FROM learning_modules WHERE path_id = :path_id ORDER BY order_index LIMIT 1",
        {"path_id": path_id}
    )
    first_mod = first_module.first()
    
    # Create enrollment
    await db.execute(
        """
        INSERT INTO enrollments (user_id, path_id, current_module_id, started_at)
        VALUES (:user_id, :path_id, :current_module_id, :now)
        """,
        {
            "user_id": user_id,
            "path_id": path_id,
            "current_module_id": first_mod.id if first_mod else None,
            "now": datetime.utcnow()
        }
    )
    
    # Update enrollment count
    await db.execute(
        "UPDATE learning_paths SET total_enrollments = total_enrollments + 1 WHERE id = :path_id",
        {"path_id": path_id}
    )
    
    await db.commit()
    
    return {
        "user_id": user_id,
        "path_id": path_id,
        "status": "active",
        "progress_percentage": 0,
        "enrolled_at": datetime.utcnow(),
    }


@router.get("/paths/{path_id}/progress")
async def get_path_progress(
    path_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get detailed progress for a learning path."""
    user_id = current_user["user_id"]
    
    # Get enrollment
    enrollment_result = await db.execute(
        """
        SELECT e.*, lp.total_modules
        FROM enrollments e
        JOIN learning_paths lp ON e.path_id = lp.id
        WHERE e.user_id = :user_id AND e.path_id = :path_id
        """,
        {"user_id": user_id, "path_id": path_id}
    )
    enrollment = enrollment_result.first()
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not enrolled in this path"
        )
    
    # Get module progress
    progress_result = await db.execute(
        """
        SELECT 
            m.id,
            m.title,
            m.order_index,
            mp.status,
            mp.progress_percentage,
            mp.completed_at
        FROM learning_modules m
        LEFT JOIN module_progress mp ON m.id = mp.module_id AND mp.user_id = :user_id
        WHERE m.path_id = :path_id
        ORDER BY m.order_index
        """,
        {"path_id": path_id, "user_id": user_id}
    )
    modules = progress_result.fetchall()
    
    completed = sum(1 for m in modules if m.status == "completed")
    
    return {
        "path_id": path_id,
        "total_modules": enrollment.total_modules,
        "completed_modules": completed,
        "progress_percentage": enrollment.progress_percentage or 0,
        "status": enrollment.status,
        "enrolled_at": enrollment.enrolled_at,
        "last_activity_at": enrollment.last_activity_at,
        "modules": [
            {
                "id": str(m.id),
                "title": m.title,
                "order_index": m.order_index,
                "status": m.status or "not_started",
                "progress_percentage": m.progress_percentage or 0,
                "completed_at": m.completed_at,
            }
            for m in modules
        ]
    }


@router.post("/paths/{path_id}/modules/{module_id}/complete")
async def complete_module(
    path_id: str,
    module_id: str,
    progress_data: Optional[ProgressUpdate] = None,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark a module as completed."""
    user_id = current_user["user_id"]
    now = datetime.utcnow()
    
    # Verify enrollment
    enrollment_result = await db.execute(
        "SELECT id FROM enrollments WHERE user_id = :user_id AND path_id = :path_id",
        {"user_id": user_id, "path_id": path_id}
    )
    enrollment = enrollment_result.first()
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not enrolled in this path"
        )
    
    # Get module
    module_result = await db.execute(
        "SELECT id, xp_reward FROM learning_modules WHERE id = :module_id AND path_id = :path_id",
        {"module_id": module_id, "path_id": path_id}
    )
    module = module_result.first()
    
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )
    
    # Update or create module progress
    await db.execute(
        """
        INSERT INTO module_progress (user_id, module_id, enrollment_id, status, progress_percentage, completed_at)
        VALUES (:user_id, :module_id, :enrollment_id, 'completed', 100, :now)
        ON CONFLICT (user_id, module_id) DO UPDATE SET
            status = 'completed',
            progress_percentage = 100,
            completed_at = :now
        """,
        {
            "user_id": user_id,
            "module_id": module_id,
            "enrollment_id": enrollment.id,
            "now": now
        }
    )
    
    # Recalculate path progress
    await db.execute(
        """
        UPDATE enrollments SET
            progress_percentage = (
                SELECT (COUNT(*) FILTER (WHERE mp.status = 'completed')::float / COUNT(*)::float) * 100
                FROM learning_modules m
                LEFT JOIN module_progress mp ON m.id = mp.module_id AND mp.user_id = :user_id
                WHERE m.path_id = :path_id
            ),
            last_activity_at = :now
        WHERE id = :enrollment_id
        """,
        {"user_id": user_id, "path_id": path_id, "enrollment_id": enrollment.id, "now": now}
    )
    
    # Award XP
    xp_reward = module.xp_reward or settings.XP_PER_MODULE
    await db.execute(
        "UPDATE users SET experience_points = experience_points + :xp WHERE id = :user_id",
        {"xp": xp_reward, "user_id": user_id}
    )
    
    # Log XP transaction
    await db.execute(
        """
        INSERT INTO xp_transactions (user_id, amount, balance_after, source_type, source_id, description)
        SELECT :user_id, :amount, u.experience_points, 'module', :module_id, 'Module completed'
        FROM users u WHERE u.id = :user_id
        """,
        {"user_id": user_id, "amount": xp_reward, "module_id": module_id}
    )
    
    await db.commit()
    
    return {
        "message": "Module completed",
        "xp_earned": xp_reward,
        "module_id": module_id,
    }
