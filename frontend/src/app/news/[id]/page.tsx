import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NewsDetailContent from "./NewsDetailContent";
import { fetchNewsArticle, fetchNews, type NewsArticle } from "@/lib/api";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId)) return { title: "Not Found" };

    try {
        const article = await fetchNewsArticle(numId);
        return {
            title: `${article.title_en} — Kezar Teks`,
            description: article.excerpt_en,
            openGraph: {
                title: article.title_en,
                description: article.excerpt_en,
                images: article.image ? [{ url: article.image }] : [],
            },
        };
    } catch {
        return { title: "Not Found" };
    }
}

export default async function NewsDetailPage({ params }: Props) {
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId)) notFound();

    let article: NewsArticle;
    let relatedArticles: NewsArticle[];
    try {
        article = await fetchNewsArticle(numId);
        const newsPage = await fetchNews(article.category);
        relatedArticles = newsPage.articles
            .filter((a) => a.id !== article.id)
            .slice(0, 3);
    } catch {
        notFound();
    }

    return (
        <>
            <Navbar />
            <main>
                <NewsDetailContent article={article} related={relatedArticles} />
            </main>
            <Footer />
        </>
    );
}
