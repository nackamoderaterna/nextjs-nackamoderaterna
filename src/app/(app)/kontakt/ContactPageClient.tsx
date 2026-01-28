import { IconMail, IconMapPin, IconPhone, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { GlobalSettings } from "~/sanity.types";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { ListingHeader } from "@/lib/components/shared/ListingHeader";

type ListingPage = {
  title?: string;
  intro?: string;
};

interface ContactPageClientProps {
  settings: GlobalSettings;
  listing?: ListingPage;
}

export function ContactPageClient({
  settings,
  listing,
}: ContactPageClientProps) {
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
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <ListingHeader
          title={listing?.title}
          intro={listing?.intro}
          fallbackTitle="Kontakta oss"
          fallbackIntro="Har du frågor eller vill komma i kontakt med oss? Fyll i formuläret nedan så återkommer vi så snart som möjligt."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-muted p-8 rounded-lg">
              <ContactForm heading="Skicka ett meddelande" />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Kontaktuppgifter</h3>
              <div className="space-y-4">
                {settings.contactInfo?.contactPerson && (
                  <div className="flex items-start gap-3">
                    <IconUser className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium mb-1">Kontaktperson</p>
                      <p className="text-sm text-muted-foreground">
                        {settings.contactInfo.contactPerson}
                      </p>
                    </div>
                  </div>
                )}
                {settings.contactInfo?.email && (
                  <div className="flex items-start gap-3">
                    <IconMail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium mb-1">E-post</p>
                      <Link
                        href={`mailto:${settings.contactInfo.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {settings.contactInfo.email}
                      </Link>
                    </div>
                  </div>
                )}
                {settings.contactInfo?.phone && (
                  <div className="flex items-start gap-3">
                    <IconPhone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium mb-1">Telefon</p>
                      <Link
                        href={`tel:${settings.contactInfo.phone.replace(/\s/g, "")}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {settings.contactInfo.phone}
                      </Link>
                    </div>
                  </div>
                )}
                {(() => {
                  const postAddr = formatAddress(settings.postAddress);
                  return postAddr && (
                    <div className="flex items-start gap-3">
                      <IconMapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Postadress</p>
                        <p className="text-sm text-muted-foreground">
                          {postAddr.map((line, i) => (
                            <span key={i}>
                              {line}
                              {i < postAddr.length - 1 && <br />}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  );
                })()}
                {(() => {
                  const visitingAddr = formatAddress(settings.visitingAddress);
                  return visitingAddr && (
                    <div className="flex items-start gap-3">
                      <IconMapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Besöksadress</p>
                        <p className="text-sm text-muted-foreground">
                          {visitingAddr.map((line, i) => (
                            <span key={i}>
                              {line}
                              {i < visitingAddr.length - 1 && <br />}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {(settings.pressContactInfo?.contactPerson ||
              settings.pressContactInfo?.email ||
              settings.pressContactInfo?.phone) && (
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-4">Presskontakt</h3>
                <div className="space-y-4">
                  {settings.pressContactInfo?.contactPerson && (
                    <div className="flex items-start gap-3">
                      <IconUser className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Kontaktperson</p>
                        <p className="text-sm text-muted-foreground">
                          {settings.pressContactInfo.contactPerson}
                        </p>
                      </div>
                    </div>
                  )}
                  {settings.pressContactInfo?.email && (
                    <div className="flex items-start gap-3">
                      <IconMail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">E-post</p>
                        <Link
                          href={`mailto:${settings.pressContactInfo.email}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {settings.pressContactInfo.email}
                        </Link>
                      </div>
                    </div>
                  )}
                  {settings.pressContactInfo?.phone && (
                    <div className="flex items-start gap-3">
                      <IconPhone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Telefon</p>
                        <Link
                          href={`tel:${settings.pressContactInfo.phone.replace(/\s/g, "")}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {settings.pressContactInfo.phone}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
