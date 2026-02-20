"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
    fetchSettings,
    bulkUpdateSettings,
    fetchStatistics,
    createStatistic,
    updateStatistic,
    deleteStatistic,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    uploadFile,
    type SiteSettingAdmin,
    type StatisticAdmin,
    type ClientAdmin,
} from "@/lib/admin-api";

/* ── Reusable tiny components ──────────────────────────────── */

function Spinner() {
    return (
        <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
    );
}

function SaveBtn({
    loading,
    onClick,
    label = "Saqlash",
}: {
    loading: boolean;
    onClick: () => void;
    label?: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
            {loading ? "Saqlanmoqda..." : label}
        </button>
    );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm shadow-lg animate-[slideUp_0.3s_ease]">
            {message}
        </div>
    );
}

/* ── Settings Groups Config ────────────────────────────────── */

const SETTING_GROUPS = [
    {
        group: "hero",
        title: "Bosh qism",
        fields: [{ key: "hero_video_id", label: "Video (YouTube havola yoki yuklangan video)", upload: "video" }],
    },
    {
        group: "intro",
        title: "Kompaniya haqida",
        fields: [
            { key: "intro_title_uz", label: "Sarlavha (UZ)" },
            { key: "intro_title_ru", label: "Sarlavha (RU)" },
            { key: "intro_title_en", label: "Sarlavha (EN)" },
            { key: "intro_text_uz", label: "Tavsif (UZ)", multiline: true },
            { key: "intro_text_ru", label: "Tavsif (RU)", multiline: true },
            { key: "intro_text_en", label: "Tavsif (EN)", multiline: true },
            { key: "intro_image", label: "Rasm", upload: "image" },
        ],
    },
    {
        group: "social",
        title: "Ijtimoiy tarmoqlar",
        fields: [
            { key: "social_facebook", label: "Facebook" },
            { key: "social_telegram", label: "Telegram" },
            { key: "social_instagram", label: "Instagram" },
        ],
    },
    {
        group: "showcase",
        title: "Video ko'rgazma",
        fields: [
            { key: "showcase_video_id", label: "YouTube video havolasi" },
            { key: "showcase_bg_image", label: "Fon rasm", upload: "image" },
            { key: "showcase_title_uz", label: "Sarlavha (UZ)" },
            { key: "showcase_title_ru", label: "Sarlavha (RU)" },
            { key: "showcase_title_en", label: "Sarlavha (EN)" },
            { key: "showcase_text_uz", label: "Matn (UZ)", multiline: true },
            { key: "showcase_text_ru", label: "Matn (RU)", multiline: true },
            { key: "showcase_text_en", label: "Matn (EN)", multiline: true },
        ],
    },
    {
        group: "footer",
        title: "Aloqa va pastki qism",
        fields: [
            { key: "contact_email", label: "Email" },
            { key: "contact_website", label: "Veb-sayt" },
            { key: "contact_phone", label: "Telefon" },
            { key: "contact_address_uz", label: "Manzil (UZ)" },
            { key: "contact_address_ru", label: "Manzil (RU)" },
            { key: "contact_address_en", label: "Manzil (EN)" },
        ],
    },
    {
        group: "about",
        title: "Biz haqimizda",
        fields: [
            { key: "about_company_name", label: "Kompaniya nomi" },
            { key: "about_stir", label: "STIR" },
            { key: "about_okonx", label: "OKONX" },
            { key: "about_oked", label: "OKED" },
            { key: "about_mfo", label: "MFO" },
            { key: "about_inn", label: "INN" },
            { key: "about_bank", label: "Bank" },
            { key: "about_director", label: "Direktor" },
            { key: "about_registration_number", label: "Ro'yxat raqami" },
            { key: "about_export_countries", label: "Eksport davlatlari (vergul bilan)" },
            { key: "about_founded_year", label: "Tashkil etilgan yili" },
        ],
    },
    {
        group: "products_page",
        title: "Mahsulotlar sahifasi",
        fields: [
            { key: "products_hero_title_uz", label: "Hero sarlavha (UZ)" },
            { key: "products_hero_title_ru", label: "Hero sarlavha (RU)" },
            { key: "products_hero_title_en", label: "Hero sarlavha (EN)" },
            { key: "products_hero_subtitle_uz", label: "Hero tavsif (UZ)" },
            { key: "products_hero_subtitle_ru", label: "Hero tavsif (RU)" },
            { key: "products_hero_subtitle_en", label: "Hero tavsif (EN)" },
        ],
    },
    {
        group: "factories_page",
        title: "Fabrikalar sahifasi",
        fields: [
            { key: "factories_hero_title_uz", label: "Hero sarlavha (UZ)" },
            { key: "factories_hero_title_ru", label: "Hero sarlavha (RU)" },
            { key: "factories_hero_title_en", label: "Hero sarlavha (EN)" },
            { key: "factories_hero_subtitle_uz", label: "Hero tavsif (UZ)" },
            { key: "factories_hero_subtitle_ru", label: "Hero tavsif (RU)" },
            { key: "factories_hero_subtitle_en", label: "Hero tavsif (EN)" },
            { key: "factories_overview_title_uz", label: "Umumiy ko'rinish sarlavha (UZ)" },
            { key: "factories_overview_title_ru", label: "Umumiy ko'rinish sarlavha (RU)" },
            { key: "factories_overview_title_en", label: "Umumiy ko'rinish sarlavha (EN)" },
            { key: "factories_overview_desc_uz", label: "Umumiy ko'rinish tavsif (UZ)", multiline: true },
            { key: "factories_overview_desc_ru", label: "Umumiy ko'rinish tavsif (RU)", multiline: true },
            { key: "factories_overview_desc_en", label: "Umumiy ko'rinish tavsif (EN)", multiline: true },
        ],
    },
    {
        group: "gallery_page",
        title: "Galereya sahifasi",
        fields: [
            { key: "gallery_hero_title_uz", label: "Hero sarlavha (UZ)" },
            { key: "gallery_hero_title_ru", label: "Hero sarlavha (RU)" },
            { key: "gallery_hero_title_en", label: "Hero sarlavha (EN)" },
            { key: "gallery_hero_subtitle_uz", label: "Hero tavsif (UZ)" },
            { key: "gallery_hero_subtitle_ru", label: "Hero tavsif (RU)" },
            { key: "gallery_hero_subtitle_en", label: "Hero tavsif (EN)" },
        ],
    },
    {
        group: "news_page",
        title: "Yangiliklar sahifasi",
        fields: [
            { key: "news_hero_title_uz", label: "Hero sarlavha (UZ)" },
            { key: "news_hero_title_ru", label: "Hero sarlavha (RU)" },
            { key: "news_hero_title_en", label: "Hero sarlavha (EN)" },
            { key: "news_hero_subtitle_uz", label: "Hero tavsif (UZ)" },
            { key: "news_hero_subtitle_ru", label: "Hero tavsif (RU)" },
            { key: "news_hero_subtitle_en", label: "Hero tavsif (EN)" },
        ],
    },
];

/* ── Settings Panel ────────────────────────────────────────── */

function SettingsPanel({ toast }: { toast: (m: string) => void }) {
    const [settings, setSettings] = useState<SiteSettingAdmin[]>([]);
    const [values, setValues] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeGroup, setActiveGroup] = useState(SETTING_GROUPS[0].group);
    const [uploading, setUploading] = useState(false);
    const [uploadingField, setUploadingField] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSettings().then((data) => {
            setSettings(data);
            const map: Record<string, string> = {};
            data.forEach((s) => (map[s.key] = s.value));
            setValues(map);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const items = Object.entries(values).map(([key, value]) => {
                const existing = settings.find((s) => s.key === key);
                return { key, value, group: existing?.group || "general" };
            });
            await bulkUpdateSettings(items);
            toast("Sozlamalar saqlandi!");
        } catch {
            toast("Sozlamalarni saqlashda xatolik");
        }
        setSaving(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !uploadingField) return;
        setUploading(true);
        try {
            const url = await uploadFile(file);
            setValues((prev) => ({ ...prev, [uploadingField]: url }));
            toast("Fayl yuklandi!");
        } catch {
            toast("Fayl yuklashda xatolik");
        }
        setUploading(false);
        setUploadingField(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const triggerUpload = (fieldKey: string, accept: string) => {
        setUploadingField(fieldKey);
        if (fileInputRef.current) {
            fileInputRef.current.accept = accept;
            fileInputRef.current.click();
        }
    };

    if (loading) return <Spinner />;

    const currentGroup = SETTING_GROUPS.find((g) => g.group === activeGroup)!;

    return (
        <div className="space-y-4">
            {/* Group tabs */}
            <div className="flex flex-wrap gap-2">
                {SETTING_GROUPS.map((g) => (
                    <button
                        key={g.group}
                        onClick={() => setActiveGroup(g.group)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeGroup === g.group
                            ? "bg-primary text-white"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        {g.title}
                    </button>
                ))}
            </div>

            {/* Fields */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">
                    {currentGroup.title}
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    {currentGroup.fields.map((f) => (
                        <div
                            key={f.key}
                            className={f.multiline ? "md:col-span-2" : ""}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                {f.label}
                            </label>
                            {f.upload ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={values[f.key] || ""}
                                        onChange={(e) =>
                                            setValues({ ...values, [f.key]: e.target.value })
                                        }
                                        placeholder={f.upload === "video" ? "YouTube havola yoki video fayl yo\u2019li" : "Rasm URL yoki yuklash"}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    />
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => triggerUpload(f.key, f.upload === "video" ? "video/mp4,video/webm,video/ogg" : "image/*")}
                                            disabled={uploading}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                            {uploading && uploadingField === f.key ? "Yuklanmoqda..." : f.upload === "video" ? "Video yuklash" : "Rasm yuklash"}
                                        </button>
                                        {values[f.key] && (
                                            <span className="text-xs text-gray-500 truncate max-w-48">
                                                {values[f.key]}
                                            </span>
                                        )}
                                    </div>
                                    {f.upload === "image" && values[f.key] && (
                                        <img
                                            src={values[f.key].startsWith("/uploads/") ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${values[f.key]}` : values[f.key]}
                                            alt=""
                                            className="h-20 rounded-lg object-cover"
                                        />
                                    )}
                                </div>
                            ) : f.multiline ? (
                                <textarea
                                    value={values[f.key] || ""}
                                    onChange={(e) =>
                                        setValues({ ...values, [f.key]: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={values[f.key] || ""}
                                    onChange={(e) =>
                                        setValues({ ...values, [f.key]: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-6">
                    <SaveBtn loading={saving} onClick={handleSave} />
                </div>
            </div>
        </div>
    );
}

/* ── Icon options for statistics ────────────────────────────── */

const STAT_ICONS: { key: string; label: string; path: string }[] = [
    {
        key: "employees",
        label: "Xodimlar",
        path: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z",
    },
    {
        key: "garments",
        label: "Kiyimlar",
        path: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6",
    },
    {
        key: "fabric",
        label: "Mato",
        path: "M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0L12 17.25 6.429 14.25m11.142 0l4.179 2.25L12 21.75l-9.75-5.25 4.179-2.25",
    },
];

/* ── Statistics Panel ──────────────────────────────────────── */

function StatisticsPanel({ toast }: { toast: (m: string) => void }) {
    const [items, setItems] = useState<StatisticAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState({
        label_uz: "",
        label_ru: "",
        label_en: "",
        value: 0,
        suffix: "",
        icon_key: "default",
        sort_order: 0,
    });

    const load = useCallback(async () => {
        const data = await fetchStatistics();
        setItems(data);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const resetForm = () => {
        setEditId(null);
        setForm({ label_uz: "", label_ru: "", label_en: "", value: 0, suffix: "", icon_key: "default", sort_order: 0 });
    };

    const handleSave = async () => {
        try {
            if (editId) {
                await updateStatistic(editId, form);
            } else {
                await createStatistic(form);
            }
            resetForm();
            await load();
            toast(editId ? "Statistika yangilandi!" : "Statistika qo'shildi!");
        } catch {
            toast("Statistikani saqlashda xatolik");
        }
    };

    const handleEdit = (s: StatisticAdmin) => {
        setEditId(s.id);
        setForm({
            label_uz: s.label_uz,
            label_ru: s.label_ru,
            label_en: s.label_en,
            value: s.value,
            suffix: s.suffix,
            icon_key: s.icon_key,
            sort_order: s.sort_order,
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu statistikani o'chirmoqchimisiz?")) return;
        await deleteStatistic(id);
        await load();
        toast("Statistika o'chirildi");
    };

    if (loading) return <Spinner />;

    return (
        <div className="space-y-4">
            {/* Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {editId ? "Statistikani tahrirlash" : "Statistika qo'shish"}
                </h3>
                <div className="grid gap-3 md:grid-cols-3">
                    <Input label="Yorliq (UZ)" value={form.label_uz} onChange={(v) => setForm({ ...form, label_uz: v })} />
                    <Input label="Yorliq (RU)" value={form.label_ru} onChange={(v) => setForm({ ...form, label_ru: v })} />
                    <Input label="Yorliq (EN)" value={form.label_en} onChange={(v) => setForm({ ...form, label_en: v })} />
                    <Input label="Qiymat" type="number" value={String(form.value)} onChange={(v) => setForm({ ...form, value: Number(v) })} />
                    <Input label="Qo'shimcha" value={form.suffix} onChange={(v) => setForm({ ...form, suffix: v })} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Ikonka</label>
                        <div className="flex gap-2">
                            {STAT_ICONS.map((ic) => (
                                <button
                                    key={ic.key}
                                    type="button"
                                    onClick={() => setForm({ ...form, icon_key: ic.key })}
                                    className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border-2 transition-all ${form.icon_key === ic.key
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                        }`}
                                >
                                    <svg
                                        className={`w-6 h-6 ${form.icon_key === ic.key ? "text-primary" : "text-gray-400"}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d={ic.path} />
                                    </svg>
                                    <span className={`text-[10px] font-medium ${form.icon_key === ic.key ? "text-primary" : "text-gray-500"}`}>
                                        {ic.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <SaveBtn loading={false} onClick={handleSave} label={editId ? "Yangilash" : "Qo'shish"} />
                    {editId && (
                        <button onClick={resetForm} className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                            Bekor qilish
                        </button>
                    )}
                </div>
            </div>

            {/* Ro'yxat */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3 font-medium text-gray-500">Yorliq</th>
                            <th className="text-left px-6 py-3 font-medium text-gray-500">Qiymat</th>
                            <th className="text-left px-6 py-3 font-medium text-gray-500">Ikonka</th>
                            <th className="text-right px-6 py-3 font-medium text-gray-500">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((s) => {
                            const iconData = STAT_ICONS.find((i) => i.key === s.icon_key);
                            return (
                                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-900">{s.label_en}</td>
                                    <td className="px-6 py-4 text-gray-600">{s.value}{s.suffix}</td>
                                    <td className="px-6 py-4">
                                        {iconData ? (
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d={iconData.path} />
                                                </svg>
                                                <span className="text-xs text-gray-400">{iconData.label}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-xs">{s.icon_key}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(s)} className="text-primary hover:underline">Tahrirlash</button>
                                        <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:underline">O'chirish</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ── Clients Panel ─────────────────────────────────────────── */

function ClientsPanel({ toast }: { toast: (m: string) => void }) {
    const [items, setItems] = useState<ClientAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState({ name: "", logo_url: "" as string | null, sort_order: 0 });
    const [logoUploading, setLogoUploading] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const load = useCallback(async () => {
        const data = await fetchClients();
        setItems(data);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const resetForm = () => {
        setEditId(null);
        setForm({ name: "", logo_url: "", sort_order: 0 });
    };

    const handleSave = async () => {
        try {
            const payload = { ...form, logo_url: form.logo_url || null };
            if (editId) {
                await updateClient(editId, payload);
            } else {
                await createClient(payload);
            }
            resetForm();
            await load();
            toast(editId ? "Mijoz yangilandi!" : "Mijoz qo'shildi!");
        } catch {
            toast("Mijozni saqlashda xatolik");
        }
    };

    const handleEdit = (c: ClientAdmin) => {
        setEditId(c.id);
        setForm({ name: c.name, logo_url: c.logo_url || "", sort_order: c.sort_order });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu mijozni o'chirmoqchimisiz?")) return;
        await deleteClient(id);
        await load();
        toast("Mijoz o'chirildi");
    };

    if (loading) return <Spinner />;

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {editId ? "Mijozni tahrirlash" : "Mijoz qo'shish"}
                </h3>
                <div className="grid gap-3 md:grid-cols-3">
                    <Input label="Nomi" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={form.logo_url || ""}
                                onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                                placeholder="Logo URL yoki yuklash"
                                className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            />
                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setLogoUploading(true);
                                    try {
                                        const url = await uploadFile(file);
                                        setForm((prev) => ({ ...prev, logo_url: url }));
                                        toast("Logo yuklandi!");
                                    } catch {
                                        toast("Logo yuklashda xatolik");
                                    }
                                    setLogoUploading(false);
                                    if (logoInputRef.current) logoInputRef.current.value = "";
                                }}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => logoInputRef.current?.click()}
                                disabled={logoUploading}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors shrink-0"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                {logoUploading ? "..." : "Yuklash"}
                            </button>
                        </div>
                        {form.logo_url && (
                            <img
                                src={form.logo_url.startsWith("/uploads/") ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${form.logo_url}` : form.logo_url}
                                alt=""
                                className="mt-2 h-10 object-contain"
                            />
                        )}
                    </div>
                    <Input label="Tartib raqami" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} />
                </div>
                <div className="flex gap-2 mt-4">
                    <SaveBtn loading={false} onClick={handleSave} label={editId ? "Yangilash" : "Qo'shish"} />
                    {editId && (
                        <button onClick={resetForm} className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                            Bekor qilish
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3 font-medium text-gray-500">Nomi</th>
                            <th className="text-left px-6 py-3 font-medium text-gray-500">Logo</th>
                            <th className="text-right px-6 py-3 font-medium text-gray-500">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-900">{c.name}</td>
                                <td className="px-6 py-4">
                                    {c.logo_url ? (
                                        <img src={c.logo_url} alt={c.name} className="h-8 object-contain" />
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => handleEdit(c)} className="text-primary hover:underline">Tahrirlash</button>
                                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline">O'chirish</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ── Shared Input Component ────────────────────────────────── */

function Input({
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
        </div>
    );
}

/* ── Dashboard Page ────────────────────────────────────────── */

export default function AdminDashboard() {
    const [tab, setTab] = useState<"settings" | "statistics" | "clients">("settings");
    const [toastMsg, setToastMsg] = useState("");

    const toast = useCallback((m: string) => setToastMsg(m), []);

    const TABS = [
        { id: "settings" as const, label: "Sayt sozlamalari" },
        { id: "statistics" as const, label: "Statistika" },
        { id: "clients" as const, label: "Mijozlar" },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Tab switcher */}
            <div className="flex gap-1 bg-white rounded-2xl border border-gray-200 p-1.5">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === t.id
                            ? "bg-primary text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === "settings" && <SettingsPanel toast={toast} />}
            {tab === "statistics" && <StatisticsPanel toast={toast} />}
            {tab === "clients" && <ClientsPanel toast={toast} />}

            {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
        </div>
    );
}
