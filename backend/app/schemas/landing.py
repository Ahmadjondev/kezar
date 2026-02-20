"""Landing page schemas: settings, statistics, clients."""

from pydantic import BaseModel, Field

from app.schemas.factory import FactoryOut
from app.schemas.gallery import GalleryImageOut
from app.schemas.news import NewsArticleOut
from app.schemas.product import ProductOut


# ── Site Settings ──────────────────────────────────────────────


class SiteSettingOut(BaseModel):
    """Schema for reading a site setting."""

    id: int
    key: str
    value: str
    group: str

    model_config = {"from_attributes": True}


class SiteSettingUpdate(BaseModel):
    """Schema for updating a site setting value."""

    value: str


class SiteSettingBulkItem(BaseModel):
    """Single item in a bulk settings update."""

    key: str
    value: str
    group: str = "general"


class SiteSettingBulkUpdate(BaseModel):
    """Schema for bulk-updating multiple site settings at once."""

    settings: list[SiteSettingBulkItem]


# ── Statistics ─────────────────────────────────────────────────


class StatisticCreate(BaseModel):
    """Schema for creating a statistic."""

    label_uz: str = Field(max_length=200)
    label_ru: str = Field(max_length=200)
    label_en: str = Field(max_length=200)
    value: int
    suffix: str = Field(default="", max_length=20)
    icon_key: str = Field(default="default", max_length=50)
    sort_order: int = 0


class StatisticUpdate(BaseModel):
    """Schema for updating a statistic (all fields optional)."""

    label_uz: str | None = Field(default=None, max_length=200)
    label_ru: str | None = Field(default=None, max_length=200)
    label_en: str | None = Field(default=None, max_length=200)
    value: int | None = None
    suffix: str | None = Field(default=None, max_length=20)
    icon_key: str | None = Field(default=None, max_length=50)
    sort_order: int | None = None


class StatisticOut(BaseModel):
    """Schema for reading a statistic."""

    id: int
    label_uz: str
    label_ru: str
    label_en: str
    value: int
    suffix: str
    icon_key: str
    sort_order: int

    model_config = {"from_attributes": True}


# ── Clients ────────────────────────────────────────────────────


class ClientCreate(BaseModel):
    """Schema for creating a client."""

    name: str = Field(max_length=100)
    logo_url: str | None = Field(default=None, max_length=500)
    sort_order: int = 0


class ClientUpdate(BaseModel):
    """Schema for updating a client (all fields optional)."""

    name: str | None = Field(default=None, max_length=100)
    logo_url: str | None = Field(default=None, max_length=500)
    sort_order: int | None = None


class ClientOut(BaseModel):
    """Schema for reading a client."""

    id: int
    name: str
    logo_url: str | None
    sort_order: int

    model_config = {"from_attributes": True}


# ── Aggregated Page Responses ──────────────────────────────────


class LandingPageOut(BaseModel):
    """All data needed for the landing page in a single response."""

    settings: dict[str, str]
    statistics: list[StatisticOut]
    clients: list[ClientOut]


class AboutPageOut(BaseModel):
    """All data needed for the about page."""

    settings: dict[str, str]


# ── Page-level responses with settings ─────────────────────────


class ProductsPageOut(BaseModel):
    """Products page data with editable settings."""

    settings: dict[str, str]
    products: list[ProductOut]


class FactoriesPageOut(BaseModel):
    """Factories page data with editable settings."""

    settings: dict[str, str]
    factories: list[FactoryOut]


class GalleryPageOut(BaseModel):
    """Gallery page data with editable settings."""

    settings: dict[str, str]
    images: list[GalleryImageOut]


class NewsPageOut(BaseModel):
    """News page data with editable settings."""

    settings: dict[str, str]
    articles: list[NewsArticleOut]
