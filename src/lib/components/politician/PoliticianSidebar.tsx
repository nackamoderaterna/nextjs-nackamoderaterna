import { Sidebar } from "@/lib/components/shared/Sidebar";
import { SocialLinks, type SocialLinksData } from "@/lib/components/shared/SocialLinks";
import { PoliticalAreasSidebar } from "@/lib/components/politician/PoliticalAreasSidebar";

interface PoliticalAreaRef {
  politicalArea?: {
    _id?: string;
    name?: string;
    slug?: { current?: string };
    icon?: { name?: string | null } | null;
  };
}

interface PoliticianSidebarProps {
  socialLinks?: SocialLinksData | null;
  politicalAreas?: PoliticalAreaRef[] | null;
}

export function PoliticianSidebar({
  socialLinks,
  politicalAreas,
}: PoliticianSidebarProps) {
  const hasSocialLinks = !!socialLinks;
  const hasPoliticalAreas = politicalAreas && politicalAreas.length > 0;

  if (!hasSocialLinks && !hasPoliticalAreas) {
    return null;
  }

  return (
    <div className="space-y-6">
      {hasSocialLinks && (
        <Sidebar heading="Sociala medier">
          <SocialLinks links={socialLinks} variant="default" />
        </Sidebar>
      )}
      {hasPoliticalAreas && (
        <PoliticalAreasSidebar politicalAreas={politicalAreas} />
      )}
    </div>
  );
}
