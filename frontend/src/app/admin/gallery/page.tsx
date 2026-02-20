"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
    fetchGallery,
    createGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
    uploadFile,
    type GalleryImageAdmin,
} from "@/lib/admin-api";

const CATEGORIES = ["factory", "fabric", "garments", "dyeing", "team"];

const empty = (): Omit<GalleryImageAdmin, "id"> => ({
    src: "",
    alt: "",
    category: "factory",
    span: "",
    sort_order: 0,
});

export default function AdminGalleryPage() {
    const [items, setItems] = useState<GalleryImageAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState(empty());
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState("");
    const [imgUploading, setImgUploading] = useState(false);
    const imgInputRef = useRef<HTMLInputElement>(null);
    const [filterCat, setFilterCat] = useState("all");

    const load = useCallback(async () => {
        const data = await fetchGallery();
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
                await updateGalleryImage(editId, form);
                setToast("Rasm yangilandi!");
            } else {
                await createGalleryImage(form);
                setToast("Rasm qo'shildi!");
            }
            resetForm();
            await load();
        } catch {
            setToast("Rasmni saqlashda xatolik");
        }
        setSaving(false);
    };

    const handleEdit = (img: GalleryImageAdmin) => {
        setEditId(img.id);
        setForm({
            src: img.src,
            alt: img.alt,
            category: img.category,
            span: img.span,
            sort_order: img.sort_order,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu rasmni o'chirmoqchimisiz?")) return;
        await deleteGalleryImage(id);
        await load();
        setToast("Rasm o'chirildi");
    };

    const set = (key: string, val: string | number) =>
        setForm((p) => ({ ...p, [key]: val }));

    const filtered =
        filterCat === "all" ? items : items.filter((i) => i.category === filterCat);

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
                <div className="flex flex-wrap gap-2">
                    {["all", ...CATEGORIES].map((c) => (
                        <button
                            key={c}
                            onClick={() => setFilterCat(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterCat === c
                                ? "bg-primary text-white"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                    {showForm ? "Bekor qilish" : "+ Rasm qo'shish"}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {editId ? "Rasmni tahrirlash" : "Yangi rasm"}
                    </h3>
                    <div className="grid gap-3 md:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rasm</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={form.src}
                                    onChange={(e) => set("src", e.target.value)}
                                    placeholder="Rasm URL yoki yuklash"
                                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                />
                                <input ref={imgInputRef} type="file" accept="image/*" onChange={async (e) => {
                                    const file = e.target.files?.[0]; if (!file) return;
                                    setImgUploading(true);
                                    try { const url = await uploadFile(file); set("src", url); } catch { setToast("Rasm yuklashda xatolik"); }
                                    setImgUploading(false); if (imgInputRef.current) imgInputRef.current.value = "";
                                }} className="hidden" />
                                <button type="button" onClick={() => imgInputRef.current?.click()} disabled={imgUploading}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors shrink-0">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                    {imgUploading ? "..." : "Yuklash"}
                                </button>
                            </div>
                            {form.src && <img src={form.src.startsWith("/uploads/") ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${form.src}` : form.src} alt="" className="mt-2 h-16 rounded-lg object-cover" />}
                        </div>
                        <Field label="Tavsif matni" value={form.alt} onChange={(v) => set("alt", v)} />
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
                        <Field label="Kengayish (CSS class)" value={form.span} onChange={(v) => set("span", v)} />
                        <Field label="Tartib raqami" type="number" value={String(form.sort_order)} onChange={(v) => set("sort_order", Number(v))} />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors"
                        >
                            {saving ? "Saqlanmoqda..." : editId ? "Yangilash" : "Qo'shish"}
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

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((img) => (
                    <div
                        key={img.id}
                        className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className="aspect-square">
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                            <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                                <p className="text-white text-xs font-medium truncate mb-2">
                                    {img.alt || img.category}
                                </p>
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={() => handleEdit(img)}
                                        className="px-3 py-1 rounded-lg bg-white/90 text-gray-900 text-xs font-medium hover:bg-white transition-colors"
                                    >
                                        Tahrirlash
                                    </button>
                                    <button
                                        onClick={() => handleDelete(img.id)}
                                        className="px-3 py-1 rounded-lg bg-red-500/90 text-white text-xs font-medium hover:bg-red-500 transition-colors"
                                    >
                                        O'chirish
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Category badge */}
                        <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 rounded-md bg-white/90 text-gray-600 text-xs font-medium">
                                {img.category}
                            </span>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        Hali rasmlar yo'q
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
