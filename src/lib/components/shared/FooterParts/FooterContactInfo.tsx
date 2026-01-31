import { formatAddress } from "@/lib/utils/addressUtils";

interface Address {
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
}

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
      <div className="not-italic text-sm text-muted-foreground space-y-1 flex gap-4">
        <div>
          {visitingLines && (
            <div>
              <p className="text-xs font-medium text-foreground/70 mb-1">Besöksadress</p>
              {visitingLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
          {postLines && (
            <div>
              <p
                className={`text-xs font-medium text-foreground/70 mb-1 ${
                  visitingAddress ? "mt-3" : ""
                }`}
              >
                Postadress
              </p>
              {postLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
        </div>
        <div>
          {contactInfo?.email && (
            <div>
              <p className="text-xs font-medium text-foreground/70 mb-1">E-post</p>
              <p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-foreground transition-colors underline"
                >
                  {contactInfo.email}
                </a>
              </p>
            </div>
          )}
          {contactInfo?.phone && (
            <div>
              <p className={`text-xs font-medium text-foreground/70 mb-1 ${contactInfo?.email ? "mt-3" : ""}`}>
                Telefon
              </p>
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
    </div>
  );
}
