import { globalSettingsQuery } from "@/lib/queries/globalSettings";
import { sanityClient } from "@/lib/sanity/client";
import type { Metadata } from "next";
import { GlobalSettings } from "~/sanity.types";
import { ContactPageClient } from "./ContactPageClient";

export default async function ContactPage() {
  const settings: GlobalSettings | null =
    await sanityClient.fetch(globalSettingsQuery);

  if (!settings) {
    return null;
  }

  return <ContactPageClient settings={settings} />;
}
