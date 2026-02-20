"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadFile,
    type ProductAdmin,
} from "@/lib/admin-api";

const TYPES = ["fabric", "garment"];

const empty = (): Omit<ProductAdmin, "id"> => ({
    product_type: "fabric",
    name: "",
    image: "",
    composition: "",
    weight: null,
    width: null,
    colors: 0,
    sizes: null,
    min_order: "",
    sort_order: 0,
});

export default function AdminProductsPage() {
    const [items, setItems] = useState<ProductAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState(empty());
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState("");
    const [imgUploading, setImgUploading] = useState(false);
    const imgInputRef = useRef<HTMLInputElement>(null);
    const [filterType, setFilterType] = useState<string>("all");

    const load = useCallback(async () => {
        const data = await fetchProducts();
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
                await updateProduct(editId, form);
                setToast("Mahsulot yangilandi!");
            } else {
                await createProduct(form);
                setToast("Mahsulot yaratildi!");
            }
            resetForm();
            await load();
        } catch {
            setToast("Mahsulotni saqlashda xatolik");
        }
        setSaving(false);
    };

    const handleEdit = (p: ProductAdmin) => {
        setEditId(p.id);
        setForm({
            product_type: p.product_type,
            name: p.name,
            image: p.image,
            composition: p.composition,
            weight: p.weight,
            width: p.width,
            colors: p.colors,
            sizes: p.sizes,
            min_order: p.min_order,
            sort_order: p.sort_order,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu mahsulotni o'chirmoqchimisiz?")) return;
        await deleteProduct(id);
        await load();
        setToast("Mahsulot o'chirildi");
    };

    const set = (key: string, val: string | number | null) =>
        setForm((p) => ({ ...p, [key]: val }));

    const filtered =
        filterType === "all" ? items : items.filter((p) => p.product_type === filterType);

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
                <div className="flex gap-2">
                    {["all", ...TYPES].map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilterType(t)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === t
                                ? "bg-primary text-white"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                            {t !== "all" && (
                                <span className="ml-1.5 text-xs opacity-70">
                                    ({items.filter((p) => p.product_type === t).length})
                                </span>
                            )}
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
                    {showForm ? "Bekor qilish" : "+ Mahsulot qo'shish"}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {editId ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
                    </h3>

                    <div className="grid gap-3 md:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Turi</label>
                            <select
                                value={form.product_type}
                                onChange={(e) => set("product_type", e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            >
                                {TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <Field label="Nomi" value={form.name} onChange={(v) => set("name", v)} />
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
                        <Field label="Tarkibi" value={form.composition} onChange={(v) => set("composition", v)} />
                        <Field label="Og'irligi" value={form.weight || ""} onChange={(v) => set("weight", v || null)} />
                        <Field label="Kengligi" value={form.width || ""} onChange={(v) => set("width", v || null)} />
                        <Field label="Ranglar" type="number" value={String(form.colors)} onChange={(v) => set("colors", Number(v))} />
                        <Field label="O'lchamlar" value={form.sizes || ""} onChange={(v) => set("sizes", v || null)} />
                        <Field label="Min buyurtma" value={form.min_order} onChange={(v) => set("min_order", v)} />
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
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Mahsulot</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Turi</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Tarkibi</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Ranglar</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {p.image && (
                                                <img
                                                    src={p.image}
                                                    alt={p.name}
                                                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                                                />
                                            )}
                                            <span className="text-gray-900 font-medium">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2.5 py-1 rounded-lg text-xs font-medium ${p.product_type === "fabric"
                                                ? "bg-blue-50 text-blue-600"
                                                : "bg-purple-50 text-purple-600"
                                                }`}
                                        >
                                            {p.product_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{p.composition}</td>
                                    <td className="px-6 py-4 text-gray-500">{p.colors}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(p)} className="text-primary hover:underline">
                                            Tahrirlash
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">
                                            O'chirish
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        Hali mahsulotlar yo'q
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
