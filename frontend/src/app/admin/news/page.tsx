"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
    fetchNews,
    createNewsArticle,
    updateNewsArticle,
    deleteNewsArticle,
    uploadFile,
    type NewsArticleAdmin,
} from "@/lib/admin-api";

const CATEGORIES = ["industry", "company", "export", "sustainability"];

const empty = (): Omit<NewsArticleAdmin, "id"> => ({
    title_uz: "",
    title_ru: "",
    title_en: "",
    excerpt_uz: "",
    excerpt_ru: "",
    excerpt_en: "",
    image: "",
    category: "company",
    published_at: new Date().toISOString().slice(0, 16),
});

export default function AdminNewsPage() {
    const [items, setItems] = useState<NewsArticleAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState(empty());
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState("");
    const [imgUploading, setImgUploading] = useState(false);
    const imgInputRef = useRef<HTMLInputElement>(null);

    const load = useCallback(async () => {
        const data = await fetchNews();
        setItems(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const resetForm = () => {
        setEditId(null);
        setForm(empty());
        setShowForm(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editId) {
                await updateNewsArticle(editId, form);
                setToast("Maqola yangilandi!");
            } else {
                await createNewsArticle(form);
                setToast("Maqola yaratildi!");
            }
            resetForm();
            await load();
        } catch {
            setToast("Maqolani saqlashda xatolik");
        }
        setSaving(false);
    };

    const handleEdit = (a: NewsArticleAdmin) => {
        setEditId(a.id);
        setForm({
            title_uz: a.title_uz,
            title_ru: a.title_ru,
            title_en: a.title_en,
            excerpt_uz: a.excerpt_uz,
            excerpt_ru: a.excerpt_ru,
            excerpt_en: a.excerpt_en,
            image: a.image,
            category: a.category,
            published_at: a.published_at.slice(0, 16),
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu maqolani o'chirmoqchimisiz?")) return;
        await deleteNewsArticle(id);
        await load();
        setToast("Maqola o'chirildi");
    };

    const set = (key: string, val: string) =>
        setForm((p) => ({ ...p, [key]: val }));

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
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{items.length} ta maqola</p>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                    {showForm ? "Bekor qilish" : "+ Maqola qo'shish"}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {editId ? "Maqolani tahrirlash" : "Yangi maqola"}
                    </h3>

                    {/* Titles */}
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-3">Sarlavhalar</p>
                        <div className="grid gap-3 md:grid-cols-3">
                            <Field label="Sarlavha (UZ)" value={form.title_uz} onChange={(v) => set("title_uz", v)} />
                            <Field label="Sarlavha (RU)" value={form.title_ru} onChange={(v) => set("title_ru", v)} />
                            <Field label="Sarlavha (EN)" value={form.title_en} onChange={(v) => set("title_en", v)} />
                        </div>
                    </div>

                    {/* Excerpts */}
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-3">Qisqa tavsiflar</p>
                        <div className="grid gap-3 md:grid-cols-3">
                            <Textarea label="Qisqa tavsif (UZ)" value={form.excerpt_uz} onChange={(v) => set("excerpt_uz", v)} />
                            <Textarea label="Qisqa tavsif (RU)" value={form.excerpt_ru} onChange={(v) => set("excerpt_ru", v)} />
                            <Textarea label="Qisqa tavsif (EN)" value={form.excerpt_en} onChange={(v) => set("excerpt_en", v)} />
                        </div>
                    </div>

                    {/* Meta */}
                    <div className="grid gap-3 md:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rasm</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={form.image}
                                    onChange={(e) => set("image", e.target.value)}
                                    placeholder="Rasm URL yoki yuklash"
                                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                />
                                <input ref={imgInputRef} type="file" accept="image/*" onChange={async (e) => {
                                    const file = e.target.files?.[0]; if (!file) return;
                                    setImgUploading(true);
                                    try { const url = await uploadFile(file); set("image", url); } catch { setToast("Rasm yuklashda xatolik"); }
                                    setImgUploading(false); if (imgInputRef.current) imgInputRef.current.value = "";
                                }} className="hidden" />
                                <button type="button" onClick={() => imgInputRef.current?.click()} disabled={imgUploading}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors shrink-0">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                    {imgUploading ? "..." : "Yuklash"}
                                </button>
                            </div>
                            {form.image && <img src={form.image.startsWith("/uploads/") ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${form.image}` : form.image} alt="" className="mt-2 h-16 rounded-lg object-cover" />}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategoriya</label>
                            <select
                                value={form.category}
                                onChange={(e) => set("category", e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <Field
                            label="Nashr sanasi"
                            type="datetime-local"
                            value={form.published_at}
                            onChange={(v) => set("published_at", v)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors"
                        >
                            {saving ? "Saqlanmoqda..." : editId ? "Yangilash" : "Yaratish"}
                        </button>
                        <button
                            onClick={resetForm}
                            className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            Bekor qilish
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Sarlavha</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Kategoriya</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Sana</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {a.image && (
                                                <img
                                                    src={a.image}
                                                    alt=""
                                                    className="w-12 h-8 rounded-lg object-cover shrink-0"
                                                />
                                            )}
                                            <span className="text-gray-900 font-medium line-clamp-1">
                                                {a.title_en || a.title_ru}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                                            {a.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(a.published_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(a)} className="text-primary hover:underline">
                                            Tahrirlash
                                        </button>
                                        <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:underline">
                                            O'chirish
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        Hali maqolalar yo'q
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {toast && (
                <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm shadow-lg">
                    {toast}
                </div>
            )}
        </div>
    );
}

/* ── Field helpers ─────────────────────────────────────────── */

function Field({
    label,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
        </div>
    );
}

function Textarea({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
            />
        </div>
    );
}
