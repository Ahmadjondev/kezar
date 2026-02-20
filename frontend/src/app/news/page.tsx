import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import News from "@/components/ui/News";
import { fetchNews } from "@/lib/api";

export const metadata: Metadata = {
    title: "News — Kezar Teks",
    description: "Stay updated with the latest news from Kezar Teks and the textile industry.",
};

export default async function NewsPage() {
    const { settings, articles } = await fetchNews();

    return (
        <>
            <Navbar />
            <main>
                <News articles={articles} settings={settings} />
            </main>
            <Footer />
        </>
    );
}
