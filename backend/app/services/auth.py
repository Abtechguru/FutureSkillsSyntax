"""Authentication service."""

import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.models.user import User
from app.core.config import settings
from app.core.security import get_password_hash
from app.services.email import EmailService


class AuthService:
    """Authentication and user verification service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.email_service = EmailService()
    
    @staticmethod
    def generate_token() -> str:
        """Generate a secure random token."""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def hash_token(token: str) -> str:
        """Hash a token for storage."""
        return hashlib.sha256(token.encode()).hexdigest()
    
    async def create_verification_token(self, user: User) -> str:
        """Create and store email verification token."""
        token = self.generate_token()
        hashed = self.hash_token(token)
        
        user.verification_token = hashed
        await self.db.commit()
        
        return token
    
    async def verify_email(self, token: str) -> Optional[User]:
        """Verify user email with token."""
        hashed = self.hash_token(token)
        
        result = await self.db.execute(
            select(User).where(User.verification_token == hashed)
        )
        user = result.scalar_one_or_none()
        
        if user:
            user.is_verified = True
            user.verification_token = None
            await self.db.commit()
            return user
        
        return None
    
    async def create_password_reset_token(self, email: str) -> Optional[str]:
        """Create password reset token."""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        
        token = self.generate_token()
        hashed = self.hash_token(token)
        
        user.password_reset_token = hashed
        user.password_reset_expires = datetime.utcnow() + timedelta(hours=1)
        await self.db.commit()
        
        # Send email
        await self.email_service.send_password_reset_email(
            to_email=user.email,
            to_name=user.full_name or user.username,
            reset_token=token
        )
        
        return token
    
    async def reset_password(self, token: str, new_password: str) -> bool:
        """Reset password with token."""
        hashed = self.hash_token(token)
        
        result = await self.db.execute(
            select(User).where(
                User.password_reset_token == hashed,
                User.password_reset_expires > datetime.utcnow()
            )
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return False
        
        user.hashed_password = get_password_hash(new_password)
        user.password_reset_token = None
        user.password_reset_expires = None
        await self.db.commit()
        
        return True
    
    async def send_verification_email(self, user: User) -> bool:
        """Send email verification link."""
        token = await self.create_verification_token(user)
        
        await self.email_service.send_verification_email(
            to_email=user.email,
            to_name=user.full_name or user.username,
            verification_token=token
        )
        
        return True
