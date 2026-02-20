"""Product schemas."""

from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    """Schema for creating a product."""

    product_type: str = Field(pattern=r"^(fabric|garment)$")
    name: str = Field(max_length=200)
    image: str = ""
    composition: str = ""
    weight: str | None = None
    width: str | None = None
    colors: int = 0
    sizes: str | None = None
    min_order: str = ""
    sort_order: int = 0


class ProductUpdate(BaseModel):
    """Schema for updating a product (all fields optional)."""

    product_type: str | None = Field(default=None, pattern=r"^(fabric|garment)$")
    name: str | None = Field(default=None, max_length=200)
    image: str | None = None
    composition: str | None = None
    weight: str | None = None
    width: str | None = None
    colors: int | None = None
    sizes: str | None = None
    min_order: str | None = None
    sort_order: int | None = None


class ProductOut(BaseModel):
    """Schema for reading a product."""

    id: int
    product_type: str
    name: str
    image: str
    composition: str
    weight: str | None
    width: str | None
    colors: int
    sizes: str | None
    min_order: str
    sort_order: int

    model_config = {"from_attributes": True}
