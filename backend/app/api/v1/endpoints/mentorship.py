"""Mentorship API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from sqlalchemy.orm import selectinload
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.mentorship import MentorAssignment, MentorshipSession, SessionStatus
from app.models.user import User
from app.schemas.mentorship import (
    AssignmentResponse,
    SessionCreate,
    SessionUpdate,
    SessionResponse,
    SessionComplete,
)

router = APIRouter()


# ============== Assignments ==============

@router.get("/assignments", response_model=List[AssignmentResponse])
async def get_assignments(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's mentorship assignments (as mentor or mentee)."""
    user_id = current_user["user_id"]
    
    result = await db.execute(
        select(MentorAssignment)
        .options(
            selectinload(MentorAssignment.mentor),
            selectinload(MentorAssignment.mentee)
        )
        .where(
            or_(
                MentorAssignment.mentor_id == user_id,
                MentorAssignment.mentee_id == user_id
            )
        )
        .order_by(MentorAssignment.created_at.desc())
    )
    
    return result.scalars().all()


@router.get("/assignments/{assignment_id}", response_model=AssignmentResponse)
async def get_assignment(
    assignment_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific assignment details."""
    user_id = current_user["user_id"]
    
    result = await db.execute(
        select(MentorAssignment)
        .options(
            selectinload(MentorAssignment.mentor),
            selectinload(MentorAssignment.mentee),
            selectinload(MentorAssignment.sessions)
        )
        .where(
            and_(
                MentorAssignment.id == assignment_id,
                or_(
                    MentorAssignment.mentor_id == user_id,
                    MentorAssignment.mentee_id == user_id
                )
            )
        )
    )
    
    assignment = result.scalar_one_or_none()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    return assignment


# ============== Sessions ==============

@router.get("/sessions", response_model=List[SessionResponse])
async def get_sessions(
    assignment_id: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    upcoming_only: bool = Query(False),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get mentorship sessions."""
    user_id = current_user["user_id"]
    
    query = select(MentorshipSession).where(
        or_(
            MentorshipSession.mentor_id == user_id,
            MentorshipSession.mentee_id == user_id
        )
    )
    
    if assignment_id:
        query = query.where(MentorshipSession.assignment_id == assignment_id)
    
    if status_filter:
        query = query.where(MentorshipSession.status == status_filter)
    
    if upcoming_only:
        query = query.where(
            and_(
                MentorshipSession.session_date >= datetime.utcnow(),
                MentorshipSession.status == SessionStatus.SCHEDULED
            )
        )
    
    query = query.order_by(MentorshipSession.session_date.asc())
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/sessions/{session_id}", response_model=SessionResponse)
async def get_session(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific session details."""
    user_id = current_user["user_id"]
    
    result = await db.execute(
        select(MentorshipSession).where(
            and_(
                MentorshipSession.id == session_id,
                or_(
                    MentorshipSession.mentor_id == user_id,
                    MentorshipSession.mentee_id == user_id
                )
            )
        )
    )
    
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    return session


@router.post("/sessions", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_data: SessionCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new mentorship session."""
    user_id = current_user["user_id"]
    
    # Verify assignment exists and user is part of it
    result = await db.execute(
        select(MentorAssignment).where(
            and_(
                MentorAssignment.id == session_data.assignment_id,
                MentorAssignment.is_active == True,
                or_(
                    MentorAssignment.mentor_id == user_id,
                    MentorAssignment.mentee_id == user_id
                )
            )
        )
    )
    
    assignment = result.scalar_one_or_none()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found or inactive"
        )
    
    # Validate session date is in the future
    if session_data.session_date <= datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session date must be in the future"
        )
    
    # Create session
    session = MentorshipSession(
        assignment_id=session_data.assignment_id,
        mentor_id=assignment.mentor_id,
        mentee_id=assignment.mentee_id,
        title=session_data.title,
        description=session_data.description,
        topic=session_data.topic,
        week_focus=session_data.week_focus,
        session_date=session_data.session_date,
        duration_minutes=session_data.duration_minutes or 60,
        learning_objectives=session_data.learning_objectives or [],
    )
    
    db.add(session)
    await db.commit()
    await db.refresh(session)
    
    # TODO: Send notification to mentor/mentee
    
    return session


@router.put("/sessions/{session_id}", response_model=SessionResponse)
async def update_session(
    session_id: str,
    session_data: SessionUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a session."""
    user_id = current_user["user_id"]
    
    result = await db.execute(
        select(MentorshipSession).where(
            and_(
                MentorshipSession.id == session_id,
                or_(
                    MentorshipSession.mentor_id == user_id,
                    MentorshipSession.mentee_id == user_id
                )
            )
        )
    )
    
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    if session.status not in [SessionStatus.SCHEDULED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update session with current status"
        )
    
    # Update fields
    update_data = session_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(session, field, value)
    
    await db.commit()
    await db.refresh(session)
    
    return session


@router.post("/sessions/{session_id}/cancel")
async def cancel_session(
    session_id: str,
    reason: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancel a scheduled session."""
    user_id = current_user["user_id"]
    
    result = await db.execute(
        select(MentorshipSession).where(
            and_(
                MentorshipSession.id == session_id,
                or_(
                    MentorshipSession.mentor_id == user_id,
                    MentorshipSession.mentee_id == user_id
                )
            )
        )
    )
    
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    if session.status != SessionStatus.SCHEDULED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only scheduled sessions can be cancelled"
        )
    
    session.status = SessionStatus.CANCELLED
    session.cancelled_at = datetime.utcnow()
    session.cancellation_reason = reason
    session.cancelled_by = user_id
    
    await db.commit()
    
    # TODO: Send cancellation notification
    
    return {"message": "Session cancelled successfully"}


@router.post("/sessions/{session_id}/complete", response_model=SessionResponse)
async def complete_session(
    session_id: str,
    completion_data: SessionComplete,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark session as completed with feedback."""
    user_id = current_user["user_id"]
    
    result = await db.execute(
        select(MentorshipSession).where(
            and_(
                MentorshipSession.id == session_id,
                or_(
                    MentorshipSession.mentor_id == user_id,
                    MentorshipSession.mentee_id == user_id
                )
            )
        )
    )
    
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    if session.status == SessionStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session already completed"
        )
    
    # Update session
    session.status = SessionStatus.COMPLETED
    session.mentee_reflection = completion_data.reflection
    session.session_rating = completion_data.rating
    
    if completion_data.mentor_notes:
        session.mentor_notes = completion_data.mentor_notes
    
    await db.commit()
    await db.refresh(session)
    
    # TODO: Award XP for completing session
    # TODO: Update assignment progress
    
    return session
