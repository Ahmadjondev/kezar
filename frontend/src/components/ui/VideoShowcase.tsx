"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { extractYouTubeId } from "@/lib/youtube";
import type { SiteSetting } from "@/lib/api";

export default function VideoShowcase({ settings }: { settings: SiteSetting }) {
    const { locale } = useLanguage();
    const [open, setOpen] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

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

    const openDialog = useCallback(() => {
        setOpen(true);
        document.body.style.overflow = "hidden";
    }, []);

    const closeDialog = useCallback(() => {
        setOpen(false);
        document.body.style.overflow = "";
    }, []);

    // Close on Escape key
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeDialog();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, closeDialog]);

    return (
        <>
            {/* Section with background image and play button */}
            <section
                ref={sectionRef}
                className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-gray-900"
            >
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-center bg-cover"
                    style={{
                        backgroundImage:
                            `url('${settings.showcase_bg_image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80"}')`,
                    }}
                />
                <div className="absolute inset-0 bg-black/55" />

                {/* Content */}
                <div
                    className={`relative z-10 flex flex-col items-start justify-end h-full max-w-6xl mx-auto px-8 md:px-12 pb-20 md:pb-28 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    {/* Play button */}
                    <button
                        onClick={openDialog}
                        className="group mb-8 w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center shadow-[0_0_0_0_rgba(74,140,63,0.4)] hover:shadow-[0_0_0_12px_rgba(74,140,63,0.15)] transition-all duration-500 hover:scale-110"
                        aria-label="Play infrastructure video"
                    >
                        <svg
                            className="w-7 h-7 md:w-8 md:h-8 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>

                    <h2 className="text-3xl md:text-5xl font-light text-white leading-tight mb-4 max-w-2xl">
                        {settings[`showcase_title_${locale}`] || settings.showcase_title_en || "Kezar Teks Infrastructure"}
                    </h2>

                    <p className="text-white/65 text-base md:text-lg max-w-xl leading-relaxed">
                        {settings[`showcase_text_${locale}`] || settings.showcase_text_en || ""}
                    </p>
                </div>
            </section>

            {/* Video dialog overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={closeDialog}
                >
                    {/* Close button */}
                    <button
                        onClick={closeDialog}
                        className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all duration-200"
                        aria-label="Close video"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    {/* Video container */}
                    <div
                        className="w-[92vw] max-w-7xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${extractYouTubeId(settings.showcase_video_id || "Q5vLHyS-EHY")}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
                            title="Kezar Teks Infrastructure and Technology"
                            allow="autoplay; encrypted-media; fullscreen"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>
    );
}
