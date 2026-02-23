"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Statistic } from "@/lib/api";

const ICON_MAP: Record<string, React.ReactNode> = {
    employees: (
        <svg className="w-8 h-8 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
    ),
    garments: (
        <svg className="w-8 h-8 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
        </svg>
    ),
    fabric: (
        <svg className="w-8 h-8 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0L12 17.25 6.429 14.25m11.142 0l4.179 2.25L12 21.75l-9.75-5.25 4.179-2.25" />
        </svg>
    ),
};

function useCountUp(target: number, duration = 2200, trigger = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!trigger) return;
        let start = 0;
        const startTime = performance.now();

        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo for a snappy feel
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            start = Math.floor(eased * target);
            setCount(start);
            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }, [target, duration, trigger]);

    return count;
}

function StatItem({
    value,
    label,
    icon,
    trigger,
    delay,
}: {
    value: number;
    label: string;
    icon: React.ReactNode;
    trigger: boolean;
    delay: number;
}) {
    const [active, setActive] = useState(false);
    const count = useCountUp(value, 2200, active);

    useEffect(() => {
        if (!trigger) return;
        const timer = setTimeout(() => setActive(true), delay);
        return () => clearTimeout(timer);
    }, [trigger, delay]);

    return (
        <div
            className={`flex flex-col items-center gap-4 text-center transition-all duration-700 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
        >
            <div className="mb-1">{icon}</div>
            <span className="text-5xl md:text-7xl font-bold text-primary tabular-nums leading-none tracking-tight">
                {count.toLocaleString()}
            </span>
            <span className="text-xs md:text-sm tracking-[0.18em] text-gray-400 dark:text-gray-500 uppercase max-w-56 leading-relaxed">
                {label}
            </span>
        </div>
    );
}

export default function Statistics({ statistics }: { statistics: Statistic[] }) {
    const { locale } = useLanguage();
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 },
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-16 md:py-32 bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-500"
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,72,129,0.04),transparent_60%)]" />

            <div className="relative mx-auto max-w-6xl px-8 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10">
                    {statistics.map((stat, i) => {
                        const label = locale === "ru" ? stat.label_ru : locale === "uz" ? stat.label_uz : stat.label_en;
                        return (
                            <StatItem
                                key={stat.id}
                                value={stat.value}
                                label={`${label}${stat.suffix ? " " + stat.suffix : ""}`}
                                icon={ICON_MAP[stat.icon_key] || ICON_MAP.employees}
                                trigger={visible}
                                delay={i * 150}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
