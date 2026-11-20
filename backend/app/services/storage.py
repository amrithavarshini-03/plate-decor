import os
import uuid
from abc import ABC, abstractmethod
from app.config import settings


class BaseStorageService(ABC):
    @abstractmethod
    def save_file(self, file_bytes: bytes, filename: str, content_type: str = "image/jpeg") -> str:
        """Saves file and returns the public accessible URL."""
        pass


class LocalStorageService(BaseStorageService):
    def __init__(self, upload_dir: str = settings.UPLOADS_DIR):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def save_file(self, file_bytes: bytes, filename: str, content_type: str = "image/jpeg") -> str:
        ext = os.path.splitext(filename)[1] or ".jpg"
        unique_name = f"{uuid.uuid4().hex}{ext}"
        destination = os.path.join(self.upload_dir, unique_name)
        with open(destination, "wb") as f:
            f.write(file_bytes)
        # Return path relative to server static endpoint
        return f"/uploads/{unique_name}"


class CloudinaryStorageService(BaseStorageService):
    def __init__(self, cloudinary_url: str):
        self.cloudinary_url = cloudinary_url

    def save_file(self, file_bytes: bytes, filename: str, content_type: str = "image/jpeg") -> str:
        # If Cloudinary is configured, upload via SDK/HTTP; otherwise fallback to local
        try:
            import cloudinary
            import cloudinary.uploader
            cloudinary.config_from_url(self.cloudinary_url)
            res = cloudinary.uploader.upload(file_bytes, folder="brb_decors")
            return res.get("secure_url", res.get("url"))
        except Exception:
            # Fallback to local storage if Cloudinary SDK is missing or upload fails
            fallback = LocalStorageService()
            return fallback.save_file(file_bytes, filename, content_type)


def get_storage_service() -> BaseStorageService:
    if settings.CLOUDINARY_URL:
        return CloudinaryStorageService(settings.CLOUDINARY_URL)
    return LocalStorageService()
