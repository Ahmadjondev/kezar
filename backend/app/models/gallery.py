"""Gallery image model."""

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class GalleryImage(Base):
    """Gallery image with category for filtering.

    Attributes:
        src: Image URL or uploaded path
        alt: Alt text for accessibility
        category: One of 'factory', 'fabric', 'garments', 'dyeing', 'team'
        span: CSS grid span class (e.g. 'col-span-2 row-span-2')
        sort_order: Display ordering
    """

    __tablename__ = "gallery_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    src: Mapped[str] = mapped_column(String(500), nullable=False)
    alt: Mapped[str] = mapped_column(String(300), nullable=False, default="")
    category: Mapped[str] = mapped_column(
        String(50), nullable=False, index=True
    )  # factory|fabric|garments|dyeing|team
    span: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
