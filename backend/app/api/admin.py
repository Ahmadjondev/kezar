"""Admin CRUD API endpoints (JWT-protected)."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import (
    LoginRequest,
    Token,
    authenticate_admin,
    create_access_token,
    get_current_admin,
)
from app.database import get_db
from app.models.contact import Contact
from app.models.factory import Factory
from app.models.gallery import GalleryImage
from app.models.landing import Client, SiteSetting, Statistic
from app.models.news import NewsArticle
from app.models.product import Product
from app.schemas.factory import FactoryCreate, FactoryOut, FactoryUpdate
from app.schemas.gallery import GalleryImageCreate, GalleryImageOut, GalleryImageUpdate
from app.schemas.landing import (
    ClientCreate,
    ClientOut,
    ClientUpdate,
    SiteSettingBulkUpdate,
    SiteSettingOut,
    SiteSettingUpdate,
    StatisticCreate,
    StatisticOut,
    StatisticUpdate,
)
from app.schemas.news import NewsArticleCreate, NewsArticleOut, NewsArticleUpdate
from app.schemas.contact import ContactOut, ContactUpdate
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
    dependencies=[Depends(get_current_admin)],
)

AdminDep = Annotated[str, Depends(get_current_admin)]


# ── Auth (no JWT required) ─────────────────────────────────────

auth_router = APIRouter(prefix="/api/admin", tags=["auth"])


@auth_router.post("/login", response_model=Token)
async def login(body: LoginRequest) -> Token:
    """Authenticate admin and return JWT token."""
    if not authenticate_admin(body.username, body.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    return Token(access_token=create_access_token({"sub": body.username}))


# ── Helpers ────────────────────────────────────────────────────


async def _get_or_404(
    db: AsyncSession,
    model: type,
    item_id: int,
    label: str = "Item",
) -> object:
    """Fetch a record by ID or raise 404."""
    result = await db.execute(select(model).where(model.id == item_id))
    obj = result.scalar_one_or_none()
    if obj is None:
        raise HTTPException(status_code=404, detail=f"{label} not found")
    return obj


def _apply_updates(obj: object, data: dict) -> None:
    """Apply non-None values from a dict to a model instance."""
    for key, val in data.items():
        if val is not None:
            setattr(obj, key, val)


# ── Site Settings ──────────────────────────────────────────────


@router.get("/settings", response_model=list[SiteSettingOut])
async def list_settings(
    group: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[SiteSettingOut]:
    """List all site settings, optionally filtered by group."""
    stmt = select(SiteSetting)
    if group:
        stmt = stmt.where(SiteSetting.group == group)
    result = await db.execute(stmt)
    return [SiteSettingOut.model_validate(r) for r in result.scalars().all()]


@router.put("/settings/{key}", response_model=SiteSettingOut)
async def update_setting(
    key: str,
    body: SiteSettingUpdate,
    db: AsyncSession = Depends(get_db),
) -> SiteSettingOut:
    """Update a site setting value by key. Creates if not exists."""
    result = await db.execute(
        select(SiteSetting).where(SiteSetting.key == key)
    )
    setting = result.scalar_one_or_none()
    if setting is None:
        setting = SiteSetting(key=key, value=body.value, group="general")
        db.add(setting)
    else:
        setting.value = body.value
    await db.commit()
    await db.refresh(setting)
    return SiteSettingOut.model_validate(setting)


@router.put("/settings", response_model=list[SiteSettingOut])
async def bulk_update_settings(
    body: SiteSettingBulkUpdate,
    db: AsyncSession = Depends(get_db),
) -> list[SiteSettingOut]:
    """Bulk-update multiple site settings at once.

    Creates settings that don't exist yet, updates those that do.
    """
    updated: list[SiteSetting] = []
    for item in body.settings:
        result = await db.execute(
            select(SiteSetting).where(SiteSetting.key == item.key)
        )
        setting = result.scalar_one_or_none()
        if setting is None:
            setting = SiteSetting(
                key=item.key, value=item.value, group=item.group
            )
            db.add(setting)
        else:
            setting.value = item.value
            setting.group = item.group
        updated.append(setting)
    await db.commit()
    for s in updated:
        await db.refresh(s)
    return [SiteSettingOut.model_validate(s) for s in updated]


@router.delete(
    "/settings/{key}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_setting(
    key: str,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a site setting by key."""
    result = await db.execute(
        select(SiteSetting).where(SiteSetting.key == key)
    )
    setting = result.scalar_one_or_none()
    if setting is None:
        raise HTTPException(status_code=404, detail="Setting not found")
    await db.delete(setting)
    await db.commit()


# ── Statistics CRUD ────────────────────────────────────────────


@router.get("/statistics", response_model=list[StatisticOut])
async def list_statistics(
    db: AsyncSession = Depends(get_db),
) -> list[StatisticOut]:
    """List all statistics."""
    result = await db.execute(
        select(Statistic).order_by(Statistic.sort_order)
    )
    return [StatisticOut.model_validate(r) for r in result.scalars().all()]


@router.post(
    "/statistics",
    response_model=StatisticOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_statistic(
    body: StatisticCreate,
    db: AsyncSession = Depends(get_db),
) -> StatisticOut:
    """Create a new statistic."""
    obj = Statistic(**body.model_dump())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return StatisticOut.model_validate(obj)


@router.put("/statistics/{item_id}", response_model=StatisticOut)
async def update_statistic(
    item_id: int,
    body: StatisticUpdate,
    db: AsyncSession = Depends(get_db),
) -> StatisticOut:
    """Update a statistic."""
    obj = await _get_or_404(db, Statistic, item_id, "Statistic")
    _apply_updates(obj, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(obj)
    return StatisticOut.model_validate(obj)


@router.delete(
    "/statistics/{item_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_statistic(
    item_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a statistic."""
    obj = await _get_or_404(db, Statistic, item_id, "Statistic")
    await db.delete(obj)
    await db.commit()


# ── Clients CRUD ───────────────────────────────────────────────


@router.get("/clients", response_model=list[ClientOut])
async def list_clients(
    db: AsyncSession = Depends(get_db),
) -> list[ClientOut]:
    """List all clients."""
    result = await db.execute(
        select(Client).order_by(Client.sort_order)
    )
    return [ClientOut.model_validate(r) for r in result.scalars().all()]


@router.post(
    "/clients",
    response_model=ClientOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_client(
    body: ClientCreate,
    db: AsyncSession = Depends(get_db),
) -> ClientOut:
    """Create a client."""
    obj = Client(**body.model_dump())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return ClientOut.model_validate(obj)


@router.put("/clients/{item_id}", response_model=ClientOut)
async def update_client(
    item_id: int,
    body: ClientUpdate,
    db: AsyncSession = Depends(get_db),
) -> ClientOut:
    """Update a client."""
    obj = await _get_or_404(db, Client, item_id, "Client")
    _apply_updates(obj, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(obj)
    return ClientOut.model_validate(obj)


@router.delete(
    "/clients/{item_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_client(
    item_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a client."""
    obj = await _get_or_404(db, Client, item_id, "Client")
    await db.delete(obj)
    await db.commit()


# ── Products CRUD ──────────────────────────────────────────────


@router.get("/products", response_model=list[ProductOut])
async def list_products(
    db: AsyncSession = Depends(get_db),
) -> list[ProductOut]:
    """List all products."""
    result = await db.execute(
        select(Product).order_by(Product.sort_order)
    )
    return [ProductOut.model_validate(r) for r in result.scalars().all()]


@router.post(
    "/products",
    response_model=ProductOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_product(
    body: ProductCreate,
    db: AsyncSession = Depends(get_db),
) -> ProductOut:
    """Create a product."""
    obj = Product(**body.model_dump())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return ProductOut.model_validate(obj)


@router.put("/products/{item_id}", response_model=ProductOut)
async def update_product(
    item_id: int,
    body: ProductUpdate,
    db: AsyncSession = Depends(get_db),
) -> ProductOut:
    """Update a product."""
    obj = await _get_or_404(db, Product, item_id, "Product")
    _apply_updates(obj, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(obj)
    return ProductOut.model_validate(obj)


@router.delete(
    "/products/{item_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_product(
    item_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a product."""
    obj = await _get_or_404(db, Product, item_id, "Product")
    await db.delete(obj)
    await db.commit()


# ── Factories CRUD ─────────────────────────────────────────────


@router.get("/factories", response_model=list[FactoryOut])
async def list_factories(
    db: AsyncSession = Depends(get_db),
) -> list[FactoryOut]:
    """List all factories."""
    result = await db.execute(
        select(Factory).order_by(Factory.sort_order)
    )
    return [FactoryOut.model_validate(r) for r in result.scalars().all()]


@router.post(
    "/factories",
    response_model=FactoryOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_factory(
    body: FactoryCreate,
    db: AsyncSession = Depends(get_db),
) -> FactoryOut:
    """Create a factory."""
    obj = Factory(**body.model_dump())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return FactoryOut.model_validate(obj)


@router.put("/factories/{item_id}", response_model=FactoryOut)
async def update_factory(
    item_id: int,
    body: FactoryUpdate,
    db: AsyncSession = Depends(get_db),
) -> FactoryOut:
    """Update a factory."""
    obj = await _get_or_404(db, Factory, item_id, "Factory")
    _apply_updates(obj, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(obj)
    return FactoryOut.model_validate(obj)


@router.delete(
    "/factories/{item_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_factory(
    item_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a factory."""
    obj = await _get_or_404(db, Factory, item_id, "Factory")
    await db.delete(obj)
    await db.commit()


# ── Gallery CRUD ───────────────────────────────────────────────


@router.get("/gallery", response_model=list[GalleryImageOut])
async def list_gallery(
    db: AsyncSession = Depends(get_db),
) -> list[GalleryImageOut]:
    """List all gallery images."""
    result = await db.execute(
        select(GalleryImage).order_by(GalleryImage.sort_order)
    )
    return [GalleryImageOut.model_validate(r) for r in result.scalars().all()]


@router.post(
    "/gallery",
    response_model=GalleryImageOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_gallery_image(
    body: GalleryImageCreate,
    db: AsyncSession = Depends(get_db),
) -> GalleryImageOut:
    """Create a gallery image."""
    obj = GalleryImage(**body.model_dump())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return GalleryImageOut.model_validate(obj)

@router.put("/gallery/{item_id}", response_model=GalleryImageOut)
async def update_gallery_image(
    item_id: int,
    body: GalleryImageUpdate,
    db: AsyncSession = Depends(get_db),
) -> GalleryImageOut:
    """Update a gallery image."""
    obj = await _get_or_404(db, GalleryImage, item_id, "Gallery image")
    _apply_updates(obj, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(obj)
    return GalleryImageOut.model_validate(obj)


@router.delete(
    "/gallery/{item_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_gallery_image(
    item_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a gallery image."""
    obj = await _get_or_404(db, GalleryImage, item_id, "Gallery image")
    await db.delete(obj)
    await db.commit()


# ── News CRUD ──────────────────────────────────────────────────


@router.get("/news", response_model=list[NewsArticleOut])
async def list_news(
    db: AsyncSession = Depends(get_db),
) -> list[NewsArticleOut]:
    """List all news articles."""
    result = await db.execute(
        select(NewsArticle).order_by(NewsArticle.published_at.desc())
    )
    return [NewsArticleOut.model_validate(r) for r in result.scalars().all()]


@router.post(
    "/news",
    response_model=NewsArticleOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_news_article(
    body: NewsArticleCreate,
    db: AsyncSession = Depends(get_db),
) -> NewsArticleOut:
    """Create a news article."""
    obj = NewsArticle(**body.model_dump())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return NewsArticleOut.model_validate(obj)


@router.put("/news/{item_id}", response_model=NewsArticleOut)
async def update_news_article(
    item_id: int,
    body: NewsArticleUpdate,
    db: AsyncSession = Depends(get_db),
) -> NewsArticleOut:
    """Update a news article."""
    obj = await _get_or_404(db, NewsArticle, item_id, "News article")
    _apply_updates(obj, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(obj)
    return NewsArticleOut.model_validate(obj)


@router.delete(
    "/news/{item_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_news_article(
    item_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a news article."""
    obj = await _get_or_404(db, NewsArticle, item_id, "News article")
    await db.delete(obj)
    await db.commit()


# ── Contacts (Admin) ──────────────────────────────────────────


@router.get("/contacts", response_model=list[ContactOut])
async def list_contacts(
    db: AsyncSession = Depends(get_db),
) -> list[ContactOut]:
    """List all contact messages (newest first)."""
    result = await db.execute(
        select(Contact).order_by(Contact.created_at.desc())
    )
    return [ContactOut.model_validate(r) for r in result.scalars().all()]


@router.get("/contacts/unread-count")
async def unread_contacts_count(
    db: AsyncSession = Depends(get_db),
) -> dict[str, int]:
    """Return count of unread contact messages."""
    from sqlalchemy import func as sa_func

    result = await db.execute(
        select(sa_func.count()).select_from(Contact).where(Contact.is_read == False)  # noqa: E712
    )
    return {"count": result.scalar() or 0}


@router.put("/contacts/{item_id}", response_model=ContactOut)
async def update_contact(
    item_id: int,
    body: ContactUpdate,
    db: AsyncSession = Depends(get_db),
) -> ContactOut:
    """Update a contact message (e.g. mark as read)."""
    obj = await _get_or_404(db, Contact, item_id, "Contact")
    _apply_updates(obj, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(obj)
    return ContactOut.model_validate(obj)


@router.delete(
    "/contacts/{item_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_contact(
    item_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a contact message."""
    obj = await _get_or_404(db, Contact, item_id, "Contact")
    await db.delete(obj)
    await db.commit()


# ── File Upload ────────────────────────────────────────────────


@router.post("/upload")
async def upload_file(file: UploadFile) -> dict[str, str]:
    """Upload an image/video file and return its URL path."""
    import uuid
    from pathlib import Path

    from app.config import UPLOAD_PATH

    allowed = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".mp4", ".webm"}
    ext = Path(file.filename or "upload.jpg").suffix.lower()
    if ext not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"File type {ext} not allowed",
        )

    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = UPLOAD_PATH / filename
    content = await file.read()
    filepath.write_bytes(content)
    return {"url": f"/uploads/{filename}"}
