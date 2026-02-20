"""Product model for fabrics and garments."""

from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Product(Base):
    """Product item — either a fabric or a garment.

    Attributes:
        product_type: 'fabric' or 'garment'
        name: Product name
        image: Image URL or uploaded path
        composition: Material composition
        weight: Fabric weight (fabrics only)
        width: Fabric width (fabrics only)
        colors: Number of available colors
        sizes: Size range (garments only)
        min_order: Minimum order quantity
        sort_order: Display ordering
    """

    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    product_type: Mapped[str] = mapped_column(
        String(20), nullable=False, index=True
    )  # 'fabric' | 'garment'
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    image: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    composition: Mapped[str] = mapped_column(String(300), nullable=False, default="")
    weight: Mapped[str] = mapped_column(String(100), nullable=True)
    width: Mapped[str] = mapped_column(String(100), nullable=True)
    colors: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    sizes: Mapped[str] = mapped_column(String(100), nullable=True)
    min_order: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
