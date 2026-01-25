import Link from "next/link";

interface PoliticalArea {
  politicalArea?: {
    name?: string;
    slug?: {
      current?: string;
    };
  };
}

interface PoliticalAreasSidebarProps {
  politicalAreas?: PoliticalArea[];
}

export function PoliticalAreasSidebar({
  politicalAreas,
}: PoliticalAreasSidebarProps) {
  if (!politicalAreas || politicalAreas.length === 0) {
    return null;
  }

  return (
    <aside className="bg-muted rounded-lg p-6">
      <h2 className="text-sm font-semibold text-foreground mb-4">
        Hjärtefrågor
      </h2>
      <div className="space-y-2">
        {politicalAreas.map((areaRef, index) => {
          if (!areaRef.politicalArea?.name) return null;

          const href = areaRef.politicalArea.slug?.current
            ? `/politik/${areaRef.politicalArea.slug.current}`
            : undefined;

          return (
            <div key={index}>
              {href ? (
                <Link
                  href={href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {areaRef.politicalArea.name}
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {areaRef.politicalArea.name}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
