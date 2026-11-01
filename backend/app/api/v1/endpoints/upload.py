"""File upload API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, Optional
import uuid

from app.core.database import get_db
from app.core.uploads import validated_image_extension, owned_storage_path
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
    if file_type != "avatar" and not settings.NON_AVATAR_UPLOADS_ENABLED:
        raise HTTPException(status_code=503, detail="Document and project uploads are not yet enabled")
    if current_user["role"] == "mentee" and file_type in ("avatar", "image"):
        raise HTTPException(status_code=403, detail="Minor profile images require guardian safeguards")

    # Read file content
    content = await file.read(MAX_FILE_SIZE + 1)
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
    if file_type in ("avatar", "image"):
        ext = validated_image_extension(file.content_type, content)
    else:
        # Non-avatar uploads remain disabled unless explicitly configured.
        ext = (file.filename or "file.bin").rsplit(".", 1)[-1].lower()
        if not ext.isalnum() or len(ext) > 8:
            raise HTTPException(status_code=400, detail="Invalid extension")
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
            detail="Unable to upload file"
        )


@router.delete("/{file_path:path}")
async def delete_file(
    file_path: str,
    file_type: str = Form(..., regex="^(avatar|document|project|image)$"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a file from storage."""
    user_id = current_user["user_id"]
    
    # Verify the file belongs to the user (path should start with user_id)
    if not owned_storage_path(user_id, file_path, file_type):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this file"
        )
    
    # Restrict signed links to short expiry windows and known storage types.
    if file_type not in ("avatar", "document", "project", "image") or not (60 <= expires_in <= 900):
        raise HTTPException(status_code=400, detail="Invalid file type or expiry")

    # Select storage bucket
    if file_type == "avatar":
        storage = avatars_storage
    elif file_type in ("document", "image"):
        storage = documents_storage
    else:
        storage = projects_storage
    
    try:
        await storage.delete_file(file_path)
        return {"message": "File deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to delete file"
        )


@router.get("/signed-url/{file_path:path}")
async def get_signed_url(
    file_path: str,
    file_type: str = "document",
    expires_in: int = 900,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a signed URL for private file access."""
    user_id = current_user["user_id"]
    
    # Verify the file belongs to the user
    if not owned_storage_path(user_id, file_path, file_type):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this file"
        )
    
    # Select storage bucket
    if file_type == "avatar":
        storage = avatars_storage
    elif file_type in ("document", "image"):
        storage = documents_storage
    else:
        storage = projects_storage
    
    try:
        signed_url = await storage.get_signed_url(file_path, expires_in)
        return {"signed_url": signed_url, "expires_in": expires_in}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate signed URL"
        )
