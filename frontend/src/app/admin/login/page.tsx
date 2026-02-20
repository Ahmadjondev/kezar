"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login, setToken } from "@/lib/admin-api";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await login(username, password);
            setToken(res.access_token);
            router.push("/admin");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Kirish xatosi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    {/* Logo / Title */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">Kezar Admin</h1>
                        <p className="text-sm text-gray-500 mt-1">Saytni boshqarish uchun tizimga kiring</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Foydalanuvchi nomi
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                placeholder="admin"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Parol
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Kirish..." : "Kirish"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
