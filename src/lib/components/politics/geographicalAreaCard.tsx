import Link from "next/link";
import { SanityImage } from "../shared/SanityImage";
import { ROUTE_BASE } from "@/lib/routes";

interface GeographicalAreaCardProps {
  title: string;
  image: any;
  slug: string;
  className?: string;
}

export function GeographicalAreaCard({
  title,
  image,
  slug,
  className,
}: GeographicalAreaCardProps) {
  return (
    <Link
      href={`${ROUTE_BASE.POLITICS_AREA}/${slug}`}
      className={`group relative block overflow-hidden rounded-lg ${className || ""}`}
    >
      <div className="aspect-[16/9] w-full">
        <SanityImage
          image={image}
          fill
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
        <h3 className="absolute left-5 top-5 text-xl font-bold text-white">
          {title}
        </h3>
      </div>
    </Link>
  );
}
