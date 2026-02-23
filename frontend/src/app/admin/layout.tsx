"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getToken, removeToken, fetchUnreadCount } from "@/lib/admin-api";

const NAV_SECTIONS = [
    {
        label: "Asosiy",
        items: [
            {
                href: "/admin",
                label: "Boshqaruv paneli",
                icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
            },
        ],
    },
    {
        label: "Kontent",
        items: [
            {
                href: "/admin/news",
                label: "Yangiliklar",
                icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
            },
            {
                href: "/admin/products",
                label: "Mahsulotlar",
                icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
            },
            {
                href: "/admin/factories",
                label: "Zavodlar",
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            },
            {
                href: "/admin/gallery",
                label: "Galereya",
                icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
            },
            {
                href: "/admin/contacts",
                label: "Xabarlar",
                icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
                badge: true,
            },
        ],
    },
];

function getPageTitle(pathname: string) {
    const all = NAV_SECTIONS.flatMap((s) => s.items);
    const match = all.find((item) =>
        item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href)
    );
    return match?.label || "Boshqaruv paneli";
}

function getBreadcrumbs(pathname: string) {
    const parts = pathname.replace("/admin", "").split("/").filter(Boolean);
    const crumbs = [{ label: "Admin", href: "/admin" }];
    let href = "/admin";
    for (const part of parts) {
        href += `/${part}`;
        crumbs.push({
            label: part.charAt(0).toUpperCase() + part.slice(1),
            href,
        });
    }
    return crumbs;
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [ready, setReady] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (pathname === "/admin/login") {
            setReady(true);
            return;
        }
        if (!getToken()) {
            router.replace("/admin/login");
            return;
        }
        setReady(true);
    }, [pathname, router]);

    // Fetch unread contact count
    useEffect(() => {
        if (!ready || pathname === "/admin/login") return;
        const load = () => fetchUnreadCount().then(r => setUnreadCount(r.count)).catch(() => { });
        load();
        const interval = setInterval(load, 30000); // refresh every 30s
        return () => clearInterval(interval);
    }, [ready, pathname]);

    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    // Login page gets no layout chrome
    if (pathname === "/admin/login") return <>{children}</>;

    const handleLogout = () => {
        removeToken();
        router.push("/admin/login");
    };

    const pageTitle = getPageTitle(pathname);
    const breadcrumbs = getBreadcrumbs(pathname);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-65 bg-[#111827] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Sidebar header */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-white/6">
                    <Link href="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden">
                            <img src="/images/logo-transparent.png" alt="Kezar Teks" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <span className="font-semibold text-white text-[15px] leading-tight block">Kezar Teks</span>
                            <span className="text-[10px] text-gray-500 tracking-wider uppercase">Admin Panel</span>
                        </div>
                    </Link>
                    {/* Mobile close btn */}
                    <button
                        className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-300 hover:bg-white/5"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-6 overflow-y-auto scrollbar-thin">
                    {NAV_SECTIONS.map((section) => (
                        <div key={section.label}>
                            <p className="px-3 mb-2 text-[10px] font-semibold text-gray-500 tracking-[0.15em] uppercase">
                                {section.label}
                            </p>
                            <div className="space-y-0.5">
                                {section.items.map((item) => {
                                    const active =
                                        item.href === "/admin"
                                            ? pathname === "/admin"
                                            : pathname.startsWith(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${active
                                                ? "bg-primary/15 text-primary shadow-sm"
                                                : "text-gray-400 hover:bg-white/6 hover:text-gray-200"
                                                }`}
                                        >
                                            <svg
                                                className={`w-4.5 h-4.5 shrink-0 transition-colors ${active ? "text-primary" : "text-gray-500 group-hover:text-gray-400"
                                                    }`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                            </svg>
                                            {item.label}
                                            {"badge" in item && item.badge && unreadCount > 0 && (
                                                <span className="ml-auto min-w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1.5">
                                                    {unreadCount > 99 ? "99+" : unreadCount}
                                                </span>
                                            )}
                                            {active && !("badge" in item && item.badge && unreadCount > 0) && (
                                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Sidebar footer */}
                <div className="p-3 border-t border-white/6 space-y-1">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/6 hover:text-gray-200 transition-all duration-150"
                    >
                        <svg className="w-4.5 h-4.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        Saytni ko'rish
                    </a>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
                    >
                        <svg className="w-4.5 h-4.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Chiqish
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-65">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 gap-3 sticky top-0 z-20 shadow-sm">
                    <button
                        className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Page title & breadcrumbs */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-[15px] font-semibold text-gray-900 truncate">
                            {pageTitle}
                        </h2>
                        {breadcrumbs.length > 1 && (
                            <nav className="hidden sm:flex items-center gap-1 text-xs text-gray-400 -mt-0.5">
                                {breadcrumbs.map((crumb, i) => (
                                    <span key={crumb.href} className="flex items-center gap-1">
                                        {i > 0 && (
                                            <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                        {i < breadcrumbs.length - 1 ? (
                                            <Link href={crumb.href} className="hover:text-gray-600 transition-colors">
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-500">{crumb.label}</span>
                                        )}
                                    </span>
                                ))}
                            </nav>
                        )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            Saytni ko'rish
                        </a>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-xs font-bold">A</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
