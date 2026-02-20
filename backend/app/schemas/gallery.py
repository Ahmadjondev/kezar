"""Gallery image schemas."""

from pydantic import BaseModel, Field


class GalleryImageCreate(BaseModel):
    """Schema for creating a gallery image."""

    src: str = Field(max_length=500)
    alt: str = Field(default="", max_length=300)
    category: str = Field(
        pattern=r"^(factory|fabric|garments|dyeing|team)$"
    )
    span: str = ""
    sort_order: int = 0


class GalleryImageUpdate(BaseModel):
    """Schema for updating a gallery image (all fields optional)."""

    src: str | None = Field(default=None, max_length=500)
    alt: str | None = Field(default=None, max_length=300)
    category: str | None = Field(
        default=None,
        pattern=r"^(factory|fabric|garments|dyeing|team)$",
    )
    span: str | None = None
    sort_order: int | None = None


class GalleryImageOut(BaseModel):
    """Schema for reading a gallery image."""

    id: int
    src: str
    alt: str
    category: str
    span: str
    sort_order: int

    model_config = {"from_attributes": True}
