import { formatAddress, type Address } from "@/lib/utils/addressUtils";

interface ContactInfo {
  email?: string;
  phone?: string;
}

interface FooterContactInfoProps {
  visitingAddress?: Address | null;
  postAddress?: Address | null;
  contactInfo?: ContactInfo | null;
}

export function FooterContactInfo({
  visitingAddress,
  postAddress,
  contactInfo,
}: FooterContactInfoProps) {
  const hasAddress = visitingAddress || postAddress;
  const hasContact = contactInfo?.email || contactInfo?.phone;

  if (!hasAddress && !hasContact) return null;

  const visitingLines = formatAddress(visitingAddress);
  const postLines = formatAddress(postAddress);

  return (
    <div>
      <h3 className="font-semibold text-foreground mb-4">Kontaktuppgifter</h3>
      <div className="not-italic text-sm text-muted-foreground space-y-4">
        {visitingLines && (
          <div>
            <p className="text-xs font-medium text-foreground/70 mb-1">Besöksadress</p>
            {visitingLines.map((line: string, i: number) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
        {postLines && (
          <div>
            <p className="text-xs font-medium text-foreground/70 mb-1">Postadress</p>
            {postLines.map((line: string, i: number) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
        {contactInfo?.email && (
          <div>
            <p className="text-xs font-medium text-foreground/70 mb-1">E-post</p>
            <p className="min-w-0">
              <a
                href={`mailto:${contactInfo.email}`}
                className="hover:text-foreground transition-colors underline break-all"
              >
                {contactInfo.email}
              </a>
            </p>
          </div>
        )}
        {contactInfo?.phone && (
          <div>
            <p className="text-xs font-medium text-foreground/70 mb-1">Telefon</p>
            <p>
              <a
                href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                className="hover:text-foreground transition-colors underline"
              >
                {contactInfo.phone}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
