import { sanityClient } from "@/lib/sanity/client";
import { footerQuery, FooterData } from "@/lib/queries/navigation";
import { globalSettingsQuery } from "@/lib/queries/globalSettings";
import { SocialLinks, type SocialLinksData } from "./SocialLinks";
import {
  FooterNav,
  FooterContactInfo,
  FooterPressContact,
  FooterContent,
  FooterLegal,
} from "./FooterParts";
import { GlobalSettings } from "~/sanity.types";

export async function Footer() {
  const [footer, settings] = await Promise.all([
    sanityClient.fetch<FooterData | null>(footerQuery, {}, {
      next: { revalidate: 300 },
    }),
    sanityClient.fetch<GlobalSettings | null>(globalSettingsQuery, {}, {
      next: { revalidate: 300 },
    }),
  ]);

  if (!footer) {
    return null;
  }

  const hasContactInfo =
    settings?.contactInfo ||
    settings?.postAddress ||
    settings?.visitingAddress;

  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <FooterNav columns={footer.columns} />

          {settings?.socialLinks && (
            <SocialLinks
              links={settings.socialLinks as SocialLinksData}
              variant="compact"
              heading="Sociala media"
            />
          )}

          {hasContactInfo && (
            <FooterContactInfo
              visitingAddress={settings?.visitingAddress}
              postAddress={settings?.postAddress}
              contactInfo={settings?.contactInfo}
            />
          )}

          {settings?.pressContactInfo &&
            (settings.pressContactInfo.contactPerson ||
              settings.pressContactInfo.email ||
              settings.pressContactInfo.phone) && (
              <FooterPressContact
                pressContactInfo={settings.pressContactInfo}
              />
            )}
        </div>

        {footer.footerText && (
          <FooterContent content={footer.footerText} />
        )}

        {footer.legalText && <FooterLegal text={footer.legalText} />}
      </div>
    </footer>
  );
}
