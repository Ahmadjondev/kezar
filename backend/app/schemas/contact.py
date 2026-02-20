"""Contact message schemas."""

from datetime import datetime

from pydantic import BaseModel, Field


class ContactCreate(BaseModel):
    """Schema for submitting a contact message (public)."""

    name: str = Field(max_length=200)
    email: str = Field(max_length=300)
    phone: str = Field(default="", max_length=50)
    subject: str = Field(max_length=500)
    message: str = Field(min_length=1)


class ContactOut(BaseModel):
    """Schema for reading a contact message (admin)."""

    id: int
    name: str
    email: str
    phone: str
    subject: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ContactUpdate(BaseModel):
    """Schema for updating a contact message (mark read, etc.)."""

    is_read: bool | None = None
