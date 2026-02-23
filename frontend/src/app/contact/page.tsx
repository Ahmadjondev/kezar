import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
    title: "Contact — Kezar Teks",
    description: "Get in touch with Kezar Teks. Send us a message or visit our office in Andijan, Uzbekistan.",
};

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <main>
                <ContactContent />
            </main>
            <Footer />
        </>
    );
}
