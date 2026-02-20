"""Landing page models: settings, statistics, clients."""

from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SiteSetting(Base):
    """Key-value store for all editable site content.

    Stores hero video ID, intro text/image, social links,
    video showcase settings, footer info, about page data,
    and any other text/image/video the admin wants to change.

    Groups: hero, intro, social, showcase, footer, about, general
    """

    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    value: Mapped[str] = mapped_column(Text, nullable=False, default="")
    group: Mapped[str] = mapped_column(String(50), nullable=False, default="general")


class Statistic(Base):
    """Landing page statistic counters (employees, production, etc.)."""

    __tablename__ = "statistics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    label_uz: Mapped[str] = mapped_column(String(200), nullable=False)
    label_ru: Mapped[str] = mapped_column(String(200), nullable=False)
    label_en: Mapped[str] = mapped_column(String(200), nullable=False)
    value: Mapped[int] = mapped_column(Integer, nullable=False)
    suffix: Mapped[str] = mapped_column(String(20), nullable=False, default="")
    icon_key: Mapped[str] = mapped_column(String(50), nullable=False, default="default")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class Client(Base):
    """Client brand names displayed on landing page."""

    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    logo_url: Mapped[str] = mapped_column(String(500), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
