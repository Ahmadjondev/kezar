"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to an external service in production
        // eslint-disable-next-line no-console
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
            <div className="text-center px-6">
                <img
                    src="/images/logo-transparent.png"
                    alt="Kezar Teks"
                    className="w-20 h-20 object-contain mx-auto mb-8 opacity-60"
                />
                <h1 className="text-5xl font-extralight text-primary mb-4 tracking-tight">
                    Xatolik yuz berdi
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
                    Nimadir xato ketdi. Qayta urinib ko&apos;ring.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={reset}
                        className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300"
                    >
                        Qayta urinish
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                    >
                        Bosh sahifa
                    </Link>
                </div>
            </div>
        </div>
    );
}
