from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base

class PaymentProvider(str, enum.Enum):
    PAYSTACK = "paystack"
    PAYPAL = "paypal"
    LOCAL = "local"

class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESSFUL = "successful"
    FAILED = "failed"
    REFUNDED = "refunded"

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assignment_id = Column(Integer, ForeignKey("mentor_assignments.id"), nullable=True)
    session_id = Column(Integer, ForeignKey("mentorship_sessions.id"), nullable=True)
    
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    provider = Column(Enum(PaymentProvider), nullable=False)
    reference = Column(String(100), unique=True, index=True, nullable=False)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    purpose = Column(String(200), nullable=False) # e.g., "Mentorship Session Payment"
    
    # Provider-specific data
    provider_id = Column(String(255), nullable=True) # ID from Paystack/PayPal
    metadata_json = Column(Text, nullable=True) # JSON stored as text for flexibility
    
    # Proof of payment for local transactions
    evidence_url = Column(String(500), nullable=True)
    admin_notes = Column(Text, nullable=True)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    verifier = relationship("User", foreign_keys=[verified_by])
