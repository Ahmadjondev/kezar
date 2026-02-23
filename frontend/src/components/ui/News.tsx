"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import type { NewsArticle, SiteSetting } from "@/lib/api";

/* ─── News Component ────────────────────────────────────────── */
export default function News({ articles, settings }: { articles: NewsArticle[]; settings?: SiteSetting }) {
    const { t, locale: language } = useLanguage();
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [heroVisible, setHeroVisible] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>("all");

    // Derive categories dynamically from data
    const cats: string[] = ["all", ...Array.from(new Set(articles.map((a) => a.category)))];

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

    const categoryLabel = (cat: string): string => {
        const map: Record<string, string> = {
            all: t.news.allNews,
            industry: t.news.industry,
            company: t.news.company,
            export: t.news.export,
            sustainability: t.news.sustainability,
        };
        return map[cat] || cat;
    };

    const title = (a: NewsArticle) =>
        language === "ru" ? a.title_ru : language === "uz" ? a.title_uz : a.title_en;

    const excerpt = (a: NewsArticle) =>
        language === "ru" ? a.excerpt_ru : language === "uz" ? a.excerpt_uz : a.excerpt_en;

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString(language === "ru" ? "ru-RU" : language === "uz" ? "uz-UZ" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const filtered =
        activeCategory === "all"
            ? articles
            : articles.filter((a) => a.category === activeCategory);

    const featured = filtered[0];
    const rest = filtered.slice(1);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
            {/* ── Hero ──────────────────────────────────────────────── */}
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
                    className={`relative max-w-6xl mx-auto px-6 md:px-12 transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    <p className="text-primary/80 text-sm font-medium tracking-[0.2em] uppercase mb-4">
                        Kezar Teks
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-white tracking-tight leading-tight mb-6">
                        {settings?.[`news_hero_title_${language}`] || t.news.heroTitle}
                    </h1>
                    <p className="text-white/50 text-lg md:text-xl max-w-2xl font-light">
                        {settings?.[`news_hero_subtitle_${language}`] || t.news.heroSubtitle}
                    </p>
                </div>
            </section>

            {/* ── Content ───────────────────────────────────────────── */}
            <section
                ref={sectionRef}
                className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {/* Category filters */}
                    <div className="flex flex-wrap justify-center gap-2 mb-14">
                        {cats.map((cat) => (
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

                    {/* Featured article */}
                    {featured && (
                        <div
                            className={`mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                        >
                            <div className="grid lg:grid-cols-2 gap-8 bg-white dark:bg-gray-800/50 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-300">
                                <div className="relative h-64 lg:h-auto overflow-hidden">
                                    <img
                                        src={featured.image}
                                        alt={title(featured)}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 rounded-lg bg-primary/90 text-white text-xs font-semibold uppercase tracking-wide">
                                            {t.news.latestNews}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 lg:p-10 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                                            {categoryLabel(featured.category)}
                                        </span>
                                        <span>{formatDate(featured.published_at)}</span>
                                    </div>
                                    <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white mb-4 leading-tight">
                                        {title(featured)}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                        {excerpt(featured)}
                                    </p>
                                    <Link href={`/news/${featured.id}`} className="self-start px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300">
                                        {t.news.readMore} →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Articles grid */}
                    {rest.length > 0 && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {rest.map((article, i) => (
                                <article
                                    key={article.id}
                                    className={`group bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                        }`}
                                    style={{ transitionDelay: `${(i + 1) * 120}ms` }}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={article.image}
                                            alt={title(article)}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2.5 py-0.5 rounded-md bg-white/90 dark:bg-gray-900/90 text-primary text-xs font-medium">
                                                {categoryLabel(article.category)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                                            {formatDate(article.published_at)}
                                        </p>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                            {title(article)}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 mb-4">
                                            {excerpt(article)}
                                        </p>
                                        <Link href={`/news/${article.id}`} className="text-sm text-primary font-medium hover:underline transition-all">
                                            {t.news.readMore} →
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
