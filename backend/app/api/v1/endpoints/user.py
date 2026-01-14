"""User management API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import Dict, Any
import uuid

from app.core.database import get_db
from app.core.security import get_current_user, get_password_hash, verify_password
from app.core.supabase_client import avatars_storage
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, PasswordChange

router = APIRouter()


@router.get("/profile", response_model=UserResponse)
async def get_profile(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's profile."""
    result = await db.execute(
        select(User).where(User.id == current_user["user_id"])
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: UserUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's profile."""
    result = await db.execute(
        select(User).where(User.id == current_user["user_id"])
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields
    update_data = profile_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    await db.commit()
    await db.refresh(user)
    
    return user


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload user avatar."""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}"
        )
    
    # Validate file size (max 5MB)
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 5MB"
        )
    
    # Generate unique filename
    ext = file.filename.split(".")[-1] if file.filename else "jpg"
    filename = f"{current_user['user_id']}/{uuid.uuid4()}.{ext}"
    
    try:
        # Upload to Supabase Storage
        public_url = await avatars_storage.upload_file(
            filename,
            content,
            file.content_type
        )
        
        # Update user profile
        await db.execute(
            update(User)
            .where(User.id == current_user["user_id"])
            .values(profile_picture_url=public_url)
        )
        await db.commit()
        
        return {"avatar_url": public_url}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload avatar: {str(e)}"
        )


@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change user password."""
    result = await db.execute(
        select(User).where(User.id == current_user["user_id"])
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify current password
    if not verify_password(password_data.current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    # Update password
    user.hashed_password = get_password_hash(password_data.new_password)
    await db.commit()
    
    return {"message": "Password changed successfully"}


@router.delete("/account")
async def delete_account(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete user account (soft delete)."""
    await db.execute(
        update(User)
        .where(User.id == current_user["user_id"])
        .values(is_active=False)
    )
    await db.commit()
    
    return {"message": "Account deactivated successfully"}
