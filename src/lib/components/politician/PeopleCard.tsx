import Link from "next/link";
import { SanityImage } from "../shared/SanityImage";
import { cn } from "@/lib/utils";
import { ROUTE_BASE } from "@/lib/routes";

interface PeopleCardProps {
  image: unknown;
  name?: string;
  title?: string;
  slug: string;
  size: "small" | "medium" | "large";
  /** Optional class for the small/medium variant container (e.g. to override hover in muted boxes) */
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
  const isHorizontal = size === "small" || size === "medium";
  const imageSize = size === "medium" ? "w-20 h-20" : "w-12 h-12";
  const imageSizes = size === "medium" ? "80px" : "48px";

  if (isHorizontal) {
    return (
      <Link
        href={`${ROUTE_BASE.POLITICIANS}/${slug}`}
        aria-label={`Läs mer om ${name}`}
      >
        <div
          className={cn(
            "flex items-center gap-3 group hover:bg-muted rounded hover:cursor-pointer transition-colors duration-300 p-2",
            className
          )}
        >
          <div
            className={cn(
              "relative flex-shrink-0 rounded overflow-hidden bg-muted transition-transform duration-300 group-hover:scale-105",
              imageSize
            )}
          >
            <SanityImage
              image={image}
              fill
              alt={name || ""}
              sizes={imageSizes}
              loading="lazy"
            />
          </div>

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
        <div className="relative h-64 w-full overflow-hidden bg-muted transition-transform duration-300 group-hover:scale-105">
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
        </div>
      </div>
    </Link>
  );
}
