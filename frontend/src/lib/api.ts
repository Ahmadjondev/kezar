const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/** Generic fetch wrapper with error handling. */
async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ── Types ─────────────────────────────────────────────────────

export interface SiteSetting {
  [key: string]: string;
}

export interface Statistic {
  id: number;
  label_uz: string;
  label_ru: string;
  label_en: string;
  value: number;
  suffix: string;
  icon_key: string;
  sort_order: number;
}

export interface Client {
  id: number;
  name: string;
  logo_url: string | null;
  sort_order: number;
}

export interface LandingPage {
  settings: SiteSetting;
  statistics: Statistic[];
  clients: Client[];
}

export interface Product {
  id: number;
  product_type: string;
  name: string;
  image: string;
  composition: string;
  weight: string | null;
  width: string | null;
  colors: number;
  sizes: string | null;
  min_order: string;
  sort_order: number;
}

export interface Factory {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  desc_uz: string;
  desc_ru: string;
  desc_en: string;
  image: string;
  capacity: string;
  area: string;
  equipment: string;
  workers: number;
  sort_order: number;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  span: string;
  sort_order: number;
}

export interface NewsArticle {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  excerpt_uz: string;
  excerpt_ru: string;
  excerpt_en: string;
  image: string;
  category: string;
  published_at: string;
}

export interface AboutPage {
  settings: SiteSetting;
}

export interface ProductsPage {
  settings: SiteSetting;
  products: Product[];
}

export interface FactoriesPage {
  settings: SiteSetting;
  factories: Factory[];
}

export interface GalleryPage {
  settings: SiteSetting;
  images: GalleryImage[];
}

export interface NewsPage {
  settings: SiteSetting;
  articles: NewsArticle[];
}

// ── Page-level fetchers (one API call per page) ───────────────

export const fetchLandingPage = () =>
  apiFetch<LandingPage>("/api/page/landing");

export const fetchProducts = (type?: string) =>
  apiFetch<ProductsPage>(`/api/page/products${type ? `?product_type=${type}` : ""}`);

export const fetchFactories = () =>
  apiFetch<FactoriesPage>("/api/page/factories");

export const fetchGallery = (category?: string) =>
  apiFetch<GalleryPage>(`/api/page/gallery${category ? `?category=${category}` : ""}`);

export const fetchNews = (category?: string) =>
  apiFetch<NewsPage>(`/api/page/news${category ? `?category=${category}` : ""}`);

export const fetchNewsArticle = (id: number) =>
  apiFetch<NewsArticle>(`/api/page/news/${id}`);

export const fetchAboutPage = () =>
  apiFetch<AboutPage>("/api/page/about");

/* ── Contact form (public POST) ────────────────────────────── */

export interface ContactSubmit {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function submitContact(data: ContactSubmit): Promise<void> {
  const res = await fetch(`${API_BASE}/api/page/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `API error ${res.status}`);
  }
}
