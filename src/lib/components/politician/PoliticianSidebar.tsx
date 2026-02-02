import { Mail, Phone } from "lucide-react";
import { Sidebar } from "@/lib/components/shared/Sidebar";
import { ContactInfoItem } from "@/lib/components/shared/ContactInfoItem";
import { SocialLinks, type SocialLinksData } from "@/lib/components/shared/SocialLinks";
import { PoliticalAreasSidebar } from "@/lib/components/politician/PoliticalAreasSidebar";
import { formatPhoneNumber } from "@/lib/utils/phoneUtils";

interface PoliticalAreaRef {
  politicalArea?: {
    _id?: string;
    name?: string;
    slug?: { current?: string };
    icon?: { name?: string | null } | null;
  };
}

interface PoliticianSidebarProps {
  email?: string | null;
  phone?: string | null;
  socialLinks?: SocialLinksData | null;
  politicalAreas?: PoliticalAreaRef[] | null;
}

export function PoliticianSidebar({
  email,
  phone,
  socialLinks,
  politicalAreas,
}: PoliticianSidebarProps) {
  const hasContact = email || phone || socialLinks;
  const hasPoliticalAreas = politicalAreas && politicalAreas.length > 0;

  if (!hasContact && !hasPoliticalAreas) {
    return null;
  }

  return (
    <div className="space-y-6">
      {hasContact && (
        <Sidebar heading="Kontakt">
          <div className="grid gap-4">
            {email && (
              <ContactInfoItem
                icon={<Mail className="h-4 w-4 shrink-0" />}
                label="E-post"
                href={`mailto:${email}`}
              >
                {email}
              </ContactInfoItem>
            )}
            {phone && (
              <ContactInfoItem
                icon={<Phone className="h-4 w-4 shrink-0" />}
                label="Telefon"
                href={`tel:${phone.replace(/\D/g, "")}`}
              >
                {formatPhoneNumber(phone)}
              </ContactInfoItem>
            )}
            <SocialLinks
              links={socialLinks}
              variant="default"
              heading="Sociala media"
            />
          </div>
        </Sidebar>
      )}
      {hasPoliticalAreas && (
        <PoliticalAreasSidebar politicalAreas={politicalAreas} />
      )}
    </div>
  );
}
