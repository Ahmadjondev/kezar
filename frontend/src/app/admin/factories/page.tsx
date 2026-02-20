"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
    fetchFactories,
    createFactory,
    updateFactory,
    deleteFactory,
    uploadFile,
    type FactoryAdmin,
} from "@/lib/admin-api";

const empty = (): Omit<FactoryAdmin, "id"> => ({
    title_uz: "",
    title_ru: "",
    title_en: "",
    desc_uz: "",
    desc_ru: "",
    desc_en: "",
    image: "",
    capacity: "",
    area: "",
    equipment: "",
    workers: 0,
    sort_order: 0,
});

export default function AdminFactoriesPage() {
    const [items, setItems] = useState<FactoryAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState(empty());
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState("");
    const [imgUploading, setImgUploading] = useState(false);
    const imgInputRef = useRef<HTMLInputElement>(null);

    const load = useCallback(async () => {
        const data = await fetchFactories();
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
                await updateFactory(editId, form);
                setToast("Zavod yangilandi!");
            } else {
                await createFactory(form);
                setToast("Zavod yaratildi!");
            }
            resetForm();
            await load();
        } catch {
            setToast("Zavodini saqlashda xatolik");
        }
        setSaving(false);
    };

    const handleEdit = (f: FactoryAdmin) => {
        setEditId(f.id);
        setForm({
            title_uz: f.title_uz,
            title_ru: f.title_ru,
            title_en: f.title_en,
            desc_uz: f.desc_uz,
            desc_ru: f.desc_ru,
            desc_en: f.desc_en,
            image: f.image,
            capacity: f.capacity,
            area: f.area,
            equipment: f.equipment,
            workers: f.workers,
            sort_order: f.sort_order,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu zavodini o'chirmoqchimisiz?")) return;
        await deleteFactory(id);
        await load();
        setToast("Zavod o'chirildi");
    };

    const set = (key: string, val: string | number) =>
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
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{items.length} ta zavod</p>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                    {showForm ? "Bekor qilish" : "+ Zavod qo'shish"}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {editId ? "Zavodini tahrirlash" : "Yangi zavod"}
                    </h3>

                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-3">Sarlavhalar</p>
                        <div className="grid gap-3 md:grid-cols-3">
                            <Field label="Sarlavha (UZ)" value={form.title_uz} onChange={(v) => set("title_uz", v)} />
                            <Field label="Sarlavha (RU)" value={form.title_ru} onChange={(v) => set("title_ru", v)} />
                            <Field label="Sarlavha (EN)" value={form.title_en} onChange={(v) => set("title_en", v)} />
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-3">Tavsiflar</p>
                        <div className="grid gap-3 md:grid-cols-3">
                            <Textarea label="Tavsif (UZ)" value={form.desc_uz} onChange={(v) => set("desc_uz", v)} />
                            <Textarea label="Tavsif (RU)" value={form.desc_ru} onChange={(v) => set("desc_ru", v)} />
                            <Textarea label="Tavsif (EN)" value={form.desc_en} onChange={(v) => set("desc_en", v)} />
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-3">Tafsilotlar</p>
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
                            <Field label="Quvvat" value={form.capacity} onChange={(v) => set("capacity", v)} />
                            <Field label="Maydon" value={form.area} onChange={(v) => set("area", v)} />
                            <Field label="Jihozlar" value={form.equipment} onChange={(v) => set("equipment", v)} />
                            <Field label="Ishchilar" type="number" value={String(form.workers)} onChange={(v) => set("workers", Number(v))} />
                            <Field label="Tartib raqami" type="number" value={String(form.sort_order)} onChange={(v) => set("sort_order", Number(v))} />
                        </div>
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

            {/* Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                {items.map((f) => (
                    <div
                        key={f.id}
                        className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        {f.image && (
                            <img
                                src={f.image}
                                alt={f.title_en}
                                className="w-full h-40 object-cover"
                            />
                        )}
                        <div className="p-5">
                            <h4 className="font-semibold text-gray-900 mb-1">{f.title_en}</h4>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{f.desc_en}</p>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                                {f.capacity && (
                                    <span className="px-2 py-1 rounded-md bg-gray-100">
                                        {f.capacity}
                                    </span>
                                )}
                                {f.area && (
                                    <span className="px-2 py-1 rounded-md bg-gray-100">
                                        {f.area}
                                    </span>
                                )}
                                {f.workers > 0 && (
                                    <span className="px-2 py-1 rounded-md bg-gray-100">
                                        {f.workers} ishchi
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(f)}
                                    className="px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                                >
                                    Tahrirlash
                                </button>
                                <button
                                    onClick={() => handleDelete(f.id)}
                                    className="px-4 py-1.5 rounded-lg bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100 transition-colors"
                                >
                                    O'chirish
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-gray-400">
                        Hali zavodlar yo'q
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
