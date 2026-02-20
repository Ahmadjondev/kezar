import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutContent from "./AboutContent";
import { fetchAboutPage } from "@/lib/api";

export const metadata: Metadata = {
  title: "About — Kezar Teks MChJ",
  description:
    "Kezar Teks MChJ haqida — 1998 yildan beri trikotaj matosini to'qish, bo'yash, gul bosish va tayyor trikotaj mahsulotlari ishlab chiqarish",
};

export default async function AboutPage() {
  const { settings } = await fetchAboutPage();

  return (
    <>
      <Navbar />
      <main>
        <AboutContent settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
