import { PortableTextComponents } from "@portabletext/react";
import { SanityImage } from "./SanityImage";
import Link from "next/link";
import { Button } from "../ui/button";

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
        <div className="my-6">
          <SanityImage
            image={value}
            alt={value.alt || ""}
            className="w-full max-h-[32rem] object-contain rounded-lg"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          {value.caption && (
            <p className="text-sm text-muted-foreground text-center mt-2 my-0">
              {value.caption}
            </p>
          )}
          {value.alt && !value.caption && (
            <p className="text-sm text-muted-foreground text-center mt-2 my-0">
              {value.alt}
            </p>
          )}
        </div>
      );
    },
    // Handle rich text quote blocks (pull quote)
    richTextQuote: ({ value }: any) => {
      if (!value) return null;

      const attribution = value.title
        ? `${value.name}, ${value.title}`
        : value.name;

      return (
        <figure className="relative my-10 pl-10 md:pl-14">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 -top-2 select-none font-serif text-[4.5rem] md:text-[5.5rem] leading-none text-brand-primary/25"
          >
            &ldquo;
          </span>
          <blockquote>
            <p className="text-xl md:text-2xl italic leading-snug text-foreground">
              {value.quote}
            </p>
          </blockquote>
          {attribution && (
            <figcaption className="mt-4 text-sm text-muted-foreground">
              {value.link ? (
                value.link.startsWith("http") || value.link.startsWith("//") ? (
                  <a
                    href={value.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    — {attribution}
                  </a>
                ) : (
                  <Link
                    href={value.link}
                    className="hover:text-foreground transition-colors"
                  >
                    — {attribution}
                  </Link>
                )
              ) : (
                <span>— {attribution}</span>
              )}
            </figcaption>
          )}
        </figure>
      );
    },
    // Handle highlighted link blocks
    richTextHighlightedLink: ({ value }: any) => {
      if (!value) return null;

      return (
        <div className="my-6 border border-border rounded p-6 bg-white">
          {value.title && (
            <h3 className="text-xl font-bold text-foreground mb-3 mt-0">
              {value.title}
            </h3>
          )}
          {value.description && (
            <p className="text-muted-foreground mb-4 leading-relaxed text-base my-0">
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
    link: ({ value, children }: any) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-brand-primary hover:text-brand-primary/80 underline underline-offset-2 transition-colors"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }: any) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-outside pl-6 my-5 space-y-1.5">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-outside pl-6 my-5 space-y-1.5">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="text-base md:text-lg leading-relaxed pl-1">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="text-base md:text-lg leading-relaxed pl-1">{children}</li>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground mt-12 mb-5 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-foreground mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl md:text-3xl font-semibold leading-snug text-foreground mt-8 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl md:text-2xl font-semibold leading-snug text-foreground mt-6 mb-2">
        {children}
      </h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-7 ml-2 border-l border-foreground/20 pl-5 italic text-foreground/70 text-base md:text-lg leading-relaxed">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p className="text-base md:text-lg leading-relaxed text-foreground my-5">
        {children}
      </p>
    ),
  },
};
