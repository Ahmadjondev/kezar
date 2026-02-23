"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import type { NewsArticle } from "@/lib/api";

interface Props {
    article: NewsArticle;
    related: NewsArticle[];
}

export default function NewsDetailContent({ article, related }: Props) {
    const { t, locale } = useLanguage();

    const title = (a: NewsArticle) =>
        locale === "ru" ? a.title_ru : locale === "uz" ? a.title_uz : a.title_en;

    const excerpt = (a: NewsArticle) =>
        locale === "ru" ? a.excerpt_ru : locale === "uz" ? a.excerpt_uz : a.excerpt_en;

    const categoryLabel = (cat: string): string => {
        const map: Record<string, string> = {
            industry: t.news.industry,
            company: t.news.company,
            export: t.news.export,
            sustainability: t.news.sustainability,
        };
        return map[cat] || cat;
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString(
            locale === "ru" ? "ru-RU" : locale === "uz" ? "uz-UZ" : "en-US",
            { year: "numeric", month: "long", day: "numeric" },
        );
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: title(article),
                text: excerpt(article),
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
            {/* Hero */}
            <section className="relative pt-28 pb-0 md:pt-36 overflow-hidden">
                <div className="absolute inset-0 bg-[#1a1e20]">
                    <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23004881' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
                </div>

                <div className="relative max-w-4xl mx-auto px-6 md:px-12 pb-12 md:pb-16">
                    {/* Back link */}
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        {t.news.backToNews}
                    </Link>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span className="px-3 py-1 rounded-lg bg-primary/90 text-white text-xs font-semibold uppercase tracking-wide">
                            {categoryLabel(article.category)}
                        </span>
                        <span className="text-white/50 text-sm">
                            {t.news.publishedOn}: {formatDate(article.published_at)}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extralight text-white tracking-tight leading-tight">
                        {title(article)}
                    </h1>
                </div>
            </section>

            {/* Cover image */}
            {article.image && (
                <div className="max-w-5xl mx-auto px-6 md:px-12 -mt-2">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
                        <img
                            src={article.image}
                            alt={title(article)}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Article body */}
            <article className="max-w-3xl mx-auto px-6 md:px-12 py-12 md:py-20">
                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed">
                    {/* Since the backend currently stores excerpts (not full body), render the excerpt as the content */}
                    <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                        {excerpt(article)}
                    </p>
                </div>

                {/* Share */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {categoryLabel(article.category)}
                        </span>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(article.published_at)}
                        </span>
                    </div>
                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        {t.news.shareArticle}
                    </button>
                </div>
            </article>

            {/* Related articles */}
            {related.length > 0 && (
                <section className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24 transition-colors duration-500">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-10">
                            {t.news.relatedNews}
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/news/${rel.id}`}
                                    className="group bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-500"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={rel.image}
                                            alt={title(rel)}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2.5 py-0.5 rounded-md bg-white/90 dark:bg-gray-900/90 text-primary text-xs font-medium">
                                                {categoryLabel(rel.category)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                                            {formatDate(rel.published_at)}
                                        </p>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                            {title(rel)}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                                            {excerpt(rel)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
