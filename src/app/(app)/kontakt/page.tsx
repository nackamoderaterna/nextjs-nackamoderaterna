import { globalSettingsQuery } from "@/lib/queries/globalSettings";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import type { Metadata } from "next";
import { GlobalSettings } from "~/sanity.types";
import { ContactPageClient } from "./ContactPageClient";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { ROUTE_BASE } from "@/lib/routes";
import type { ListingPage } from "@/lib/types/pages";

export async function generateMetadata(): Promise<Metadata> {
  const listing = await sanityClient.fetch<ListingPage>(
    listingPageByKeyQuery,
    { key: "contact" }
  );

  const title =
    listing?.seo?.title ||
    listing?.title ||
    "Kontakta oss | Nackamoderaterna";
  const description =
    listing?.seo?.description ||
    "Har du frågor eller vill komma i kontakt med oss? Fyll i formuläret nedan så återkommer vi så snart som möjligt.";

  return buildMetadata({
    title,
    description,
    url: "/kontakt",
  });
}

export const revalidate = 86400;

export default async function ContactPage() {
  const [settings, listing] = await Promise.all([
    sanityClient.fetch<GlobalSettings | null>(globalSettingsQuery, {}, {
      next: { revalidate: 86400 },
    }),
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "contact" },
      {
        next: { revalidate: 86400 },
      }
    ),
  ]);

  if (!settings) {
    return null;
  }

  return <ContactPageClient settings={settings} listing={listing} />;
}
