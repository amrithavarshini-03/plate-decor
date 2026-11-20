from app.routers.auth import router as auth_router
from app.routers.bookings import router as bookings_router
from app.routers.gallery import router as gallery_router
from app.routers.products import router as products_router
from app.routers.stores import router as stores_router
from app.routers.testimonials import router as testimonials_router
from app.routers.availability import router as availability_router
from app.routers.uploads import router as uploads_router
from app.routers.payments import router as payments_router
from app.routers.seed import router as seed_router

__all__ = [
    "auth_router",
    "bookings_router",
    "gallery_router",
    "products_router",
    "stores_router",
    "testimonials_router",
    "availability_router",
    "uploads_router",
    "payments_router",
    "seed_router",
]
