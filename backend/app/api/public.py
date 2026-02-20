"""Public read-only API endpoints — one endpoint per page."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.contact import Contact
from app.models.factory import Factory
from app.models.gallery import GalleryImage
from app.models.landing import Client, SiteSetting, Statistic
from app.models.news import NewsArticle
from app.models.product import Product
from app.schemas.factory import FactoryOut
from app.schemas.gallery import GalleryImageOut
from app.schemas.landing import (
    AboutPageOut,
    ClientOut,
    FactoriesPageOut,
    GalleryPageOut,
    LandingPageOut,
    NewsPageOut,
    ProductsPageOut,
    StatisticOut,
)
from app.schemas.contact import ContactCreate, ContactOut
from app.schemas.news import NewsArticleOut
from app.schemas.product import ProductOut

router = APIRouter(prefix="/api/page", tags=["public"])


# ── Helpers ────────────────────────────────────────────────────


async def _settings_dict(
    db: AsyncSession,
    groups: list[str] | None = None,
) -> dict[str, str]:
    """Fetch site settings as a flat key→value dict.

    Args:
        db: Database session
        groups: Optional list of groups to filter by

    Returns:
        Dictionary mapping setting keys to their values
    """
    stmt = select(SiteSetting)
    if groups:
        stmt = stmt.where(SiteSetting.group.in_(groups))
    result = await db.execute(stmt)
    return {r.key: r.value for r in result.scalars().all()}


# ── Landing Page ───────────────────────────────────────────────


@router.get("/landing", response_model=LandingPageOut)
async def get_landing_page(
    db: AsyncSession = Depends(get_db),
) -> LandingPageOut:
    """Get all data for the landing page in a single request.

    Returns hero settings, intro, showcase, social links,
    statistics, and client brands.
    """
    settings = await _settings_dict(
        db, groups=["hero", "intro", "social", "showcase", "footer"]
    )
    stats_result = await db.execute(
        select(Statistic).order_by(Statistic.sort_order)
    )
    clients_result = await db.execute(
        select(Client).order_by(Client.sort_order)
    )
    return LandingPageOut(
        settings=settings,
        statistics=[
            StatisticOut.model_validate(r)
            for r in stats_result.scalars().all()
        ],
        clients=[
            ClientOut.model_validate(r)
            for r in clients_result.scalars().all()
        ],
    )


# ── Products Page ──────────────────────────────────────────────


@router.get("/products", response_model=ProductsPageOut)
async def get_products_page(
    product_type: str | None = Query(
        default=None, pattern=r"^(fabric|garment)$"
    ),
    db: AsyncSession = Depends(get_db),
) -> ProductsPageOut:
    """Get all products for the products page with editable settings.

    Args:
        product_type: Optional filter by 'fabric' or 'garment'
        db: Database session

    Returns:
        Products page settings and sorted list of products
    """
    settings = await _settings_dict(db, groups=["products_page"])
    stmt = select(Product).order_by(Product.sort_order)
    if product_type:
        stmt = stmt.where(Product.product_type == product_type)
    result = await db.execute(stmt)
    return ProductsPageOut(
        settings=settings,
        products=[ProductOut.model_validate(r) for r in result.scalars().all()],
    )


# ── Factories Page ─────────────────────────────────────────────


@router.get("/factories", response_model=FactoriesPageOut)
async def get_factories_page(
    db: AsyncSession = Depends(get_db),
) -> FactoriesPageOut:
    """Get all factories for the factories page with editable settings.

    Returns:
        Factories page settings and sorted list of factories
    """
    settings = await _settings_dict(db, groups=["factories_page"])
    result = await db.execute(
        select(Factory).order_by(Factory.sort_order)
    )
    return FactoriesPageOut(
        settings=settings,
        factories=[FactoryOut.model_validate(r) for r in result.scalars().all()],
    )


# ── Gallery Page ───────────────────────────────────────────────


@router.get("/gallery", response_model=GalleryPageOut)
async def get_gallery_page(
    category: str | None = Query(
        default=None,
        pattern=r"^(factory|fabric|garments|dyeing|team)$",
    ),
    db: AsyncSession = Depends(get_db),
) -> GalleryPageOut:
    """Get gallery images for the gallery page with editable settings.

    Args:
        category: Optional category filter
        db: Database session

    Returns:
        Gallery page settings and sorted list of gallery images
    """
    settings = await _settings_dict(db, groups=["gallery_page"])
    stmt = select(GalleryImage).order_by(GalleryImage.sort_order)
    if category:
        stmt = stmt.where(GalleryImage.category == category)
    result = await db.execute(stmt)
    return GalleryPageOut(
        settings=settings,
        images=[GalleryImageOut.model_validate(r) for r in result.scalars().all()],
    )


# ── News Page ──────────────────────────────────────────────────


@router.get("/news", response_model=NewsPageOut)
async def get_news_page(
    category: str | None = Query(
        default=None,
        pattern=r"^(industry|company|export|sustainability)$",
    ),
    limit: int = Query(default=50, le=100),
    db: AsyncSession = Depends(get_db),
) -> NewsPageOut:
    """Get news articles for the news page with editable settings.

    Args:
        category: Optional category filter
        limit: Max articles to return
        db: Database session

    Returns:
        News page settings and articles ordered by publication date (newest first)
    """
    settings = await _settings_dict(db, groups=["news_page"])
    stmt = (
        select(NewsArticle)
        .order_by(NewsArticle.published_at.desc())
        .limit(limit)
    )
    if category:
        stmt = stmt.where(NewsArticle.category == category)
    result = await db.execute(stmt)
    return NewsPageOut(
        settings=settings,
        articles=[NewsArticleOut.model_validate(r) for r in result.scalars().all()],
    )


# ── News Detail ────────────────────────────────────────────────


@router.get("/news/{article_id}", response_model=NewsArticleOut)
async def get_news_detail(
    article_id: int,
    db: AsyncSession = Depends(get_db),
) -> NewsArticleOut:
    """Get a single news article by ID.

    Args:
        article_id: Article ID
        db: Database session

    Returns:
        The news article

    Raises:
        HTTPException: If article not found
    """
    result = await db.execute(
        select(NewsArticle).where(NewsArticle.id == article_id)
    )
    article = result.scalar_one_or_none()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return NewsArticleOut.model_validate(article)


# ── About Page ─────────────────────────────────────────────────


@router.get("/about", response_model=AboutPageOut)
async def get_about_page(
    db: AsyncSession = Depends(get_db),
) -> AboutPageOut:
    """Get all data for the about page.

    Returns:
        About page settings (company info, export countries, etc.)
    """
    settings = await _settings_dict(db, groups=["about", "social", "footer"])
    return AboutPageOut(settings=settings)


# ── Contact Form ───────────────────────────────────────────────


@router.post(
    "/contact",
    response_model=ContactOut,
    status_code=201,
)
async def submit_contact(
    body: ContactCreate,
    db: AsyncSession = Depends(get_db),
) -> ContactOut:
    """Submit a contact form message.

    Args:
        body: Contact form data
        db: Database session

    Returns:
        The created contact message
    """
    obj = Contact(**body.model_dump())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return ContactOut.model_validate(obj)
