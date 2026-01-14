import Link from "next/link";
import Image from "next/image";
import React from "react";
import { SanityImage } from "../shared/SanityImage";
import { buildImageUrl } from "@/lib/sanity/image";

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
      href={`omrade/${slug}`}
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
