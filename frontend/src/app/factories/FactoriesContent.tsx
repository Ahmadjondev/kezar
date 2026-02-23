"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Factory, SiteSetting } from "@/lib/api";

const HIGHLIGHTS = [
    {
        key: "totalArea" as const,
        value: "1.74 ha",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
        ),
    },
    {
        key: "totalCapacity" as const,
        value: "5,000 t + 5M pcs",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
        ),
    },
    {
        key: "modernEquipment" as const,
        value: "450+",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L12 4.37m-5.68 5.7h11.36M4.26 19.67a9.75 9.75 0 1115.48 0" />
            </svg>
        ),
    },
    {
        key: "qualityControl" as const,
        value: "ISO 9001",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
    },
];

/* ─── Main Factories Content ────────────────────────────────── */
export default function FactoriesContent({ factories, settings }: { factories: Factory[]; settings?: SiteSetting }) {
    const { t, locale } = useLanguage();
    const [heroVisible, setHeroVisible] = useState(false);
    const [cardsVisible, setCardsVisible] = useState(false);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setHeroVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setCardsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        if (cardsRef.current) observer.observe(cardsRef.current);
        return () => observer.disconnect();
    }, []);

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
                    className={`relative max-w-6xl mx-auto px-6 md:px-12 transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    <p className="text-primary/80 text-sm font-medium tracking-[0.2em] uppercase mb-4">
                        Kezar Teks
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-white tracking-tight leading-tight mb-6">
                        {settings?.[`factories_hero_title_${locale}`] || t.factories.heroTitle}
                    </h1>
                    <p className="text-white/50 text-lg md:text-xl max-w-2xl font-light">
                        {settings?.[`factories_hero_subtitle_${locale}`] || t.factories.heroSubtitle}
                    </p>
                </div>
            </section>

            {/* ── Overview + Highlights ─────────────────────────────── */}
            <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-3xl md:text-4xl font-light text-gray-800 dark:text-gray-100 mb-6 transition-colors">
                            {settings?.[`factories_overview_title_${locale}`] || t.factories.overviewTitle}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed transition-colors">
                            {settings?.[`factories_overview_desc_${locale}`] || t.factories.overviewDesc}
                        </p>
                    </div>

                    {/* Highlight stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {HIGHLIGHTS.map((item) => (
                            <div
                                key={item.key}
                                className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 text-center transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                                    {item.icon}
                                </div>
                                <p className="text-2xl md:text-3xl font-bold text-primary tabular-nums leading-none">
                                    {item.value}
                                </p>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                                    {t.factories[item.key]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Factory Cards ─────────────────────────────────────── */}
            <section className="py-20 md:py-28 bg-white dark:bg-gray-950 transition-colors duration-500">
                <div ref={cardsRef} className="max-w-6xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {factories.map((factory, i) => {
                            const title = locale === "ru" ? factory.title_ru : locale === "uz" ? factory.title_uz : factory.title_en;
                            const desc = locale === "ru" ? factory.desc_ru : locale === "uz" ? factory.desc_uz : factory.desc_en;
                            return (
                                <div
                                    key={factory.id}
                                    className={`group relative rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-700 hover:shadow-xl hover:-translate-y-1 ${cardsVisible
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-10"
                                        }`}
                                    style={{ transitionDelay: cardsVisible ? `${i * 120}ms` : "0ms" }}
                                >
                                    {/* Factory image */}
                                    <div className="relative h-56 md:h-64 overflow-hidden">
                                        <Image
                                            src={factory.image}
                                            alt={title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-5">
                                            <h3 className="text-xl font-semibold text-white drop-shadow-md">
                                                {title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 lg:p-8">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5 transition-colors">
                                            {desc}
                                        </p>

                                        {/* Stats grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[
                                                { label: t.factories.capacity, value: factory.capacity },
                                                { label: t.factories.area, value: factory.area },
                                                { label: t.factories.equipment, value: factory.equipment },
                                                { label: t.factories.workers, value: factory.workers.toString() },
                                            ].map((stat) => (
                                                <div
                                                    key={stat.label}
                                                    className="bg-gray-50 dark:bg-gray-900/60 rounded-xl px-3 py-3 text-center transition-colors"
                                                >
                                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                                        {stat.value}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">
                                                        {stat.label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
