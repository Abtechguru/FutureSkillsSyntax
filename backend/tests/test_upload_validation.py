"""Validation checks for image uploads and storage permissions."""
import pytest
from fastapi import HTTPException
from app.core.uploads import validated_image_extension, owned_storage_path


def test_png_signature():
    assert validated_image_extension("image/png", bytes([137, 80, 78, 71, 13, 10, 26, 10])) == "png"


def test_invalid_png_rejected():
    with pytest.raises(HTTPException) as error:
        validated_image_extension("image/png", b"invalid-file")
    assert error.value.status_code == 400


def test_user_storage_namespace():
    assert owned_storage_path(12, "12/avatar/photo.png", "avatar")
    assert not owned_storage_path(12, "13/avatar/photo.png", "avatar")
