interface PressContactInfo {
  phone?: string | null;
  email?: string | null;
  contactPerson?: string | null;
}

interface FooterPressContactProps {
  pressContactInfo?: PressContactInfo | null;
}

export function FooterPressContact({
  pressContactInfo,
}: FooterPressContactProps) {
  const hasPressContact =
    pressContactInfo?.contactPerson ||
    pressContactInfo?.email ||
    pressContactInfo?.phone;

  if (!hasPressContact) return null;

  return (
    <div>
      <h3 className="font-semibold text-foreground mb-4">Presskontakt</h3>
      <div className="text-sm text-muted-foreground space-y-1">
        {pressContactInfo?.contactPerson && (
          <div>
            <p className="text-xs font-medium text-foreground/70 mb-1">
              Kontaktperson
            </p>
            <p>{pressContactInfo.contactPerson}</p>
          </div>
        )}
        {pressContactInfo?.email && (
          <div>
            <p
              className={`text-xs font-medium text-foreground/70 mb-1 ${
                pressContactInfo?.contactPerson ? "mt-3" : ""
              }`}
            >
              E-post
            </p>
            <p>
              <a
                href={`mailto:${pressContactInfo.email}`}
                className="hover:text-foreground transition-colors underline"
              >
                {pressContactInfo.email}
              </a>
            </p>
          </div>
        )}
        {pressContactInfo?.phone && (
          <div>
            <p
              className={`text-xs font-medium text-foreground/70 mb-1 ${
                pressContactInfo?.contactPerson || pressContactInfo?.email
                  ? "mt-3"
                  : ""
              }`}
            >
              Telefon
            </p>
            <p>
              <a
                href={`tel:${pressContactInfo.phone.replace(/\s/g, "")}`}
                className="hover:text-foreground transition-colors underline"
              >
                {pressContactInfo.phone}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
