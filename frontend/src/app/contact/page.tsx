"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { submitContact } from "@/lib/api";

export default function ContactPage() {
    const { t, locale } = useLanguage();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.subject || !form.message) return;
        setSending(true);
        setStatus("idle");
        try {
            await submitContact(form);
            setStatus("success");
            setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        } catch {
            setStatus("error");
        }
        setSending(false);
    };

    const inputClass =
        "w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition placeholder:text-gray-400 dark:placeholder:text-gray-500";

    const contactInfo = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
            ),
            label: "Email",
            value: "kezar@list.ru",
            href: "mailto:kezar@list.ru",
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
            ),
            label: { uz: "Telefon", ru: "Телефон", en: "Phone" }[locale] || "Phone",
            value: "+998 71 123 45 67",
            href: "tel:+998711234567",
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                </svg>
            ),
            label: { uz: "Manzil", ru: "Адрес", en: "Address" }[locale] || "Address",
            value: {
                uz: "Andijon viloyati, Oltinkul tumani, Sadda KFY, Gulbahor ko'chasi 35",
                ru: "Андижанская область, Алтынкульский район, Садда КФХ, ул. Гюльбахор 35",
                en: "Andijan region, Oltinkul district, Sadda MFY, Gulbahor street 35",
            }[locale] || "",
            href: "https://www.google.com/maps/search/?api=1&query=40.8347,71.7333",
        },
    ];

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
                {/* Hero header */}
                <div className="relative bg-[#1a1e20] pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.06]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a8c3f' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                    <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-transparent" />
                    <div className="relative max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-3xl md:text-5xl font-extralight text-white/90 tracking-[0.12em] uppercase">
                            {t.contact.title}
                        </h1>
                        <p className="mt-4 text-gray-400 text-sm md:text-base max-w-xl mx-auto">
                            {t.contact.subtitle}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
                        {/* Contact info sidebar */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    {{ uz: "Biz bilan bog'laning", ru: "Свяжитесь с нами", en: "Get in touch" }[locale]}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                    {{ uz: "Savol yoki takliflaringiz bo'lsa, quyidagi forma orqali yoki to'g'ridan-to'g'ri biz bilan bog'lanishingiz mumkin.", ru: "Если у вас есть вопросы или предложения, вы можете связаться с нами через форму ниже или напрямую.", en: "If you have questions or suggestions, you can reach us through the form or contact us directly." }[locale]}
                                </p>
                            </div>

                            <div className="space-y-5">
                                {contactInfo.map((info, i) => (
                                    <a
                                        key={i}
                                        href={info.href}
                                        target={info.href.startsWith("http") ? "_blank" : undefined}
                                        rel={info.href.startsWith("http") ? "noreferrer" : undefined}
                                        className="flex items-start gap-4 group"
                                    >
                                        <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/15 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            {info.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                                                {info.label}
                                            </p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors duration-200">
                                                {info.value}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Map */}
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                                <iframe
                                    className="absolute inset-0 w-full h-full border-0"
                                    src="https://maps.google.com/maps?q=40.8347,71.7333&z=15&output=embed"
                                    title="Kezar Teks Location"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>

                        {/* Contact form */}
                        <div className="lg:col-span-3">
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-800">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                                {t.contact.namePlaceholder} *
                                            </label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                placeholder={t.contact.namePlaceholder}
                                                required
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                placeholder={t.contact.emailPlaceholder}
                                                required
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                                {t.contact.phonePlaceholder}
                                            </label>
                                            <input
                                                type="tel"
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                placeholder={t.contact.phonePlaceholder}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                                {t.contact.subjectPlaceholder} *
                                            </label>
                                            <input
                                                type="text"
                                                value={form.subject}
                                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                                placeholder={t.contact.subjectPlaceholder}
                                                required
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            {t.contact.messagePlaceholder} *
                                        </label>
                                        <textarea
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            placeholder={t.contact.messagePlaceholder}
                                            required
                                            rows={6}
                                            className={`${inputClass} resize-none`}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4 pt-2">
                                        <button
                                            type="submit"
                                            disabled={sending}
                                            className="px-8 py-3.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors shadow-md shadow-primary/20"
                                        >
                                            {sending ? t.contact.sending : t.contact.button}
                                        </button>
                                        {status === "success" && (
                                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                {t.contact.successMessage}
                                            </span>
                                        )}
                                        {status === "error" && (
                                            <span className="text-sm text-red-500 font-medium">
                                                {t.contact.errorMessage}
                                            </span>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
