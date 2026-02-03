import Header from "@/lib/components/shared/Header";
import { Breadcrumb } from "@/lib/components/shared/Breadcrumb";
import { BreadcrumbTitleProvider } from "@/lib/components/shared/BreadcrumbTitleContext";
import "../globals.css";
import { Footer } from "@/lib/components/shared/Footer";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <head>
        {/* Sanity image CDN */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />

        {/* Vercel Analytics */}
        <link
          rel="preconnect"
          href="https://vitals.vercel-insights.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
      </head>
      <body>
        <BreadcrumbTitleProvider>
          <Header />
          <main className="flex flex-col">
            <Breadcrumb />
            <div className="flex-1 py-8">{children}</div>
          </main>
          <Footer />
        </BreadcrumbTitleProvider>
        <Analytics />
      </body>
    </html>
  );
}
