"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { GalleryImage, SiteSetting } from "@/lib/api";

type Category = string;

/* ─── Gallery Component ─────────────────────────────────────── */
export default function Gallery({ images, settings }: { images: GalleryImage[]; settings?: SiteSetting }) {
    const { t, locale } = useLanguage();
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [heroVisible, setHeroVisible] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [lightbox, setLightbox] = useState<string | null>(null);

    // Derive categories from data
    const categories = ["all", ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))];

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
            { threshold: 0.05 },
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Close lightbox on Escape
    useEffect(() => {
        if (!lightbox) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightbox(null);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [lightbox]);

    const categoryLabel = (cat: string): string => {
        const map: Record<string, string> = {
            all: t.gallery.all,
            factory: t.gallery.factory,
            fabric: t.gallery.fabric,
            garments: t.gallery.garments,
            dyeing: t.gallery.dyeing,
            team: t.gallery.team,
        };
        return map[cat] || cat;
    };

    const filtered =
        activeCategory === "all"
            ? images
            : images.filter((item) => item.category === activeCategory);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
            {/* ── Hero ──────────────────────────────────────────────── */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute inset-0 bg-[#1a1e20]">
                    <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a8c3f' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
                </div>
                <div
                    className={`relative max-w-6xl mx-auto px-6 md:px-12 transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    <p className="text-primary/80 text-sm font-medium tracking-[0.2em] uppercase mb-4">
                        Kezar Teks
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-white tracking-tight leading-tight mb-6">
                        {settings?.[`gallery_hero_title_${locale}`] || t.gallery.heroTitle}
                    </h1>
                    <p className="text-white/50 text-lg md:text-xl max-w-2xl font-light">
                        {settings?.[`gallery_hero_subtitle_${locale}`] || t.gallery.heroSubtitle}
                    </p>
                </div>
            </section>

            {/* ── Filter + Grid ─────────────────────────────────────── */}
            <section
                ref={sectionRef}
                className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {/* Category filters */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700"
                                    }`}
                            >
                                {categoryLabel(cat)}
                            </button>
                        ))}
                    </div>

                    {/* Masonry-style grid */}
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                        {filtered.map((item, i) => (
                            <div
                                key={item.id}
                                className={`break-inside-avoid overflow-hidden rounded-2xl cursor-pointer group transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                    }`}
                                style={{ transitionDelay: `${Math.min(i * 80, 600)}ms` }}
                                onClick={() => setLightbox(item.src)}
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                        <svg
                                            className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.5}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Lightbox ──────────────────────────────────────────── */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                        onClick={() => setLightbox(null)}
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={lightbox}
                        alt="Gallery preview"
                        className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
