import { sanityClient } from "@/lib/sanity/client";
import { footerQuery, FooterData } from "@/lib/queries/navigation";
import { globalSettingsQuery, GlobalSettingsData } from "@/lib/queries/globalSettings";
import { SocialLinks, type SocialLinksData } from "./SocialLinks";
import {
  FooterNav,
  FooterContactInfo,
  FooterContent,
  FooterLegal,
} from "./FooterParts";
import { PageContainer } from "./PageContainer";

export async function Footer() {
  const [footer, settings] = await Promise.all([
    sanityClient.fetch<FooterData | null>(footerQuery, {}, {
      next: { revalidate: 86400, tags: ["layout"] },
    }),
    sanityClient.fetch<GlobalSettingsData | null>(globalSettingsQuery, {}, {
      next: { revalidate: 86400, tags: ["layout"] },
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
    <footer className="border-t border-border bg-muted/30 mt-8 md:mt-12">
      <PageContainer as="div" paddingY="default">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          <FooterNav columns={footer.columns} mainNavigation={settings?.mainNavigation} />

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

        </div>

        {footer.footerText && (
          <FooterContent content={footer.footerText} />
        )}

        {footer.legalText && <FooterLegal text={footer.legalText} />}
      </PageContainer>
    </footer>
  );
}
