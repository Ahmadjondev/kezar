import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Gallery from "@/components/ui/Gallery";
import { fetchGallery } from "@/lib/api";

export const metadata: Metadata = {
    title: "Gallery — Kezar Teks",
    description: "Explore our textile manufacturing facilities, fabrics, garments, and team.",
};

export default async function GalleryPage() {
    const { settings, images } = await fetchGallery();

    return (
        <>
            <Navbar />
            <main>
                <Gallery images={images} settings={settings} />
            </main>
            <Footer />
        </>
    );
}
