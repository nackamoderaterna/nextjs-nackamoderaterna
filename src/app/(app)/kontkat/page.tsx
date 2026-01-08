import { SanityImage } from "@/lib/components/shared/SanityImage";
import { globalSettingsQuery } from "@/lib/queries/globalSettings";
import { sanityClient } from "@/lib/sanity/client";
import { buildImageUrl } from "@/lib/sanity/image";
import { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import type { Metadata } from "next";
import { GlobalSettings } from "~/sanity.types";

export async function generateMetadata(): Promise<Metadata> {
  const settings: GlobalSettings | null =
    await sanityClient.fetch(globalSettingsQuery);

  if (!settings?.seo) {
    return {
      title: "Kontakt",
    };
  }

  return {
    title: settings.seo.metaTitle ?? "Kontakt",
    description: settings.seo.metaDescription,
    openGraph: settings.seo.openGraphImage
      ? {
          images: [buildImageUrl(settings.seo.openGraphImage)],
        }
      : undefined,
  };
}

export default async function ContactPage() {
  const settings: GlobalSettings | null =
    await sanityClient.fetch(globalSettingsQuery);

  if (!settings) {
    return null;
  }

  const { companyName, logo, contactInfo, address, openingHours, socialLinks } =
    settings;

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
      {/* Header */}
      <header className="space-y-4">
        {logo && (
          <div className="w-40">
            <SanityImage image={logo} className="w-full h-auto" />
          </div>
        )}

        <h1 className="text-3xl font-bold">{companyName ?? "Kontakt"}</h1>
      </header>

      {/* Contact Info */}
      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Kontaktuppgifter</h2>

          {contactInfo?.contactPerson && (
            <p>
              <strong>Kontaktperson:</strong> {contactInfo.contactPerson}
            </p>
          )}

          {contactInfo?.phone && (
            <p>
              <strong>Telefon:</strong>{" "}
              <a
                href={`tel:${contactInfo.phone}`}
                className="text-blue-600 hover:underline"
              >
                {contactInfo.phone}
              </a>
            </p>
          )}

          {contactInfo?.email && (
            <p>
              <strong>E-post:</strong>{" "}
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-blue-600 hover:underline"
              >
                {contactInfo.email}
              </a>
            </p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Adress</h2>

          {address && (
            <address className="not-italic text-gray-700">
              <p>{address.street}</p>
              <p>
                {address.zip} {address.city}
              </p>
              <p>{address.country}</p>
            </address>
          )}
        </div>
      </section>

      {/* Opening Hours */}
      {openingHours && openingHours.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Öppettider</h2>

          <ul className="divide-y divide-gray-200 border rounded-lg">
            {openingHours.map((item, index) => (
              <li key={index} className="flex justify-between px-4 py-2">
                <span>{item.day}</span>
                <span className="text-gray-600">{item.hours}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Social Links */}
      {socialLinks && socialLinks.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Följ oss</h2>

          <ul className="flex gap-4">
            {socialLinks.map((social, index) => (
              <li key={index}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {social.platform}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
