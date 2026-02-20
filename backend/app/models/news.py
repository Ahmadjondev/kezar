"""News article model with multilingual content."""

from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class NewsArticle(Base):
    """News article with trilingual title and excerpt.

    Attributes:
        title_uz, title_ru, title_en: Localized titles
        excerpt_uz, excerpt_ru, excerpt_en: Localized excerpts
        image: Cover image URL or uploaded path
        category: One of 'industry', 'company', 'export', 'sustainability'
        published_at: Publication date
    """

    __tablename__ = "news_articles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title_uz: Mapped[str] = mapped_column(String(500), nullable=False)
    title_ru: Mapped[str] = mapped_column(String(500), nullable=False)
    title_en: Mapped[str] = mapped_column(String(500), nullable=False)
    excerpt_uz: Mapped[str] = mapped_column(Text, nullable=False, default="")
    excerpt_ru: Mapped[str] = mapped_column(Text, nullable=False, default="")
    excerpt_en: Mapped[str] = mapped_column(Text, nullable=False, default="")
    image: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    category: Mapped[str] = mapped_column(
        String(50), nullable=False, index=True
    )  # industry|company|export|sustainability
    published_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )
