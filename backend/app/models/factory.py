"""Factory model with multilingual support."""

from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Factory(Base):
    """Factory facility with multilingual title/description and stats.

    Attributes:
        title_uz, title_ru, title_en: Localized factory name
        desc_uz, desc_ru, desc_en: Localized description
        image: Factory image URL or uploaded path
        capacity: Production capacity string
        area: Floor area string
        equipment: Equipment count string
        workers: Number of workers
        sort_order: Display ordering
    """

    __tablename__ = "factories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title_uz: Mapped[str] = mapped_column(String(200), nullable=False)
    title_ru: Mapped[str] = mapped_column(String(200), nullable=False)
    title_en: Mapped[str] = mapped_column(String(200), nullable=False)
    desc_uz: Mapped[str] = mapped_column(Text, nullable=False, default="")
    desc_ru: Mapped[str] = mapped_column(Text, nullable=False, default="")
    desc_en: Mapped[str] = mapped_column(Text, nullable=False, default="")
    image: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    capacity: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    area: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    equipment: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    workers: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
