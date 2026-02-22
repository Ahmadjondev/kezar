"""Seed the database with initial data for all pages."""

import asyncio
import logging
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import Base, async_session, engine
from app.models.factory import Factory
from app.models.gallery import GalleryImage
from app.models.landing import Client, SiteSetting, Statistic
from app.models.news import NewsArticle
from app.models.product import Product

logger = logging.getLogger(__name__)


async def _seed_settings(db: AsyncSession) -> None:
    """Seed all site-wide settings (every editable text, image, video).

    Admin can change ANY of these values from the panel.
    """
    settings_data = [
        # ── Hero section ───────────────────────────────────────
        ("hero_video_id", "Q5vLHyS-EHY", "hero"),

        # ── Intro / KezarIntro section ─────────────────────────
        ("intro_title_uz", "KEZAR TEKS MChJ", "intro"),
        ("intro_title_ru", "KEZAR TEKS ООО", "intro"),
        ("intro_title_en", "KEZAR TEKS LLC", "intro"),
        (
            "intro_text_uz",
            "KEZAR TEKS MChJ — 1998 yildan faoliyat yurituvchi vertikаl integratsiyalangan "
            "to'qimachilik kompaniyasi. Biz trikotaj matosini to'qish, bo'yash, gul bosish va "
            "tayyor trikotaj mahsulotlari ishlab chiqarish bilan shug'ullanamiz. "
            "Andijоn viloyatida joylashgan bo'lib, 505 nafar xodim bilan faoliyat yuritamiz.",
            "intro",
        ),
        (
            "intro_text_ru",
            "KEZAR TEKS ООО — вертикально интегрированная текстильная компания, работающая с 1998 года. "
            "Мы занимаемся вязанием трикотажного полотна, крашением, печатью и производством "
            "готовой трикотажной продукции. Расположены в Андижанской области и работаем с командой из 505 человек.",
            "intro",
        ),
        (
            "intro_text_en",
            "KEZAR TEKS LLC is a vertically integrated textile company operating since 1998. "
            "We specialize in knitting, dyeing, printing, and manufacturing finished knitwear products. "
            "Located in the Andijan region with a team of 505 employees.",
            "intro",
        ),
        (
            "intro_image",
            "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80",
            "intro",
        ),

        # ── Social links ──────────────────────────────────────
        ("social_facebook", "https://facebook.com", "social"),
        ("social_telegram", "https://t.me", "social"),
        ("social_instagram", "https://instagram.com", "social"),

        # ── Video Showcase section ─────────────────────────────
        ("showcase_video_id", "Q5vLHyS-EHY", "showcase"),
        (
            "showcase_bg_image",
            "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1920&q=80",
            "showcase",
        ),
        ("showcase_title_uz", "Bizning ishlab chiqarish jarayonimiz", "showcase"),
        ("showcase_title_ru", "Наш производственный процесс", "showcase"),
        ("showcase_title_en", "Our Manufacturing Process", "showcase"),
        ("showcase_text_uz", "Zamonaviy texnologiyalar va an'anaviy mahorat uyg'unligi", "showcase"),
        ("showcase_text_ru", "Сочетание современных технологий и традиционного мастерства", "showcase"),
        ("showcase_text_en", "A blend of modern technology and traditional craftsmanship", "showcase"),

        # ── Footer / Contact ───────────────────────────────────
        ("contact_email", "kezar@list.ru", "footer"),
        ("contact_website", "www.kezar.uz", "footer"),
        ("contact_phone", "+998 74 223 00 00", "footer"),
        ("contact_address_uz", "Andijоn viloyati, Oltinkul tumani, Sadda KFY, Gulbahor ko'chasi, 35-uy", "footer"),
        ("contact_address_ru", "Андижанская область, Алтынкульский район, МКК Садда, ул. Гулбахор, д. 35", "footer"),
        ("contact_address_en", "Andijan region, Oltinkul district, Sadda MKK, Gulbahor street, 35", "footer"),

        # ── About page — official company passport data ────────
        ("about_company_name", "KEZAR TEKS MChJ", "about"),
        ("about_stir", "203032009", "about"),
        ("about_okonx", "17151", "about"),
        ("about_oked", "14390", "about"),
        ("about_mfo", "", "about"),
        ("about_inn", "203032009", "about"),
        ("about_bank", "", "about"),
        ("about_director", "Sotvoldiyev Karamatiillo Rakhmatillo o'g'li", "about"),
        ("about_accountant", "Abdusalomov Baxromjon Baxtiyar o'g'li", "about"),
        ("about_registration_number", "", "about"),
        ("about_founded_year", "1998", "about"),
        ("about_reregistered_year", "2006", "about"),
        ("about_charter_capital", "5 400 000 000 so'm", "about"),
        ("about_founders", "Xaydarov Xojiakbar, Xaydarov Muhammadxolid", "about"),
        ("about_land_area", "1,74 ga", "about"),
        ("about_employees_total", "505", "about"),
        ("about_employees_management", "12", "about"),
        ("about_employees_production", "493", "about"),
        (
            "about_raw_materials",
            "Ip kalava (gazlama), import xom ashyo, mahalliy xom ashyo",
            "about",
        ),
        ("about_capacity_fabric", "5 000 tonna/yil", "about"),
        ("about_capacity_garment", "5 000 000 dona/yil", "about"),
        (
            "about_activity_uz",
            "Trikotaj matosini to'qish, bo'yash, gul bosish va tayyor trikotaj mahsulotlari ishlab chiqarish",
            "about",
        ),
        (
            "about_activity_ru",
            "Вязание трикотажного полотна, крашение, нанесение рисунков и производство готовых трикотажных изделий",
            "about",
        ),
        (
            "about_activity_en",
            "Knitting fabric, dyeing, printing, and manufacturing of finished knitwear products",
            "about",
        ),
        ("about_address_uz", "Andijоn viloyati, Oltinkul tumani, Sadda KFY, Gulbahor ko'chasi, 35-uy", "about"),
        ("about_address_ru", "Андижанская область, Алтынкульский район, МКК Садда, ул. Гулбахор, д. 35", "about"),
        ("about_address_en", "Andijan region, Oltinkul district, Sadda MKK, Gulbahor street, 35", "about"),
        (
            "about_description_uz",
            "KEZAR TEKS MChJ — 1998 yildan faoliyat yuritib kelayotgan O'zbekistonning yetakchi "
            "trikotaj mahsulotlari ishlab chiqaruvchisi. Andijоn viloyatida 1,74 gektarlik maydonda "
            "joylashgan korxona yiliga 5 000 tonna mato va 5 million dona tayyor mahsulot ishlab chiqaradi.",
            "about",
        ),
        (
            "about_description_ru",
            "KEZAR TEKS ООО — ведущий производитель трикотажной продукции Узбекистана, работающий с 1998 года. "
            "Предприятие расположено на площади 1,74 га в Андижанской области и производит "
            "5 000 тонн ткани и 5 миллионов единиц готовой продукции в год.",
            "about",
        ),
        (
            "about_description_en",
            "KEZAR TEKS LLC is a leading knitwear manufacturer in Uzbekistan, operating since 1998. "
            "Located on 1.74 hectares in the Andijan region, the company produces "
            "5,000 tons of fabric and 5 million garments per year.",
            "about",
        ),
        ("about_export_countries", "Russia,Azerbaijan,Kyrgyzstan,Kazakhstan,Ukraine,Moldova", "about"),
    ]
    for key, value, group in settings_data:
        existing = await db.execute(
            select(SiteSetting).where(SiteSetting.key == key)
        )
        if existing.scalar_one_or_none() is None:
            db.add(SiteSetting(key=key, value=value, group=group))


async def _seed_statistics(db: AsyncSession) -> None:
    """Seed landing page statistics with multilingual labels."""
    result = await db.execute(select(Statistic))
    if result.scalars().first() is not None:
        return
    stats = [
        Statistic(
            label_uz="XODIMLAR", label_ru="СОТРУДНИКИ", label_en="EMPLOYEES",
            value=505, suffix="", icon_key="employees", sort_order=0,
        ),
        Statistic(
            label_uz="YILIGA TIKUV MAHSULOTLARI (DONA)",
            label_ru="ШВЕЙНЫХ ИЗДЕЛИЙ В ГОД (ШТ)",
            label_en="GARMENT PRODUCTION PIECES PER YEAR",
            value=5000000, suffix="", icon_key="garment", sort_order=1,
        ),
        Statistic(
            label_uz="YILIGA MATO ISHLAB CHIQARISH (TONNA)",
            label_ru="ПРОИЗВОДСТВО ТКАНИ В ГОД (ТОНН)",
            label_en="FABRIC PRODUCTION IN TONS PER YEAR",
            value=5000, suffix="", icon_key="fabric", sort_order=2,
        ),
    ]
    db.add_all(stats)


async def _seed_clients(db: AsyncSession) -> None:
    """Seed client brands."""
    result = await db.execute(select(Client))
    if result.scalars().first() is not None:
        return
    brands = [
        "JCPenney", "Tommy Hilfiger", "Walmart", "amazon", "Target",
        "PVH", "BOARDRIDERS", "Michael's", "adidas", "IZOD", "Bass",
        "VanHeusen", "WOLVERINE", "THE STING", "EXPRESS", "JACK & JONES",
        "ARROW", "PULL&BEAR", "s.Oliver", "macy's", "QUIKSILVER", "DC",
        "ROXY", "Lee Cooper", "Carrefour", "THE CHILDREN'S PLACE", "H&M",
        "Kappa", "MANGO", "BILLABONG", "Pepe Jeans", "PME LEGEND",
        "hunkemoller", "TEDDY SMITH", "GYMSHARK", "CHAMPS SPORTS",
        "Mercedes-Benz",
    ]
    db.add_all(
        Client(name=name, sort_order=i)
        for i, name in enumerate(brands)
    )


async def _seed_products(db: AsyncSession) -> None:
    """Seed fabric and garment products."""
    result = await db.execute(select(Product))
    if result.scalars().first() is not None:
        return
    fabrics = [
        Product(
            product_type="fabric", name="Single Jersey",
            image="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=800&q=80",
            composition="100% Cotton", weight="140-180 g/m2",
            width="180 cm (open)", colors=45, min_order="500 kg", sort_order=0,
        ),
        Product(
            product_type="fabric", name="Interlock",
            image="https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=800&q=80",
            composition="95% Cotton / 5% Elastane", weight="200-240 g/m2",
            width="185 cm (tubular)", colors=38, min_order="500 kg", sort_order=1,
        ),
        Product(
            product_type="fabric", name="Rib 1x1",
            image="https://images.unsplash.com/photo-1594761051656-11e8e7d0a855?auto=format&fit=crop&w=800&q=80",
            composition="100% Cotton", weight="180-220 g/m2",
            width="100 cm (tubular)", colors=30, min_order="300 kg", sort_order=2,
        ),
        Product(
            product_type="fabric", name="Fleece (3-Thread)",
            image="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
            composition="80% Cotton / 20% Polyester", weight="280-320 g/m2",
            width="190 cm (open)", colors=25, min_order="500 kg", sort_order=3,
        ),
        Product(
            product_type="fabric", name="Pique",
            image="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
            composition="100% Cotton", weight="180-220 g/m2",
            width="185 cm (open)", colors=35, min_order="400 kg", sort_order=4,
        ),
        Product(
            product_type="fabric", name="French Terry",
            image="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
            composition="90% Cotton / 10% Polyester", weight="240-280 g/m2",
            width="185 cm (tubular)", colors=28, min_order="500 kg", sort_order=5,
        ),
    ]
    garments = [
        Product(
            product_type="garment", name="T-Shirt (Basic)",
            image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
            composition="100% Cotton Single Jersey", sizes="XS - 3XL",
            colors=50, min_order="1,000 pcs", sort_order=10,
        ),
        Product(
            product_type="garment", name="Polo Shirt",
            image="https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80",
            composition="100% Cotton Pique", sizes="S - 2XL",
            colors=35, min_order="1,000 pcs", sort_order=11,
        ),
        Product(
            product_type="garment", name="Sweatshirt",
            image="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
            composition="80% Cotton / 20% Polyester Fleece", sizes="S - 3XL",
            colors=20, min_order="500 pcs", sort_order=12,
        ),
        Product(
            product_type="garment", name="Hoodie",
            image="https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&w=800&q=80",
            composition="80% Cotton / 20% Polyester Fleece", sizes="S - 3XL",
            colors=18, min_order="500 pcs", sort_order=13,
        ),
        Product(
            product_type="garment", name="Joggers",
            image="https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80",
            composition="90% Cotton / 10% Polyester French Terry", sizes="S - 2XL",
            colors=15, min_order="500 pcs", sort_order=14,
        ),
        Product(
            product_type="garment", name="Kids T-Shirt",
            image="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
            composition="100% Cotton Interlock", sizes="2Y - 14Y",
            colors=40, min_order="2,000 pcs", sort_order=15,
        ),
    ]
    db.add_all(fabrics + garments)


async def _seed_factories(db: AsyncSession) -> None:
    """Seed factory data with trilingual content."""
    result = await db.execute(select(Factory))
    if result.scalars().first() is not None:
        return
    factories = [
        Factory(
            title_uz="To'quv fabrikasi", title_ru="Трикотажная фабрика",
            title_en="Knitting Factory",
            desc_uz="Zamonaviy to'quv mashinalari bilan jihozlangan fabrika.",
            desc_ru="Фабрика, оснащенная современными вязальными машинами.",
            desc_en="Factory equipped with modern knitting machines.",
            image="/images/factories/knitting.jpg",
            capacity="5,000 tons/year", area="6,000 m2",
            equipment="120+ machines", workers=150, sort_order=0,
        ),
        Factory(
            title_uz="Bo'yash fabrikasi", title_ru="Красильная фабрика",
            title_en="Dyeing Factory",
            desc_uz="Ekologik toza bo'yash texnologiyalari.",
            desc_ru="Экологически чистые технологии крашения.",
            desc_en="Eco-friendly dyeing technologies.",
            image="/images/factories/dyeing.jpg",
            capacity="4,500 tons/year", area="4,500 m2",
            equipment="80+ machines", workers=120, sort_order=1,
        ),
        Factory(
            title_uz="Bosma fabrikasi", title_ru="Печатная фабрика",
            title_en="Printing Factory",
            desc_uz="Raqamli va an'anaviy bosma usullari.",
            desc_ru="Цифровые и традиционные методы печати.",
            desc_en="Digital and traditional printing methods.",
            image="/images/factories/printing.jpg",
            capacity="3,000 tons/year", area="3,500 m2",
            equipment="50+ machines", workers=80, sort_order=2,
        ),
        Factory(
            title_uz="Tikuv fabrikasi", title_ru="Швейная фабрика",
            title_en="Garment Factory",
            desc_uz="To'liq avtomatlashtirilgan tikuv liniyalari.",
            desc_ru="Полностью автоматизированные швейные линии.",
            desc_en="Fully automated sewing lines.",
            image="/images/factories/garment.jpg",
            capacity="5,000,000 pcs/year", area="3,400 m2",
            equipment="200+ machines", workers=250, sort_order=3,
        ),
    ]
    db.add_all(factories)


async def _seed_gallery(db: AsyncSession) -> None:
    """Seed gallery images."""
    result = await db.execute(select(GalleryImage))
    if result.scalars().first() is not None:
        return
    items = [
        ("https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&q=80", "Factory floor overview", "factory", "col-span-2 row-span-2"),
        ("https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=800&q=80", "Cotton fabric rolls", "fabric", ""),
        ("https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=800&q=80", "Interlock knit close-up", "fabric", ""),
        ("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80", "White t-shirt production", "garments", ""),
        ("https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80", "Sweatshirt lineup", "garments", "col-span-2"),
        ("https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80", "Polo shirt manufacturing", "garments", ""),
        ("https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=800&q=80", "Dyeing process tank", "dyeing", ""),
        ("https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80", "Color palette samples", "dyeing", "col-span-2 row-span-2"),
        ("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80", "Quality control team", "team", ""),
        ("https://images.unsplash.com/photo-1594761051656-11e8e7d0a855?auto=format&fit=crop&w=800&q=80", "Rib fabric detail", "fabric", ""),
        ("https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80", "Finished garment detail", "garments", ""),
        ("https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&w=800&q=80", "Factory team photo", "team", "col-span-2"),
        ("https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80", "Textile machinery", "factory", ""),
        ("https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80", "Jogger pants", "garments", ""),
        ("https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80", "Kids collection", "garments", ""),
        ("https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80", "Pique fabric close-up", "fabric", ""),
    ]
    db.add_all(
        GalleryImage(src=src, alt=alt, category=cat, span=span, sort_order=i)
        for i, (src, alt, cat, span) in enumerate(items)
    )


async def _seed_news(db: AsyncSession) -> None:
    """Seed news articles with trilingual content."""
    result = await db.execute(select(NewsArticle))
    if result.scalars().first() is not None:
        return
    articles = [
        NewsArticle(
            title_en="Kezar Teks Expands Production Capacity by 40%",
            title_ru="Kezar Teks увеличивает производственные мощности на 40%",
            title_uz="Kezar Teks ishlab chiqarish quvvatini 40% ga oshirdi",
            excerpt_en="With the installation of new knitting and dyeing machinery, our factory now processes over 500 tons of fabric per month.",
            excerpt_ru="С установкой нового вязального и красильного оборудования наша фабрика теперь перерабатывает более 500 тонн ткани в месяц.",
            excerpt_uz="Yangi to'qish va bo'yash mashinalarining o'rnatilishi bilan fabrikamiz oyiga 500 tonnadan ortiq matoni qayta ishlaydi.",
            image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
            category="company",
            published_at=datetime(2025, 1, 15),
        ),
        NewsArticle(
            title_en="Global Textile Forum 2025: Sustainability Takes Center Stage",
            title_ru="Глобальный текстильный форум 2025: устойчивое развитие в центре внимания",
            title_uz="Global Textile Forum 2025: Barqaror rivojlanish diqqat markazida",
            excerpt_en="Industry leaders gathered in Istanbul to discuss the future of sustainable textile manufacturing.",
            excerpt_ru="Лидеры отрасли собрались в Стамбуле для обсуждения будущего устойчивого текстильного производства.",
            excerpt_uz="Sanoat yetakchilari Istanbulda barqaror to'qimachilik ishlab chiqarishning kelajagini muhokama qilish uchun yig'ildi.",
            image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
            category="sustainability",
            published_at=datetime(2025, 1, 8),
        ),
        NewsArticle(
            title_en="New Partnership with European Fashion Brands",
            title_ru="Новое партнёрство с европейскими модными брендами",
            title_uz="Yevropa moda brendlari bilan yangi hamkorlik",
            excerpt_en="Kezar Teks has secured long-term supply agreements with three major European fashion houses.",
            excerpt_ru="Kezar Teks заключил долгосрочные договоры на поставку с тремя крупными европейскими модными домами.",
            excerpt_uz="Kezar Teks uchta yirik Yevropa moda uylari bilan uzoq muddatli yetkazib berish shartnomalarini tuzdi.",
            image="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80",
            category="export",
            published_at=datetime(2024, 12, 20),
        ),
        NewsArticle(
            title_en="Uzbekistan Textile Exports Reach Record $3.5 Billion",
            title_ru="Экспорт текстиля Узбекистана достиг рекордных $3,5 млрд",
            title_uz="O'zbekiston to'qimachilik eksporti rekord 3,5 mlrd dollarga yetdi",
            excerpt_en="The Uzbek textile industry has achieved record export figures in 2024.",
            excerpt_ru="Текстильная промышленность Узбекистана достигла рекордных показателей экспорта в 2024 году.",
            excerpt_uz="O'zbekiston to'qimachilik sanoati 2024 yilda rekord eksport ko'rsatkichlariga erishdi.",
            image="https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&w=800&q=80",
            category="industry",
            published_at=datetime(2024, 12, 10),
        ),
        NewsArticle(
            title_en="Kezar Teks Achieves OEKO-TEX Standard 100 Certification",
            title_ru="Kezar Teks получил сертификат OEKO-TEX Standard 100",
            title_uz="Kezar Teks OEKO-TEX Standard 100 sertifikatiga erishdi",
            excerpt_en="Our commitment to safety and quality has been recognized with the prestigious OEKO-TEX Standard 100 certification.",
            excerpt_ru="Наша приверженность безопасности и качеству была отмечена престижным сертификатом OEKO-TEX Standard 100.",
            excerpt_uz="Xavfsizlik va sifatga bo'lgan sodiqligimiz nufuzli OEKO-TEX Standard 100 sertifikati bilan tan olindi.",
            image="https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80",
            category="company",
            published_at=datetime(2024, 11, 28),
        ),
        NewsArticle(
            title_en="Smart Textiles: The Future of Fabric Manufacturing",
            title_ru="Умный текстиль: будущее производства тканей",
            title_uz="Aqlli to'qimachilik: mato ishlab chiqarishning kelajagi",
            excerpt_en="Exploring how IoT and automation are transforming traditional textile factories into smart manufacturing hubs.",
            excerpt_ru="Как IoT и автоматизация превращают традиционные текстильные фабрики в умные производственные центры.",
            excerpt_uz="IoT va avtomatlashtirish an'anaviy to'qimachilik fabrikalarini qanday qilib aqlli ishlab chiqarish markazlariga aylantirmoqda.",
            image="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
            category="industry",
            published_at=datetime(2024, 11, 15),
        ),
    ]
    db.add_all(articles)


async def seed_database() -> None:
    """Run all seed functions to populate the database.

    Creates tables if they don't exist and populates with initial data.
    Skips seeding for tables that already contain data.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        await _seed_settings(db)
        await _seed_statistics(db)
        await _seed_clients(db)
        await _seed_products(db)
        await _seed_factories(db)
        await _seed_gallery(db)
        await _seed_news(db)
        await db.commit()
        logger.info("Database seeded successfully")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(seed_database())
