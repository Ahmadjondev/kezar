"""Force-reset and re-seed the database with official company data.

Drops all existing rows from every seeded table, then calls the normal
seed pipeline.  Safe to run multiple times — each run gives you a clean
slate with the latest seed data.

Usage
-----
From the backend/ directory:

    python -m app.reseed          # recommended (module form)
    # or via Makefile:
    make reseed
"""

import asyncio
import logging

from sqlalchemy import delete

from app.database import async_session, engine, Base
from app.models.factory import Factory
from app.models.gallery import GalleryImage
from app.models.landing import Client, SiteSetting, Statistic
from app.models.news import NewsArticle
from app.models.product import Product
from app.seed import seed_database

logger = logging.getLogger(__name__)


async def _clear_all(db) -> None:  # type: ignore[type-arg]
    """Delete all rows from every seeded table."""
    tables = [
        SiteSetting,
        Statistic,
        Client,
        Product,
        Factory,
        GalleryImage,
        NewsArticle,
    ]
    for model in tables:
        await db.execute(delete(model))
    logger.info("All seeded tables cleared.")


async def reseed_database() -> None:
    """Clear every seeded table then run the full seed pipeline."""
    # Ensure tables exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        await _clear_all(db)
        await db.commit()

    # seed_database() opens its own session
    await seed_database()
    logger.info("Database re-seeded with official KEZAR TEKS company data.")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s  %(levelname)-8s  %(message)s",
    )
    asyncio.run(reseed_database())
