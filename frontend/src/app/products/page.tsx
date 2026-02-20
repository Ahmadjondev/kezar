import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Products from "@/components/ui/Products";
import { fetchProducts } from "@/lib/api";

export const metadata: Metadata = {
    title: "Products — Kezar Teks MChJ",
    description:
        "Kezar Teks MChJ mahsulotlari — trikotaj matolar va tayyor kiyimlar",
};

export default async function ProductsPage() {
    const { settings, products } = await fetchProducts();

    return (
        <>
            <Navbar />
            <main>
                <Products products={products} settings={settings} />
            </main>
            <Footer />
        </>
    );
}
