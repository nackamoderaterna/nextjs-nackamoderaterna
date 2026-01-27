// components/news/NewsBody.tsx
import { PortableText } from "@portabletext/react";
import { NewsWithReferences } from "@/types/news";
import { portableTextComponents } from "../shared/PortableTextComponents";

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
