import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rumbo Digital Studio | Desarrollo Web Premium",
  description: "Agencia de desarrollo web especializada en crear sitios modernos, rápidos y optimizados para tu negocio. Next.js, React, TypeScript.",
  keywords: ["desarrollo web", "agencia digital", "next.js", "react", "typescript", "landing page", "ecommerce"],
  authors: [{ name: "Rumbo Digital Studio" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://rumbodigital.com",
    title: "Rumbo Digital Studio | Desarrollo Web Premium",
    description: "Transformamos ideas en experiencias digitales que impulsan tu negocio",
    siteName: "Rumbo Digital Studio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
