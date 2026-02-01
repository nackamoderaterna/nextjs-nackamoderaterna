import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Sidebar } from "@/lib/components/shared/Sidebar";
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
          <div className="space-y-4">
            {email && (
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  E-post
                </p>
                <Link
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {email}
                </Link>
              </div>
            )}
            {phone && (
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Telefon
                </p>
                <Link
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {formatPhoneNumber(phone)}
                </Link>
              </div>
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
