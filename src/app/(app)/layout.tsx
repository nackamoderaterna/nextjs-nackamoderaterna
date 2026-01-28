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
      <body className={interDisplay.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
