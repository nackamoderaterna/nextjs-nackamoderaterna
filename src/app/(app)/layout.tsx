import Header from "@/lib/components/shared/Header";
import "../globals.css";
import { Footer } from "@/lib/components/shared/Footer";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";

const interDisplay = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-display",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interDisplay.variable}>
      <head>
        {/* Google Fonts (next/font/google) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Sanity image CDN */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />

        {/* Vercel Analytics */}
        <link rel="preconnect" href="https://vitals.vercel-insights.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
      </head>
      <body className={interDisplay.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
