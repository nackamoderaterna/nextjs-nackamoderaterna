import { PortableTextComponents } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { SanityImage } from "./SanityImage";
import Link from "next/link";
import { Button } from "../ui/button";

// Base components without circular dependency for nested PortableText
const basePortableTextComponents: PortableTextComponents = {
  types: {},
  marks: {
    link: ({ value, children }: any) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-blue-600 hover:text-blue-700 underline"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h1: ({ children }: any) => <h1>{children}</h1>,
    h2: ({ children }: any) => <h2>{children}</h2>,
    h3: ({ children }: any) => <h3>{children}</h3>,
    normal: ({ children }: any) => <p>{children}</p>,
  },
};

/**
 * Shared PortableText components configuration for handling all block types
 * Used across the application to render Sanity Portable Text content
 */
export const portableTextComponents: PortableTextComponents = {
  types: {
    // Handle image blocks in PortableText
    image: ({ value }: any) => {
      if (!value || !value.asset) {
        return null;
      }

      return (
        <div className="my-4">
          <SanityImage
            image={value}
            alt={value.alt || ""}
            className="w-full max-h-[32rem] object-contain rounded-lg"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          {value.caption && (
            <p className="text-sm text-gray-500 text-center mt-2">
              {value.caption}
            </p>
          )}
          {value.alt && !value.caption && (
            <p className="text-sm text-gray-500 text-center mt-2">
              {value.alt}
            </p>
          )}
        </div>
      );
    },
    // Handle rich text quote blocks
    richTextQuote: ({ value }: any) => {
      if (!value) return null;

      const attribution = value.title
        ? `${value.name}, ${value.title}`
        : value.name;

      return (
        <div className="my-6">
          <div className="flex gap-6">
            {/* Blue vertical bar - thicker to match design */}
            <div className="w-2 bg-brand-primary flex-shrink-0" />
            {/* Quote content */}
            <div className="flex-1">
              <p className="!mt-0 text-3xl md:text-4xl font-serif italic text-gray-900 leading-relaxed">
                {value.quote}
              </p>
              <div className="mt-6 pr-8">
                {value.link ? (
                  value.link.startsWith("http") ||
                  value.link.startsWith("//") ? (
                    <a
                      href={value.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground font-serif text-base hover:text-brand-primary transition-colors"
                    >
                      – {attribution}
                    </a>
                  ) : (
                    <Link
                      href={value.link}
                      className="text-foreground font-serif text-base hover:text-brand-primary transition-colors"
                    >
                      – {attribution}
                    </Link>
                  )
                ) : (
                  <span className="text-gray-900 font-serif text-base">
                    – {attribution}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
    // Handle highlighted link blocks
    richTextHighlightedLink: ({ value }: any) => {
      if (!value) return null;

      return (
        <div className="my-6 border border-border rounded p-6 bg-white">
          {value.title && (
            <h3 className="!mt-0 text-xl font-bold text-foreground mb-3">
              {value.title}
            </h3>
          )}
          {value.description && (
            <p className="text-muted-foreground mb-4 leading-relaxed text-base">
              {value.description}
            </p>
          )}
          {value.linkUrl && value.linkText && (
            <Button asChild>
              <Link
                href={value.linkUrl}
                target={value.linkUrl.startsWith("http") ? "_blank" : undefined}
                rel={
                  value.linkUrl.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="text-brand-primary no-underline"
              >
                {value.linkText} →
              </Link>
            </Button>
          )}
        </div>
      );
    },
    // Handle blocks with undefined _type (when _type is literally "undefined" or missing)
    undefined: ({ value }: any) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("PortableText: Block with undefined type", value);
      }
      return null;
    },
  },
  // Handle unknown block types gracefully (fallback for any unhandled types)
  unknownType: ({ value, isInline }: any) => {
    if (process.env.NODE_ENV === "development") {
      console.warn("PortableText: Unknown block type", {
        type: value?._type,
        value,
        isInline,
      });
    }
    return null;
  },
  marks: {
    // Add link support if needed
    link: ({ value, children }: any) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-brand-primary hover:text-brand-primary/80 transition-colors underline"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    // Customize block styles if needed
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-bold mt-4 mb-2">{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
  },
};
