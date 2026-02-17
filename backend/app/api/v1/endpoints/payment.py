from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
import uuid

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.payment import payment_service
from app.models.payment import Transaction, PaymentProvider, TransactionStatus
from app.core.config import settings

router = APIRouter()

@router.post("/paystack/initialize")
async def initialize_paystack(
    amount: float,
    purpose: str,
    db: AsyncSession = Depends(get_db),
    current_user: Dict = Depends(get_current_user)
):
    """Initialize Paystack payment."""
    reference = f"PS-{uuid.uuid4().hex[:12].upper()}"
    
    # Get user email
    from app.models.user import User
    user = await db.get(User, current_user["user_id"])
    
    response = await payment_service.initialize_paystack_payment(
        email=user.email,
        amount=amount,
        reference=reference
    )
    
    if not response.get("status"):
        raise HTTPException(status_code=400, detail="Paystack initialization failed")
        
    # Record transaction
    tx = Transaction(
        user_id=current_user["user_id"],
        amount=amount,
        provider=PaymentProvider.PAYSTACK,
        reference=reference,
        status=TransactionStatus.PENDING,
        purpose=purpose
    )
    db.add(tx)
    await db.commit()
    
    return response["data"]

@router.post("/paystack/verify/{reference}")
async def verify_paystack(
    reference: str,
    db: AsyncSession = Depends(get_db)
):
    """Verify Paystack payment."""
    response = await payment_service.verify_paystack_payment(reference)
    
    if response.get("status") and response["data"]["status"] == "success":
        from sqlalchemy import update
        await db.execute(
            update(Transaction)
            .where(Transaction.reference == reference)
            .values(status=TransactionStatus.SUCCESSFUL)
        )
        await db.commit()
        return {"status": "success", "message": "Payment verified"}
        
    return {"status": "failed", "message": "Payment verification failed"}

@router.post("/local/submit")
async def submit_local_payment(
    amount: float,
    purpose: str,
    evidence_url: str,
    db: AsyncSession = Depends(get_db),
    current_user: Dict = Depends(get_current_user)
):
    """Submit proof of local bank transfer."""
    reference = f"LOC-{uuid.uuid4().hex[:12].upper()}"
    
    tx = Transaction(
        user_id=current_user["user_id"],
        amount=amount,
        provider=PaymentProvider.LOCAL,
        reference=reference,
        status=TransactionStatus.PENDING,
        purpose=purpose,
        evidence_url=evidence_url
    )
    db.add(tx)
    await db.commit()
    
    return {"message": "Payment evidence submitted for review", "reference": reference}
