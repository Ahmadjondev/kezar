import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FactoriesContent from "./FactoriesContent";
import { fetchFactories } from "@/lib/api";

export const metadata: Metadata = {
    title: "Factories — Kezar Teks MChJ",
    description:
        "Kezar Teks MChJ fabrikalari — trikotaj to'qish, bo'yash, gul bosish va tayyor mahsulotlar ishlab chiqarish",
};

export default async function FactoriesPage() {
    const { settings, factories } = await fetchFactories();

    return (
        <>
            <Navbar />
            <main>
                <FactoriesContent factories={factories} settings={settings} />
            </main>
            <Footer />
        </>
    );
}
