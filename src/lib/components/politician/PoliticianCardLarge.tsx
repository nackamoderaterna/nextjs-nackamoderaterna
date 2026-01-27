import Link from "next/link";
import { SanityImage } from "../shared/SanityImage";
import { cn } from "@/lib/utils";
import { ROUTE_BASE } from "@/lib/routes";

interface PeopleCardProps {
  image: any;
  name?: string;
  title?: string;
  slug: string;
  size: "small" | "large";
  /** Optional class for the small variant container (e.g. to override hover in muted boxes) */
  className?: string;
}

export function PeopleCard({
  image,
  title,
  name,
  slug,
  size = "small",
  className,
}: PeopleCardProps) {
  const isSmall = size === "small";

  if (isSmall) {
    return (
      <Link
        href={`${ROUTE_BASE.POLITICIANS}/${slug}`}
        aria-label={`Läs mer om ${name}`}
      >
        <div
          className={cn(
            "flex items-center gap-3 group hover:bg-muted rounded hover:cursor-pointer transition-colors duration-300",
            className
          )}
        >
          {/* Small circular image on the left */}
          <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
            <SanityImage
              image={image}
              fill
              alt={name || ""}
              sizes="48px"
              loading="lazy"
            />
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
    <Link
      href={`${ROUTE_BASE.POLITICIANS}/${slug}`}
      aria-label={`Läs mer om ${name}`}
    >
      <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className={`relative h-64 w-full overflow-hidden bg-muted`}>
          <SanityImage
            fill
            image={image}
            alt={name || ""}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            loading="lazy"
          />
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
