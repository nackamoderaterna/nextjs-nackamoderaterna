import Link from "next/link";
import { sanityClient, REVALIDATE_TIME } from "@/lib/sanity/client";
import { footerQuery, getMenuItemHref, FooterData } from "@/lib/queries/navigation";
import { PortableText } from "next-sanity";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Linkedin, // Using Linkedin icon as fallback for Twitter/X
};

export async function Footer() {
  const footer = await sanityClient.fetch<FooterData | null>(footerQuery, {}, {
    next: { revalidate: REVALIDATE_TIME },
  });

  if (!footer) {
    return null;
  }

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
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Kontaktuppgifter
            </h3>
            <address className="not-italic text-sm text-muted-foreground space-y-1">
              <p>Stockholmsvägen 8</p>
              <p>Box 4372</p>
              <p>131 04, Nacka</p>
              <p className="mt-3">
                <a
                  href="mailto:nacka@moderaterna.se"
                  className="hover:text-foreground transition-colors underline"
                >
                  nacka@moderaterna.se
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Footer Text */}
        {footer.footerText && footer.footerText.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border">
            <div className="prose prose-sm prose-neutral max-w-none">
              <PortableText value={footer.footerText} />
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
