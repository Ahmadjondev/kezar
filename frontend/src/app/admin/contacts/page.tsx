"use client";

import { useEffect, useState, useCallback } from "react";
import {
    fetchContacts,
    updateContact,
    deleteContact,
    type ContactAdmin,
} from "@/lib/admin-api";

export default function AdminContactsPage() {
    const [items, setItems] = useState<ContactAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState("");
    const [selected, setSelected] = useState<ContactAdmin | null>(null);
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

    const load = useCallback(async () => {
        const data = await fetchContacts();
        setItems(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleMarkRead = async (id: number, isRead: boolean) => {
        await updateContact(id, { is_read: isRead });
        setItems((prev) =>
            prev.map((c) => (c.id === id ? { ...c, is_read: isRead } : c)),
        );
        if (selected?.id === id) {
            setSelected((prev) => (prev ? { ...prev, is_read: isRead } : prev));
        }
        setToast(isRead ? "O'qilgan deb belgilandi" : "O'qilmagan deb belgilandi");
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu xabarni o'chirmoqchimisiz?")) return;
        await deleteContact(id);
        setItems((prev) => prev.filter((c) => c.id !== id));
        if (selected?.id === id) setSelected(null);
        setToast("Xabar o'chirildi");
    };

    const handleMarkAllRead = async () => {
        const unread = items.filter((c) => !c.is_read);
        if (unread.length === 0) return;
        await Promise.all(unread.map((c) => updateContact(c.id, { is_read: true })));
        setItems((prev) => prev.map((c) => ({ ...c, is_read: true })));
        setToast(`${unread.length} ta xabar o'qilgan deb belgilandi`);
    };

    const filtered = items.filter((c) => {
        if (filter === "unread") return !c.is_read;
        if (filter === "read") return c.is_read;
        return true;
    });

    const unreadCount = items.filter((c) => !c.is_read).length;

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-500">
                        {items.length} ta xabar
                        {unreadCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                {unreadCount} ta yangi
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Filter tabs */}
                    {(["all", "unread", "read"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f
                                ? "bg-primary text-white"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {f === "all" ? "Hammasi" : f === "unread" ? "Yangi" : "O'qilgan"}
                        </button>
                    ))}
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            Hammasini o'qilgan qilish
                        </button>
                    )}
                </div>
            </div>

            {/* Detail modal */}
            {selected && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {selected.subject}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {selected.name} &middot;{" "}
                                <a href={`mailto:${selected.email}`} className="text-primary hover:underline">
                                    {selected.email}
                                </a>
                                {selected.phone && (
                                    <>
                                        {" "}&middot;{" "}
                                        <a href={`tel:${selected.phone}`} className="text-primary hover:underline">
                                            {selected.phone}
                                        </a>
                                    </>
                                )}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(selected.created_at).toLocaleString("uz-UZ")}
                            </p>
                        </div>
                        <button
                            onClick={() => setSelected(null)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {selected.message}
                    </div>
                    <div className="flex gap-2">
                        <a
                            href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Javob berish
                        </a>
                        <button
                            onClick={() => handleMarkRead(selected.id, !selected.is_read)}
                            className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                            {selected.is_read ? "O'qilmagan qilish" : "O'qilgan qilish"}
                        </button>
                        <button
                            onClick={() => handleDelete(selected.id)}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                            O'chirish
                        </button>
                    </div>
                </div>
            )}

            {/* Messages list */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-400">
                        {filter === "unread" ? "Yangi xabarlar yo'q" : filter === "read" ? "O'qilgan xabarlar yo'q" : "Hali xabarlar yo'q"}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filtered.map((c) => (
                            <div
                                key={c.id}
                                onClick={() => {
                                    setSelected(c);
                                    if (!c.is_read) handleMarkRead(c.id, true);
                                }}
                                className={`flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${!c.is_read ? "bg-primary/[0.02]" : ""
                                    }`}
                            >
                                {/* Unread indicator */}
                                <div className="mt-2 shrink-0">
                                    <div
                                        className={`w-2.5 h-2.5 rounded-full ${!c.is_read ? "bg-primary" : "bg-gray-200"
                                            }`}
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline justify-between gap-4">
                                        <span className={`text-sm truncate ${!c.is_read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                                            {c.name}
                                        </span>
                                        <span className="text-xs text-gray-400 shrink-0">
                                            {new Date(c.created_at).toLocaleDateString("uz-UZ")}
                                        </span>
                                    </div>
                                    <p className={`text-sm truncate mt-0.5 ${!c.is_read ? "font-medium text-gray-800" : "text-gray-600"}`}>
                                        {c.subject}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate mt-0.5">
                                        {c.message.slice(0, 120)}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => handleMarkRead(c.id, !c.is_read)}
                                        title={c.is_read ? "O'qilmagan qilish" : "O'qilgan qilish"}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill={c.is_read ? "none" : "currentColor"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(c.id)}
                                        title="O'chirish"
                                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {toast && (
                <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm shadow-lg">
                    {toast}
                </div>
            )}
        </div>
    );
}
