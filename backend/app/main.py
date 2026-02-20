"""FastAPI application entry point."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.admin import auth_router, router as admin_router
from app.api.public import router as public_router
from app.config import UPLOAD_PATH, settings
from app.database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Create database tables on startup.

    Args:
        app: FastAPI application instance

    Yields:
        None
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="Kezar Teks CMS API",
    description="Backend CMS for Kezar Teks textile company website",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
UPLOAD_PATH.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_PATH)), name="uploads")

# Routers
app.include_router(public_router)
app.include_router(auth_router)
app.include_router(admin_router)


@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    """Health check endpoint.

    Returns:
        Status ok
    """
    return {"status": "ok"}
