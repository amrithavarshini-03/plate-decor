import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.utils.rate_limit import limiter
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
from app.routers.seed import seed_database

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("brb_decors")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database tables exist
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    # Automatically ensure uploads folder exists
    os.makedirs(settings.UPLOADS_DIR, exist_ok=True)

    # Seed initial admin and ceremonial items if needed
    try:
        db = SessionLocal()
        seed_database(db)
        db.close()
        logger.info("Ceremonial database seed verified.")
    except Exception as e:
        logger.warning(f"Seed initialization notice: {e}")

    yield
    logger.info("BRB Decors API shutting down gracefully.")


app = FastAPI(
    title="BRB Decors Ceremonial API",
    description="Backend API for BRB Decors — Handcrafted decorative plates (thaalams) and stage decoration booking platform in Tamil Nadu, India.",
    version="1.0.0",
    lifespan=lifespan,
)

# SlowAPI Limiter state & custom exception handler
app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "detail": "Too many requests. Please pause for a moment before arranging more plates.",
            "error": "rate_limit_exceeded",
        },
    )


# CORS Middleware
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local uploads static files
os.makedirs(settings.UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOADS_DIR), name="uploads")

# Include Routers
app.include_router(auth_router)
app.include_router(bookings_router)
app.include_router(gallery_router)
app.include_router(products_router)
app.include_router(stores_router)
app.include_router(testimonials_router)
app.include_router(availability_router)
app.include_router(uploads_router)
app.include_router(payments_router)
app.include_router(seed_router)


@app.get("/", tags=["Health"])
def root():
    return {
        "business": "BRB Decors",
        "tagline": "BRB, we’re arranging something beautiful.",
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "payments_enabled": settings.ENABLE_PAYMENTS,
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "brb-decors-api"}
