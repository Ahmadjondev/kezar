const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ── Auth helpers ──────────────────────────────────────────── */

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export function setToken(token: string) {
  localStorage.setItem("admin_token", token);
}

export function removeToken() {
  localStorage.removeItem("admin_token");
}

/* ── Generic fetch with JWT ────────────────────────────────── */

async function adminFetch<T>(
  path: string,
  opts: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API}${path}`, { ...opts, headers });

  if (res.status === 401) {
    removeToken();
    if (typeof window !== "undefined") window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/* ── Login ─────────────────────────────────────────────────── */

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${API}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "Login failed");
  }
  return res.json();
}

/* ── Site Settings ─────────────────────────────────────────── */

export interface SiteSettingAdmin {
  id: number;
  key: string;
  value: string;
  group: string;
}

export const fetchSettings = (group?: string) =>
  adminFetch<SiteSettingAdmin[]>(
    `/api/admin/settings${group ? `?group=${group}` : ""}`,
  );

export const updateSetting = (key: string, value: string) =>
  adminFetch<SiteSettingAdmin>(`/api/admin/settings/${key}`, {
    method: "PUT",
    body: JSON.stringify({ value }),
  });

export const bulkUpdateSettings = (
  settings: { key: string; value: string; group: string }[],
) =>
  adminFetch<SiteSettingAdmin[]>("/api/admin/settings", {
    method: "PUT",
    body: JSON.stringify({ settings }),
  });

export const deleteSetting = (key: string) =>
  adminFetch<void>(`/api/admin/settings/${key}`, { method: "DELETE" });

/* ── Statistics ────────────────────────────────────────────── */

export interface StatisticAdmin {
  id: number;
  label_uz: string;
  label_ru: string;
  label_en: string;
  value: number;
  suffix: string;
  icon_key: string;
  sort_order: number;
}

export const fetchStatistics = () =>
  adminFetch<StatisticAdmin[]>("/api/admin/statistics");

export const createStatistic = (data: Omit<StatisticAdmin, "id">) =>
  adminFetch<StatisticAdmin>("/api/admin/statistics", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateStatistic = (id: number, data: Partial<StatisticAdmin>) =>
  adminFetch<StatisticAdmin>(`/api/admin/statistics/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteStatistic = (id: number) =>
  adminFetch<void>(`/api/admin/statistics/${id}`, { method: "DELETE" });

/* ── Clients ───────────────────────────────────────────────── */

export interface ClientAdmin {
  id: number;
  name: string;
  logo_url: string | null;
  sort_order: number;
}

export const fetchClients = () =>
  adminFetch<ClientAdmin[]>("/api/admin/clients");

export const createClient = (data: Omit<ClientAdmin, "id">) =>
  adminFetch<ClientAdmin>("/api/admin/clients", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateClient = (id: number, data: Partial<ClientAdmin>) =>
  adminFetch<ClientAdmin>(`/api/admin/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteClient = (id: number) =>
  adminFetch<void>(`/api/admin/clients/${id}`, { method: "DELETE" });

/* ── Products ──────────────────────────────────────────────── */

export interface ProductAdmin {
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

export const fetchProducts = () =>
  adminFetch<ProductAdmin[]>("/api/admin/products");

export const createProduct = (data: Omit<ProductAdmin, "id">) =>
  adminFetch<ProductAdmin>("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateProduct = (id: number, data: Partial<ProductAdmin>) =>
  adminFetch<ProductAdmin>(`/api/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteProduct = (id: number) =>
  adminFetch<void>(`/api/admin/products/${id}`, { method: "DELETE" });

/* ── Factories ─────────────────────────────────────────────── */

export interface FactoryAdmin {
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

export const fetchFactories = () =>
  adminFetch<FactoryAdmin[]>("/api/admin/factories");

export const createFactory = (data: Omit<FactoryAdmin, "id">) =>
  adminFetch<FactoryAdmin>("/api/admin/factories", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateFactory = (id: number, data: Partial<FactoryAdmin>) =>
  adminFetch<FactoryAdmin>(`/api/admin/factories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteFactory = (id: number) =>
  adminFetch<void>(`/api/admin/factories/${id}`, { method: "DELETE" });

/* ── Gallery ───────────────────────────────────────────────── */

export interface GalleryImageAdmin {
  id: number;
  src: string;
  alt: string;
  category: string;
  span: string;
  sort_order: number;
}

export const fetchGallery = () =>
  adminFetch<GalleryImageAdmin[]>("/api/admin/gallery");

export const createGalleryImage = (data: Omit<GalleryImageAdmin, "id">) =>
  adminFetch<GalleryImageAdmin>("/api/admin/gallery", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateGalleryImage = (
  id: number,
  data: Partial<GalleryImageAdmin>,
) =>
  adminFetch<GalleryImageAdmin>(`/api/admin/gallery/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteGalleryImage = (id: number) =>
  adminFetch<void>(`/api/admin/gallery/${id}`, { method: "DELETE" });

/* ── News ──────────────────────────────────────────────────── */

export interface NewsArticleAdmin {
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

export const fetchNews = () =>
  adminFetch<NewsArticleAdmin[]>("/api/admin/news");

export const createNewsArticle = (data: Omit<NewsArticleAdmin, "id">) =>
  adminFetch<NewsArticleAdmin>("/api/admin/news", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateNewsArticle = (
  id: number,
  data: Partial<NewsArticleAdmin>,
) =>
  adminFetch<NewsArticleAdmin>(`/api/admin/news/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteNewsArticle = (id: number) =>
  adminFetch<void>(`/api/admin/news/${id}`, { method: "DELETE" });

/* ── Upload ────────────────────────────────────────────────── */

export const uploadFile = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append("file", file);
  const res = await adminFetch<{ url: string }>("/api/admin/upload", {
    method: "POST",
    body: form,
  });
  return res.url;
};

/* ── Contacts ──────────────────────────────────────────────── */

export interface ContactAdmin {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const fetchContacts = () =>
  adminFetch<ContactAdmin[]>("/api/admin/contacts");

export const fetchUnreadCount = () =>
  adminFetch<{ count: number }>("/api/admin/contacts/unread-count");

export const updateContact = (id: number, data: { is_read?: boolean }) =>
  adminFetch<ContactAdmin>(`/api/admin/contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteContact = (id: number) =>
  adminFetch<void>(`/api/admin/contacts/${id}`, { method: "DELETE" });
