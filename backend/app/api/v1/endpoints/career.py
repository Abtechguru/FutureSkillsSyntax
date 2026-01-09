from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.career import CareerRole, CareerAssessment, CareerField
from app.models.user import User
from app.schemas.career import (
    CareerRoleResponse,
    CareerAssessmentRequest,
    CareerAssessmentResponse,
    SkillGapAnalysis,
)
from app.services.career import CareerAdvisorService

router = APIRouter()


@router.get("/roles", response_model=List[CareerRoleResponse])
async def get_career_roles(
    field: CareerField = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all career roles, optionally filtered by field."""
    query = select(CareerRole).where(CareerRole.is_active == True)
    
    if field:
        query = query.where(CareerRole.field == field)
    
    result = await db.execute(query)
    roles = result.scalars().all()
    
    return roles


@router.get("/roles/{role_id}", response_model=CareerRoleResponse)
async def get_career_role(
    role_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific career role by ID."""
    result = await db.execute(
        select(CareerRole).where(
            CareerRole.id == role_id,
            CareerRole.is_active == True
        )
    )
    role = result.scalar_one_or_none()
    
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career role not found",
        )
    
    return role


@router.post("/assess", response_model=CareerAssessmentResponse)
async def assess_career_path(
    assessment_data: CareerAssessmentRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Perform career assessment and get recommendations."""
    # Get user
    result = await db.execute(
        select(User).where(User.id == current_user["user_id"])
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Use CareerAdvisorService to analyze and recommend
    career_service = CareerAdvisorService(db)
    recommendation = await career_service.analyze_and_recommend(
        user_id=user.id,
        answers=assessment_data.answers,
        current_skills=assessment_data.current_skills,
        interests=assessment_data.interests
    )
    
    # Save assessment
    assessment = CareerAssessment(
        user_id=user.id,
        answers=assessment_data.answers,
        personality_traits=recommendation.personality_traits,
        current_skills=assessment_data.current_skills,
        interests=assessment_data.interests,
        recommended_role_id=recommendation.recommended_role_id,
        match_score=recommendation.match_score,
        alternative_roles=recommendation.alternative_roles,
        skill_gaps=recommendation.skill_gaps,
    )
    
    db.add(assessment)
    await db.commit()
    await db.refresh(assessment)
    
    # Get the recommended role details
    result = await db.execute(
        select(CareerRole).where(CareerRole.id == recommendation.recommended_role_id)
    )
    recommended_role = result.scalar_one_or_none()
    
    return CareerAssessmentResponse(
        id=assessment.id,
        user_id=user.id,
        recommended_role=recommended_role,
        match_score=recommendation.match_score,
        alternative_roles=recommendation.alternative_roles,
        skill_gaps=recommendation.skill_gaps,
        personality_traits=recommendation.personality_traits,
        created_at=assessment.created_at,
    )


@router.get("/skill-gap-analysis/{role_id}", response_model=SkillGapAnalysis)
async def analyze_skill_gap(
    role_id: int,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Analyze skill gaps for a specific career role."""
    # Get user's latest assessment
    result = await db.execute(
        select(CareerAssessment).where(
            CareerAssessment.user_id == current_user["user_id"]
        ).order_by(CareerAssessment.created_at.desc())
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No career assessment found. Please complete an assessment first.",
        )
    
    # Get the career role
    result = await db.execute(
        select(CareerRole).where(CareerRole.id == role_id)
    )
    role = result.scalar_one_or_none()
    
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career role not found",
        )
    
    # Analyze skill gaps
    career_service = CareerAdvisorService(db)
    skill_gap_analysis = await career_service.analyze_skill_gaps(
        current_skills=assessment.current_skills,
        required_skills=role.required_skills,
        recommended_skills=role.recommended_skills
    )
    
    return skill_gap_analysis