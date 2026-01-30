import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { footerQuery, getMenuItemHref, FooterData } from "@/lib/queries/navigation";
import { globalSettingsQuery } from "@/lib/queries/globalSettings";
import { PortableText } from "next-sanity";
import { portableTextComponents } from "./PortableTextComponents";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { GlobalSettings } from "~/sanity.types";

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Linkedin, // Using Linkedin icon as fallback for Twitter/X
};

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

  const formatAddress = (address: {
    street?: string;
    zip?: string;
    city?: string;
    country?: string;
  } | null | undefined) => {
    if (!address) return null;
    const parts = [
      address.street,
      address.zip && address.city
        ? `${address.zip} ${address.city}`
        : address.zip || address.city,
      address.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts : null;
  };

  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Dynamic Footer Columns */}
          {footer.columns && footer.columns.length > 0 ? (
            footer.columns.map((column, index) => (
              <div key={index}>
                {column.title && (
                  <h3 className="font-semibold text-foreground mb-4">
                    {column.title}
                  </h3>
                )}
                {column.items && column.items.length > 0 && (
                  <ul className="space-y-2">
                    {column.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link
                          href={getMenuItemHref(item)}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          {...(item.linkType === "external" && {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          })}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            // Fallback: Default shortcuts
            <>
              <div>
                <h3 className="font-semibold text-foreground mb-4">Meny</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Hem
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/politik"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Politik
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/nyheter"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Nyheter
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/politiker"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Politiker
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">Övrigt</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/event"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Evenemang
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/kontakt"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Kontakt
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Social Media */}
          {footer.socialLinks && footer.socialLinks.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Sociala media
              </h3>
              <div className="flex gap-3">
                {footer.socialLinks.map((social, index) => {
                  if (!social.url || !social.platform) return null;
                  const IconComponent =
                    socialIcons[social.platform.toLowerCase()];
                  if (!IconComponent) return null;

                  return (
                    <Link
                      key={index}
                      href={social.url}
                      className="w-9 h-9 rounded-full bg-secondary hover:bg-accent flex items-center justify-center transition-colors"
                      aria-label={social.platform}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent className="w-4 h-4" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {(settings?.contactInfo || settings?.postAddress || settings?.visitingAddress) && (
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Kontaktuppgifter
              </h3>
              <div className="not-italic text-sm text-muted-foreground space-y-1 flex gap-4">
                <div>
                {settings?.visitingAddress && formatAddress(settings.visitingAddress) && (
                  <div>
                    <p className="text-xs font-medium text-foreground/70 mb-1">Besöksadress</p>
                    {formatAddress(settings.visitingAddress)?.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
                {settings?.postAddress && formatAddress(settings.postAddress) && (
                  <div>
                    <p className={`text-xs font-medium text-foreground/70 mb-1 ${settings?.visitingAddress ? 'mt-3' : ''}`}>
                      Postadress
                    </p>
                    {formatAddress(settings.postAddress)?.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
                </div>
                <div>
                
                {settings?.contactInfo?.email && (
                  <div>
                    <p className="text-xs font-medium text-foreground/70 mb-1">E-post</p>
                    <p>
                      <a
                        href={`mailto:${settings.contactInfo.email}`}
                        className="hover:text-foreground transition-colors underline"
                      >
                        {settings.contactInfo.email}
                      </a>
                    </p>
                  </div>
                )}
                {settings?.contactInfo?.phone && (
                  <>
                    <p className="text-xs font-medium text-foreground/70 mb-1 mt-3">Telefon</p>
                    <p>
                      <a
                        href={`tel:${settings.contactInfo.phone.replace(/\s/g, "")}`}
                        className="hover:text-foreground transition-colors underline"
                      >
                        {settings.contactInfo.phone}
                      </a>
                    </p>
                  </>
                )}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Text */}
        {footer.footerText && footer.footerText.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border">
            <div className="prose prose-sm prose-neutral max-w-none">
              <PortableText value={footer.footerText} components={portableTextComponents} />
            </div>
          </div>
        )}

        {/* Legal Text */}
        {footer.legalText && (
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              {footer.legalText}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
