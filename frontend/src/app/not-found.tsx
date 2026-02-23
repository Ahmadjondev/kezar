import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
            <div className="text-center px-6">
                <img
                    src="/images/logo-transparent.png"
                    alt="Kezar Teks"
                    className="w-20 h-20 object-contain mx-auto mb-8 opacity-60"
                />
                <h1 className="text-7xl font-extralight text-primary mb-4 tracking-tight">
                    404
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
                    Sahifa topilmadi / Страница не найдена / Page not found
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Bosh sahifa
                </Link>
            </div>
        </div>
    );
}
