"""Pydantic schemas package."""

from app.schemas.contact import ContactCreate, ContactOut, ContactUpdate
from app.schemas.factory import FactoryCreate, FactoryOut, FactoryUpdate
from app.schemas.gallery import GalleryImageCreate, GalleryImageOut, GalleryImageUpdate
from app.schemas.landing import (
    AboutPageOut,
    ClientCreate,
    ClientOut,
    ClientUpdate,
    LandingPageOut,
    SiteSettingBulkUpdate,
    SiteSettingOut,
    SiteSettingUpdate,
    StatisticCreate,
    StatisticOut,
    StatisticUpdate,
)
from app.schemas.news import NewsArticleCreate, NewsArticleOut, NewsArticleUpdate
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate

__all__ = [
    "AboutPageOut",
    "ClientCreate",
    "ClientOut",
    "ClientUpdate",
    "ContactCreate",
    "ContactOut",
    "ContactUpdate",
    "FactoryCreate",
    "FactoryOut",
    "FactoryUpdate",
    "GalleryImageCreate",
    "GalleryImageOut",
    "GalleryImageUpdate",
    "LandingPageOut",
    "NewsArticleCreate",
    "NewsArticleOut",
    "NewsArticleUpdate",
    "ProductCreate",
    "ProductOut",
    "ProductUpdate",
    "SiteSettingBulkUpdate",
    "SiteSettingOut",
    "SiteSettingUpdate",
    "StatisticCreate",
    "StatisticOut",
    "StatisticUpdate",
]
