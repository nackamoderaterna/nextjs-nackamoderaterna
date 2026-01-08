import { NewDocumentOptionsResolver } from "sanity";
import { News } from "~/sanity.types";
import { SanityImage } from "../shared/SanityImage";
import Link from "next/link";

interface NewsCardProps {
  item: News;
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <Link
      href={`/nyheter/${item.slug?.current}`}
      className="block border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      {item.mainImage && (
        <div className="relative aspect-[4/5]">
          <SanityImage image={item.mainImage} fill />
        </div>
      )}
      <div className="text-xs text-gray-700">
        {item.dateOverride || item._createdAt}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg leading-6">{item.title}</h3>

        {item.excerpt && (
          <p className="text-sm text-gray-600 mt-2">{item.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
