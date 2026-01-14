"""Supabase client for storage and realtime features."""

from supabase import create_client, Client
from typing import Optional
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

_supabase_client: Optional[Client] = None


def get_supabase_client() -> Client:
    """Get or create Supabase client instance."""
    global _supabase_client
    
    if _supabase_client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
            raise ValueError("Supabase URL and Service Role Key must be configured")
        
        _supabase_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
        logger.info("Supabase client initialized")
    
    return _supabase_client


class SupabaseStorage:
    """Supabase Storage wrapper for file operations."""
    
    def __init__(self, bucket: str = "uploads"):
        self.client = get_supabase_client()
        self.bucket = bucket
    
    async def upload_file(
        self,
        file_path: str,
        file_content: bytes,
        content_type: str = "application/octet-stream"
    ) -> str:
        """
        Upload a file to Supabase Storage.
        
        Args:
            file_path: Path in the bucket (e.g., "avatars/user-123.jpg")
            file_content: File content as bytes
            content_type: MIME type of the file
            
        Returns:
            Public URL of the uploaded file
        """
        try:
            result = self.client.storage.from_(self.bucket).upload(
                file_path,
                file_content,
                file_options={"content-type": content_type}
            )
            
            # Get public URL
            public_url = self.client.storage.from_(self.bucket).get_public_url(file_path)
            logger.info(f"File uploaded: {file_path}")
            return public_url
            
        except Exception as e:
            logger.error(f"Failed to upload file: {e}")
            raise
    
    async def delete_file(self, file_path: str) -> bool:
        """
        Delete a file from Supabase Storage.
        
        Args:
            file_path: Path in the bucket
            
        Returns:
            True if deleted successfully
        """
        try:
            self.client.storage.from_(self.bucket).remove([file_path])
            logger.info(f"File deleted: {file_path}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete file: {e}")
            raise
    
    async def get_signed_url(self, file_path: str, expires_in: int = 3600) -> str:
        """
        Get a signed URL for private file access.
        
        Args:
            file_path: Path in the bucket
            expires_in: URL expiration time in seconds
            
        Returns:
            Signed URL
        """
        try:
            result = self.client.storage.from_(self.bucket).create_signed_url(
                file_path,
                expires_in
            )
            return result.get("signedURL", "")
        except Exception as e:
            logger.error(f"Failed to get signed URL: {e}")
            raise
    
    async def list_files(self, folder: str = "") -> list:
        """
        List files in a folder.
        
        Args:
            folder: Folder path in the bucket
            
        Returns:
            List of file objects
        """
        try:
            result = self.client.storage.from_(self.bucket).list(folder)
            return result
        except Exception as e:
            logger.error(f"Failed to list files: {e}")
            raise


# Storage instances for different buckets
avatars_storage = SupabaseStorage("avatars")
documents_storage = SupabaseStorage("documents")
projects_storage = SupabaseStorage("projects")
