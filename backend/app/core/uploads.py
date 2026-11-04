"""Strict image validation for user-controlled storage uploads.

Content-type headers and filenames are untrusted. Validate bytes and derive
extensions from the accepted media type; never from an uploaded filename.
"""
from fastapi import HTTPException


IMAGE_SIGNATURES = {
    "image/jpeg": ("jpg", lambda data: data.startswith(b"\xff\xd8\xff")),
    "image/png": ("png", lambda data: data.startswith(b"\x89PNG\r\n\x1a\n")),
    "image/gif": ("gif", lambda data: data.startswith((b"GIF87a", b"GIF89a"))),
    "image/webp": (
        "webp",
        lambda data: len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP",
    ),
}


def validated_image_extension(content_type: str | None, content: bytes) -> str:
    spec = IMAGE_SIGNATURES.get(content_type or "")
    if spec is None or not spec[1](content):
        raise HTTPException(status_code=400, detail="Invalid or unsupported image file")
    return spec[0]


def owned_storage_path(user_id: int, file_path: str, kind: str) -> bool:
    """Reject traversal and ensure files are in the caller's user/kind prefix."""
    if kind not in ("avatar", "image", "document", "project"):
        return False
    if ".." in file_path or "\\" in file_path or "//" in file_path:
        return False
    return file_path.startswith(f"{user_id}/{kind}/")
