"""Contact message model."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base


class Contact(Base):
    """Contact form submission from website visitors.

    Attributes:
        name: Sender's full name
        email: Sender's email address
        phone: Sender's phone number (optional)
        subject: Message subject
        message: Message body
        is_read: Whether admin has read this message
        created_at: Submission timestamp
    """

    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(300), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False, default="")
    subject: Mapped[str] = mapped_column(String(500), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )
