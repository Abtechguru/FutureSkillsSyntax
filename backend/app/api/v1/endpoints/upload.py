"""File upload API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, Optional
import uuid

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.core.supabase_client import avatars_storage, documents_storage, projects_storage

router = APIRouter()


ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
ALLOWED_DOCUMENT_TYPES = ["application/pdf", "application/msword", 
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    file_type: str = Form(..., regex="^(avatar|document|project|image)$"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload a file to storage.
    
    - **avatar**: Profile pictures (images only, max 5MB)
    - **document**: Documents (PDF, DOC, max 10MB)
    - **project**: Project files (any type, max 10MB)
    - **image**: General images (max 5MB)
    """
    user_id = current_user["user_id"]
    
    # Read file content
    content = await file.read()
    file_size = len(content)
    
    # Validate based on type
    if file_type == "avatar":
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type for avatar. Allowed: {', '.join(ALLOWED_IMAGE_TYPES)}"
            )
        if file_size > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Avatar file too large. Maximum size is 5MB"
            )
        storage = avatars_storage
        
    elif file_type == "document":
        if file.content_type not in ALLOWED_DOCUMENT_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type for document. Allowed: {', '.join(ALLOWED_DOCUMENT_TYPES)}"
            )
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Document too large. Maximum size is 10MB"
            )
        storage = documents_storage
        
    elif file_type == "image":
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_IMAGE_TYPES)}"
            )
        if file_size > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image too large. Maximum size is 5MB"
            )
        storage = documents_storage  # Store in documents bucket
        
    else:  # project
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File too large. Maximum size is 10MB"
            )
        storage = projects_storage
    
    # Generate unique filename
    ext = file.filename.split(".")[-1] if file.filename and "." in file.filename else "bin"
    filename = f"{user_id}/{file_type}/{uuid.uuid4()}.{ext}"
    
    try:
        public_url = await storage.upload_file(
            filename,
            content,
            file.content_type or "application/octet-stream"
        )
        
        return {
            "url": public_url,
            "filename": filename,
            "file_type": file_type,
            "size": file_size,
            "content_type": file.content_type,
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
        )


@router.delete("/{file_path:path}")
async def delete_file(
    file_path: str,
    file_type: str = Form(..., regex="^(avatar|document|project)$"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a file from storage."""
    user_id = current_user["user_id"]
    
    # Verify the file belongs to the user (path should start with user_id)
    if not file_path.startswith(f"{user_id}/"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this file"
        )
    
    # Select storage bucket
    if file_type == "avatar":
        storage = avatars_storage
    elif file_type == "document":
        storage = documents_storage
    else:
        storage = projects_storage
    
    try:
        await storage.delete_file(file_path)
        return {"message": "File deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete file: {str(e)}"
        )


@router.get("/signed-url/{file_path:path}")
async def get_signed_url(
    file_path: str,
    file_type: str = "document",
    expires_in: int = 3600,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a signed URL for private file access."""
    user_id = current_user["user_id"]
    
    # Verify the file belongs to the user
    if not file_path.startswith(f"{user_id}/"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this file"
        )
    
    # Select storage bucket
    if file_type == "avatar":
        storage = avatars_storage
    elif file_type == "document":
        storage = documents_storage
    else:
        storage = projects_storage
    
    try:
        signed_url = await storage.get_signed_url(file_path, expires_in)
        return {"signed_url": signed_url, "expires_in": expires_in}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate signed URL: {str(e)}"
        )
