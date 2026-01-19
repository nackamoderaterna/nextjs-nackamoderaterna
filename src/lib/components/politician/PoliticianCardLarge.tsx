import Link from "next/link";
import { SanityImage } from "../shared/SanityImage";

interface PeopleCardProps {
  image: any;
  name?: string;
  title?: string;
  slug: string;
  size: "small" | "large";
}

export function PeopleCard({
  image,
  title,
  name,
  slug,
  size = "small",
}: PeopleCardProps) {
  const isSmall = size === "small";

  if (isSmall) {
    return (
      <Link href={`politiker/${slug}`}>
        <div className="flex items-center gap-3 group hover:bg-muted rounded hover:cursor-pointer transition-colors duration-300">
          {/* Small circular image on the left */}
          <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
            <SanityImage image={image} fill />
          </div>

          {/* Text on the right */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm leading-tight">
              {name}
            </h3>
            {title && (
              <p className="text-muted-foreground text-xs mt-0.5 leading-tight">
                {title}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }
  return (
    <Link href={`politiker/${slug}`}>
      <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className={`relative h-64 w-full overflow-hidden bg-muted`}>
          <SanityImage fill image={image} />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className={`font-semibold text-foreground text-xl`}>{name}</h3>
          <p className={`text-muted-foreground text-base mt-1`}>{title}</p>

          {/* Contact Icons - Only for Large Size */}
        </div>
      </div>
    </Link>
  );
}
