from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from typing import List, Dict, Any, Optional
from app.core.database import get_db
from app.core.security import get_current_user, get_password_hash
from app.models.user import User, UserRole
from app.models.mentorship import MentorAssignment, MentorshipSession
from app.models.payment import Transaction, TransactionStatus
from app.schemas.admin import UserSummary, MentorCreate, AssignmentCreate, TransactionResponse, DashboardStats

router = APIRouter()

async def check_admin(current_user: Dict[str, Any] = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can access this resource"
        )
    return current_user

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    admin: Dict = Depends(check_admin)
):
    """Retrieve overall platform statistics."""
    total_users = await db.scalar(select(func.count(User.id)))
    total_mentors = await db.scalar(select(func.count(User.id)).where(User.role == UserRole.MENTOR))
    total_mentees = await db.scalar(select(func.count(User.id)).where(User.role == UserRole.MENTEE))
    
    total_revenue = await db.scalar(
        select(func.sum(Transaction.amount))
        .where(Transaction.status == TransactionStatus.SUCCESSFUL)
    ) or 0.0
    
    pending_tx = await db.scalar(
        select(func.count(Transaction.id))
        .where(Transaction.status == TransactionStatus.PENDING)
    )
    
    return {
        "total_users": total_users,
        "total_mentors": total_mentors,
        "total_mentees": total_mentees,
        "total_revenue": total_revenue,
        "pending_transactions": pending_tx
    }

@router.get("/users", response_model=List[UserSummary])
async def list_users(
    role: Optional[UserRole] = None,
    db: AsyncSession = Depends(get_db),
    admin: Dict = Depends(check_admin)
):
    """List all users, optionally filtered by role."""
    query = select(User)
    if role:
        query = query.where(User.role == role)
    
    result = await db.execute(query.order_by(User.created_at.desc()))
    return result.scalars().all()

@router.post("/mentors", response_model=UserSummary)
async def create_mentor(
    mentor_data: MentorCreate,
    db: AsyncSession = Depends(get_db),
    admin: Dict = Depends(check_admin)
):
    """Manually add a new mentor."""
    # Check if user exists
    existing = await db.scalar(select(User).where(User.email == mentor_data.email))
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    mentor = User(
        **mentor_data.model_dump(exclude={"password"}),
        hashed_password=get_password_hash(mentor_data.password),
        role=UserRole.MENTOR,
        is_verified=True,
        is_active=True
    )
    db.add(mentor)
    await db.commit()
    await db.refresh(mentor)
    return mentor

@router.post("/assignments", status_code=status.HTTP_201_CREATED)
async def create_assignment(
    data: AssignmentCreate,
    db: AsyncSession = Depends(get_db),
    admin: Dict = Depends(check_admin)
):
    """Assign a mentor to a mentee."""
    assignment = MentorAssignment(
        mentor_id=data.mentor_id,
        mentee_id=data.mentee_id,
        start_date=data.start_date,
        end_date=data.end_date,
        is_active=True
    )
    db.add(assignment)
    await db.commit()
    return {"message": "Mentor assigned successfully"}

@router.get("/transactions", response_model=List[TransactionResponse])
async def list_transactions(
    status: Optional[TransactionStatus] = None,
    db: AsyncSession = Depends(get_db),
    admin: Dict = Depends(check_admin)
):
    """List and filter platform transactions."""
    query = select(Transaction)
    if status:
        query = query.where(Transaction.status == status)
    
    result = await db.execute(query.order_by(Transaction.created_at.desc()))
    return result.scalars().all()

@router.post("/transactions/{tx_id}/verify")
async def verify_transaction(
    tx_id: int,
    approve: bool,
    notes: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    admin: Dict = Depends(check_admin)
):
    """Verify and approve/reject a (local) transaction."""
    tx = await db.get(Transaction, tx_id)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    tx.status = TransactionStatus.SUCCESSFUL if approve else TransactionStatus.FAILED
    tx.admin_notes = notes
    tx.verified_by = admin["user_id"]
    
    # If successful, notify the mentor that they can commence the session
    if tx.status == TransactionStatus.SUCCESSFUL:
        if tx.assignment_id:
            # Update assignment status to active
            await db.execute(
                update(MentorAssignment)
                .where(MentorAssignment.id == tx.assignment_id)
                .values(is_active=True)
            )
            # Find the mentor for this assignment to log notification
            result = await db.execute(select(MentorAssignment).where(MentorAssignment.id == tx.assignment_id))
            assignment = result.scalar_one_or_none()
            if assignment:
                print(f"NOTIFICATION: Mentor {assignment.mentor_id} notified: Session payment confirmed. You can now commence.")
                
    await db.commit()
    return {"status": tx.status}
