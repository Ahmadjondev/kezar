"""Factory schemas with multilingual fields."""

from pydantic import BaseModel, Field


class FactoryCreate(BaseModel):
    """Schema for creating a factory."""

    title_uz: str = Field(max_length=200)
    title_ru: str = Field(max_length=200)
    title_en: str = Field(max_length=200)
    desc_uz: str = ""
    desc_ru: str = ""
    desc_en: str = ""
    image: str = ""
    capacity: str = ""
    area: str = ""
    equipment: str = ""
    workers: int = 0
    sort_order: int = 0


class FactoryUpdate(BaseModel):
    """Schema for updating a factory (all fields optional)."""

    title_uz: str | None = Field(default=None, max_length=200)
    title_ru: str | None = Field(default=None, max_length=200)
    title_en: str | None = Field(default=None, max_length=200)
    desc_uz: str | None = None
    desc_ru: str | None = None
    desc_en: str | None = None
    image: str | None = None
    capacity: str | None = None
    area: str | None = None
    equipment: str | None = None
    workers: int | None = None
    sort_order: int | None = None


class FactoryOut(BaseModel):
    """Schema for reading a factory."""

    id: int
    title_uz: str
    title_ru: str
    title_en: str
    desc_uz: str
    desc_ru: str
    desc_en: str
    image: str
    capacity: str
    area: str
    equipment: str
    workers: int
    sort_order: int

    model_config = {"from_attributes": True}
