"""News article schemas with multilingual content."""

from datetime import datetime

from pydantic import BaseModel, Field


class NewsArticleCreate(BaseModel):
    """Schema for creating a news article."""

    title_uz: str = Field(max_length=500)
    title_ru: str = Field(max_length=500)
    title_en: str = Field(max_length=500)
    excerpt_uz: str = ""
    excerpt_ru: str = ""
    excerpt_en: str = ""
    image: str = ""
    category: str = Field(
        pattern=r"^(industry|company|export|sustainability)$"
    )
    published_at: datetime | None = None


class NewsArticleUpdate(BaseModel):
    """Schema for updating a news article (all fields optional)."""

    title_uz: str | None = Field(default=None, max_length=500)
    title_ru: str | None = Field(default=None, max_length=500)
    title_en: str | None = Field(default=None, max_length=500)
    excerpt_uz: str | None = None
    excerpt_ru: str | None = None
    excerpt_en: str | None = None
    image: str | None = None
    category: str | None = Field(
        default=None,
        pattern=r"^(industry|company|export|sustainability)$",
    )
    published_at: datetime | None = None


class NewsArticleOut(BaseModel):
    """Schema for reading a news article."""

    id: int
    title_uz: str
    title_ru: str
    title_en: str
    excerpt_uz: str
    excerpt_ru: str
    excerpt_en: str
    image: str
    category: str
    published_at: datetime

    model_config = {"from_attributes": True}
