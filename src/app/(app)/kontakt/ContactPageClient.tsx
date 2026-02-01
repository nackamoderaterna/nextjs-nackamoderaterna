import { IconMail, IconMapPin, IconPhone, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { GlobalSettings } from "~/sanity.types";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { ContactInfoItem } from "@/lib/components/shared/ContactInfoItem";
import { ContentWithSidebar } from "@/lib/components/shared/ContentWithSidebar";
import { ListingHeader } from "@/lib/components/shared/ListingHeader";
import { Sidebar } from "@/lib/components/shared/Sidebar";
import type { ListingPage } from "@/lib/types/pages";
import { formatAddress, formatAddressForUrl } from "@/lib/utils/addressUtils";
import { formatPhoneNumber } from "@/lib/utils/phoneUtils";

interface ContactPageClientProps {
  settings: GlobalSettings;
  listing?: ListingPage;
}

export function ContactPageClient({
  settings,
  listing,
}: ContactPageClientProps) {
  const hasContactInfo =
    settings.contactInfo?.contactPerson ||
    settings.contactInfo?.email ||
    settings.contactInfo?.phone ||
    formatAddress(settings.postAddress) ||
    formatAddress(settings.visitingAddress);

  const hasPressContact =
    settings.pressContactInfo?.contactPerson ||
    settings.pressContactInfo?.email ||
    settings.pressContactInfo?.phone;

  const hasSidebarContent = hasContactInfo || hasPressContact;

  const mainContent = (
    <div className=" border border-border p-8 rounded-lg">
      <ContactForm heading="Skicka ett meddelande" className="max-w-lg mx-auto"/>
    </div>
  );

  const sidebarContent = hasSidebarContent ? (
    <div className="grid gap-6">
      {hasContactInfo && (
        <Sidebar heading="Kontaktuppgifter">
          <div className="space-y-4">
                {settings.contactInfo?.contactPerson && (
                  <ContactInfoItem
                    icon={<IconUser className="h-5 w-5 shrink-0" />}
                    label="Kontaktperson"
                  >
                    {settings.contactInfo.contactPerson}
                  </ContactInfoItem>
                )}
                {settings.contactInfo?.email && (
                  <ContactInfoItem
                    icon={<IconMail className="h-5 w-5 shrink-0" />}
                    label="E-post"
                  >
                    <Link href={`mailto:${settings.contactInfo.email}`}>
                      {settings.contactInfo.email}
                    </Link>
                  </ContactInfoItem>
                )}
                {settings.contactInfo?.phone && (
                  <ContactInfoItem
                    icon={<IconPhone className="h-5 w-5 shrink-0" />}
                    label="Telefon"
                  >
                    <Link
                      href={`tel:${settings.contactInfo.phone.replace(/\D/g, "")}`}
                    >
                      {formatPhoneNumber(settings.contactInfo.phone)}
                    </Link>
                  </ContactInfoItem>
                )}
                {(() => {
              const visitingAddr = formatAddress(settings.visitingAddress);
              if (!visitingAddr) return null;
              const addressStr = formatAddressForUrl(settings.visitingAddress);
              if (!addressStr) return null;
              const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(addressStr)}`;
              return (
                <ContactInfoItem
                  icon={<IconMapPin className="h-5 w-5 shrink-0" />}
                  label="Besöksadress"
                >
                  <Link
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors"
                  >
                    {visitingAddr.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < visitingAddr.length - 1 && <br />}
                      </span>
                    ))}
                  </Link>
                </ContactInfoItem>
              );
            })()}
            {(() => {
              const postAddr = formatAddress(settings.postAddress);
              return postAddr ? (
                <ContactInfoItem
                  icon={<IconMapPin className="h-5 w-5 shrink-0" />}
                  label="Postadress"
                >
                  {postAddr.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < postAddr.length - 1 && <br />}
                    </span>
                  ))}
                </ContactInfoItem>
              ) : null;
            })()}
           
          </div>
        </Sidebar>
      )}

      {(settings.pressContactInfo?.contactPerson ||
        settings.pressContactInfo?.email ||
        settings.pressContactInfo?.phone) && (
        <Sidebar heading="Presskontakt">
          <div className="space-y-4">
            {settings.pressContactInfo?.email && (
              <ContactInfoItem
                icon={<IconMail className="h-5 w-5 shrink-0" />}
                label="E-post"
              >
                <Link href={`mailto:${settings.pressContactInfo.email}`}>
                  {settings.pressContactInfo.email}
                </Link>
              </ContactInfoItem>
            )}
            {settings.pressContactInfo?.phone && (
              <ContactInfoItem
                icon={<IconPhone className="h-5 w-5 shrink-0" />}
                label="Telefon"
              >
                <Link
                  href={`tel:${settings.pressContactInfo.phone.replace(/\D/g, "")}`}
                >
                  {formatPhoneNumber(settings.pressContactInfo.phone)}
                </Link>
              </ContactInfoItem>
            )}
            {settings.pressContactInfo?.contactPerson && (
              <ContactInfoItem
                icon={<IconUser className="h-5 w-5 shrink-0" />}
                label="Kontaktperson"
              >
                {settings.pressContactInfo.contactPerson}
              </ContactInfoItem>
            )}
          </div>
        </Sidebar>
      )}
    </div>
  ) : null;

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <ListingHeader
          title={listing?.title}
          intro={listing?.intro}
          fallbackTitle="Kontakta oss"
          fallbackIntro="Har du frågor eller vill komma i kontakt med oss? Fyll i formuläret nedan så återkommer vi så snart som möjligt."
        />
        <ContentWithSidebar
          mainContent={mainContent}
          sidebarContent={sidebarContent}
        />
      </div>
    </main>
  );
}
