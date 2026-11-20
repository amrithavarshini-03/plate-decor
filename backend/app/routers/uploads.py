from fastapi import APIRouter, File, UploadFile, HTTPException, status
from app.services.storage import get_storage_service

router = APIRouter(prefix="/api/uploads", tags=["Uploads"])

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
}


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_file(file: UploadFile = File(...)):
    """Upload photo / moodboard inspiration asset."""
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format. Please upload an image (JPEG, PNG, WebP). Received: {file.content_type}",
        )

    contents = await file.read()
    # 10MB limit
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowable limit of 10MB",
        )

    storage = get_storage_service()
    url = storage.save_file(contents, file.filename or "upload.jpg", file.content_type)
    return {"url": url, "filename": file.filename, "size": len(contents)}
