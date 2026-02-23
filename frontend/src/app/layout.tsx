import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const avenirNextCyr = localFont({
  src: [
    { path: "../../public/fonts/AvenirNextCyr-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/AvenirNextCyr-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/AvenirNextCyr-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/AvenirNextCyr-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/AvenirNextCyr-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "../../public/fonts/AvenirNextCyr-Heavy.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-avenir",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kezar Teks — Textile Manufacturing",
    template: "%s | Kezar Teks",
  },
  description:
    "Kezar Teks MChJ — Trikotaj matosini to'qish, bo'yash, gul bosish va tayyor trikotaj mahsulotlari ishlab chiqarish. 1998 yildan beri.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kezar.uz"),
  openGraph: {
    type: "website",
    siteName: "Kezar Teks",
    title: "Kezar Teks — Textile Manufacturing",
    description: "Quality knitwear manufacturing since 1998. Knitting, dyeing, printing and garment production.",
    images: ["/images/logo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kezar Teks — Textile Manufacturing",
    description: "Quality knitwear manufacturing since 1998.",
    images: ["/images/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={`${avenirNextCyr.variable} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
