"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { SiteSetting } from "@/lib/api";

/* ─── Animated counter hook ─────────────────────────────────── */
function useCountUp(target: number, duration = 2000, trigger = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, trigger]);

  return count;
}

/* ─── Stat card sub-component ───────────────────────────────── */
function StatCard({
  value,
  label,
  suffix,
  trigger,
  delay,
  plain,
}: {
  value: number;
  label: string;
  suffix?: string;
  trigger: boolean;
  delay: number;
  plain?: boolean;
}) {
  const [active, setActive] = useState(false);
  const count = useCountUp(value, 1800, active);

  useEffect(() => {
    if (!trigger) return;
    const t = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(t);
  }, [trigger, delay]);

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center transition-all duration-600 hover:shadow-lg hover:-translate-y-0.5 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
    >
      <span className="text-4xl md:text-5xl font-bold text-primary tabular-nums leading-none">
        {plain ? count : count.toLocaleString()}
        {suffix && (
          <span className="text-xl ml-1 font-medium text-primary/60">
            {suffix}
          </span>
        )}
      </span>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 tracking-wide uppercase">
        {label}
      </p>
    </div>
  );
}

/* ─── Main About Content ────────────────────────────────────── */
export default function AboutContent({ settings }: { settings: SiteSetting }) {
  const { t, locale } = useLanguage();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  // Hero animation
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Stats intersection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* ── Hero Section ──────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[#1a1e20]">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23004881' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
        </div>

        <div
          className={`relative max-w-6xl mx-auto px-6 md:px-12 transition-all duration-1000 ${heroVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
        >
          <p className="text-primary/80 text-sm font-medium tracking-[0.2em] uppercase mb-4">
            {t.about.companyName}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-white tracking-tight leading-tight mb-6">
            {t.about.heroTitle}
          </h1>
          <p className="text-white/50 text-lg md:text-xl max-w-2xl font-light">
            {t.about.heroSubtitle}
          </p>
        </div>
      </section>

      {/* ── Overview + Stats ──────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {/* Overview text */}
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 dark:text-gray-100 mb-6 transition-colors">
              {t.about.overviewTitle}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed transition-colors">
              {t.about.overviewDesc}
            </p>
          </div>

          {/* Stat cards */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            <StatCard
              value={1998}
              label={t.about.founded}
              trigger={statsVisible}
              delay={0}
              plain
            />
            <StatCard
              value={parseInt(settings.total_workers || "505")}
              label={t.about.employees}
              trigger={statsVisible}
              delay={100}
            />
            <StatCard
              value={1.74}
              label={t.about.landArea}
              suffix="ga"
              trigger={statsVisible}
              delay={200}
            />
            <StatCard
              value={5400}
              label={t.about.charterFund}
              suffix="M"
              trigger={statsVisible}
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ── Company Details ───────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-950 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 dark:text-gray-100 uppercase tracking-wider mb-12 transition-colors">
            {t.about.detailsTitle}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column — Registration details */}
            <div className="space-y-0 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              {[
                { label: t.about.stir, value: settings.about_stir || "203032009" },
                { label: t.about.okonx, value: settings.about_okonx || "17151" },
                { label: t.about.oked, value: settings.about_oked || "14390" },
                { label: t.about.legalAddress, value: settings[`about_address_${locale}`] || settings.about_address_uz || "" },
                { label: t.about.director, value: settings.about_director || "" },
                { label: t.about.email, value: settings.contact_email || "kezar@list.ru", isEmail: true },
                {
                  label: t.about.website,
                  value: settings.contact_website || "www.kezar.uz",
                  isLink: true,
                },
                {
                  label: t.about.chiefAccountant,
                  value: settings.about_chief_accountant || "",
                },
                { label: t.about.ownershipForm, value: settings.about_ownership_form || "MChJ (LLC)" },
                {
                  label: t.about.founders,
                  value: settings.about_founders || "",
                },
                { label: t.about.reRegistered, value: settings.about_registration_date || "2006" },
              ].map((row, i) => (
                <div
                  key={row.label}
                  className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-6 py-4 ${i % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-900/50"
                    : "bg-white dark:bg-gray-950"
                    } transition-colors`}
                >
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider uppercase min-w-44 shrink-0">
                    {row.label}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {row.isEmail ? (
                      <a
                        href={`mailto:${row.value}`}
                        className="text-primary hover:underline"
                      >
                        {row.value}
                      </a>
                    ) : row.isLink ? (
                      <a
                        href={`https://${row.value}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Right column — Activity, Capacity, Workforce */}
            <div className="space-y-6">
              {/* Activity */}
              <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-6 transition-colors">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-3">
                  {t.about.activityTitle}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {t.about.activityDesc}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider uppercase">
                    {t.about.rawMaterials}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t.about.rawMaterialsValue}
                  </p>
                </div>
              </div>

              {/* Capacity */}
              <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-6 transition-colors">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-4">
                  {t.about.capacityTitle}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4">
                    <p className="text-2xl font-bold text-primary">5,000</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t.about.fabricCapacity}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                      {t.about.fabricCapacityValue}
                    </p>
                  </div>
                  <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4">
                    <p className="text-2xl font-bold text-primary">5M</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t.about.garmentCapacity}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                      {t.about.garmentCapacityValue}
                    </p>
                  </div>
                </div>
              </div>

              {/* Workforce */}
              <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-6 transition-colors">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-4">
                  {t.about.workforceTitle}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t.about.totalWorkers}
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {settings.total_workers || "505"}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t.about.adminStaff}
                        </p>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {settings.admin_staff || "12"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t.about.productionStaff}
                        </p>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {settings.production_staff || "493"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Export Markets ─────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 dark:text-gray-100 uppercase tracking-wider mb-4 transition-colors">
            {t.about.marketsTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {/* Domestic */}
            <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {t.about.domesticMarket}
                </h3>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t.about.domesticMarketDesc}
              </p>
            </div>

            {/* Export */}
            <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {t.about.exportMarket}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(settings.about_export_countries || "Russia,Azerbaijan,Kyrgyzstan,Kazakhstan,Ukraine,Moldova").split(",").map((country) => (
                  <span
                    key={country.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300"
                  >
                    {country.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
