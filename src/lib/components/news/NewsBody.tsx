// components/news/NewsBody.tsx
import { PortableText } from "@portabletext/react";
import React from "react";
import { SanityImage } from "../shared/SanityImage";
import { NewsWithReferences } from "@/app/(app)/nyheter/[slug]/page";

const portableTextComponents = {
  types: {
    image: ({ value }: any) => (
      <div className="my-6">
        <SanityImage
          image={value}
          alt={value.alt || ""}
          className="w-full rounded-lg"
        />
        {value.alt && (
          <p className="text-sm text-gray-500 text-center mt-2">{value.alt}</p>
        )}
      </div>
    ),
  },
};

export function NewsBody({ news }: { news: NewsWithReferences }) {
  if (!news.body || news.body.length === 0) return null;

  return (
    <div className="border-t border-gray-200 p-6 md:p-8">
      <div className="prose prose-gray">
        <PortableText value={news.body} components={portableTextComponents} />
      </div>
    </div>
  );
}
