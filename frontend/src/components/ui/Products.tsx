"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Product, SiteSetting } from "@/lib/api";

type Tab = "fabrics" | "garments";

/* ─── Product Card ──────────────────────────────────────────── */
function ProductCard({
    product,
    tab,
    index,
    visible,
    t,
}: {
    product: Product;
    tab: Tab;
    index: number;
    visible: boolean;
    t: ReturnType<typeof useLanguage>["t"];
}) {
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => setActive(true), index * 100);
        return () => clearTimeout(timer);
    }, [visible, index]);

    const isFabric = tab === "fabrics";

    return (
        <div
            className={`group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-600 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
        >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${product.image}')` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg drop-shadow-md">
                        {product.name}
                    </h3>
                </div>
            </div>

            {/* Details */}
            <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-wider shrink-0">
                        {t.products.composition}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 text-xs ml-auto text-right">
                        {product.composition}
                    </span>
                </div>

                {isFabric && product.weight && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-wider shrink-0">
                            {t.products.weight}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 text-xs ml-auto">
                            {product.weight}
                        </span>
                    </div>
                )}

                {isFabric && product.width && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-wider shrink-0">
                            {t.products.width}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 text-xs ml-auto">
                            {product.width}
                        </span>
                    </div>
                )}

                {!isFabric && product.sizes && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-wider shrink-0">
                            {t.products.sizes}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 text-xs ml-auto">
                            {product.sizes}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1.5">
                            {Array.from({ length: Math.min(5, product.colors) }).map(
                                (_, i) => (
                                    <div
                                        key={i}
                                        className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"
                                        style={{
                                            backgroundColor: [
                                                "#1a1a2e",
                                                "#e74c3c",
                                                "#2ecc71",
                                                "#3498db",
                                                "#f39c12",
                                            ][i],
                                        }}
                                    />
                                ),
                            )}
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                            +{product.colors} {t.products.colors.toLowerCase()}
                        </span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        {t.products.minOrder}: {product.min_order}
                    </span>
                </div>
            </div>
        </div>
    );
}

/* ─── Products Section ──────────────────────────────────────── */
export default function Products({ products, settings }: { products: Product[]; settings?: SiteSetting }) {
    const { t, locale } = useLanguage();
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("fabrics");
    const [heroVisible, setHeroVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setHeroVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 },
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const filtered = activeTab === "fabrics"
        ? products.filter(p => p.product_type === "fabric")
        : products.filter(p => p.product_type === "garment");

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
            {/* ── Hero Section ──────────────────────────────────────── */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute inset-0 bg-[#1a1e20]">
                    <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23004881' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
                </div>

                <div
                    className={`relative max-w-6xl mx-auto px-6 md:px-12 transition-all duration-1000 ${heroVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                        }`}
                >
                    <p className="text-primary/80 text-sm font-medium tracking-[0.2em] uppercase mb-4">
                        Kezar Teks
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-white tracking-tight leading-tight mb-6">
                        {settings?.[`products_hero_title_${locale}`] || t.products.heading}
                    </h1>
                    <p className="text-white/50 text-lg md:text-xl max-w-2xl font-light">
                        {settings?.[`products_hero_subtitle_${locale}`] || t.products.subtitle}
                    </p>
                </div>
            </section>

            {/* ── Products Grid ─────────────────────────────────────── */}
            <section
                ref={sectionRef}
                className="w-full py-20 md:py-28 bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {/* Tabs */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex bg-white dark:bg-gray-800 rounded-2xl p-1.5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            {(["fabrics", "garments"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === tab
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                        }`}
                                >
                                    {tab === "fabrics"
                                        ? t.products.fabricsTab
                                        : t.products.garmentsTab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filtered.map((product, i) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                tab={activeTab}
                                index={i}
                                visible={visible}
                                t={t}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
