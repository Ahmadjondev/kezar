"use client";

import { useEffect, useRef, useState } from "react";
import { extractYouTubeId } from "@/lib/youtube";

/** Returns true when the value looks like a direct video file path/URL */
function isDirectVideo(src: string): boolean {
    // YouTube full links start with http but are NOT direct videos
    if (/youtube\.com|youtu\.be/i.test(src)) return false;
    return (
        src.startsWith("/uploads/") ||
        (src.startsWith("http") && /\.(mp4|webm|ogg|mov)(\?|$)/i.test(src))
    );
}

export default function HeroVideo({ videoId = "Q5vLHyS-EHY" }: { videoId?: string }) {
    const [loaded, setLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const direct = isDirectVideo(videoId);
    const ytId = !direct ? extractYouTubeId(videoId) : videoId;

    // For direct videos, listen for loadeddata
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const onReady = () => setLoaded(true);
        v.addEventListener("loadeddata", onReady);
        return () => v.removeEventListener("loadeddata", onReady);
    }, [direct]);

    // For YouTube iframes — reveal after iframe loads + small buffer
    useEffect(() => {
        if (direct) return;
        const iframe = iframeRef.current;
        if (!iframe) return;

        const onLoad = () => {
            // Give YouTube a moment to actually start rendering
            setTimeout(() => setLoaded(true), 800);
        };
        iframe.addEventListener("load", onLoad);

        // Fallback timeout in case load event doesn't fire
        const fallback = setTimeout(() => setLoaded(true), 4000);

        return () => {
            iframe.removeEventListener("load", onLoad);
            clearTimeout(fallback);
        };
    }, [direct]);

    const videoSrc = direct
        ? (videoId.startsWith("http") ? videoId : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${videoId}`)
        : undefined;

    // Build YouTube URL only on client side to avoid SSR origin issues
    const youtubeUrl = !direct
        ? `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0`
        : undefined;

    return (
        <section
            id="hero"
            className="relative w-full h-screen overflow-hidden bg-black"
        >
            {direct ? (
                /* ── Self-hosted / uploaded video ────────────────────── */
                <video
                    ref={videoRef}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
                    src={videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
            ) : (
                /* ── YouTube embed ──────────────────────────────────── */
                <div className="absolute inset-0">
                    <iframe
                        ref={iframeRef}
                        // Added scale-[1.35] right here at the end!
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full min-h-full h-[56.25vw] pointer-events-none scale-[1.35]"
                        src={youtubeUrl}
                        title="Kezar Teks — Company Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )}

            {/* Loading overlay — hides YouTube title/logo while loading */}
            <div
                className={`absolute inset-0 bg-black z-10 transition-opacity duration-700 ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
            >
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse flex flex-col items-center gap-3">
                        <img src="/images/logo-transparent.png" alt="Kezar Teks" className="w-14 h-14 object-contain" />
                        <div className="w-8 h-0.5 bg-white/20 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Dark overlays */}
            <div className="absolute inset-0 bg-black/32 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/55 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/55 to-transparent pointer-events-none" />
        </section>
    );
}