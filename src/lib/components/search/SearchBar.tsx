"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/lib/components/ui/input";
import { ROUTE_BASE } from "@/lib/routes";
import { buildImageUrl } from "@/lib/sanity/image";
import { getLucideIcon } from "@/lib/utils/iconUtils";

interface SearchResult {
  _id: string;
  _type: string;
  name?: string;
  title?: string;
  slug?: {
    current: string;
  };
  excerpt?: string;
  category: string;
  url: string;
  icon?: { name?: string | null } | null;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
    };
    _type: "image";
  };
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${ROUTE_BASE.API_SEARCH}?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Sök efter information på sidan..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length >= 2) {
              setIsOpen(true);
            }
          }}
          onFocus={() => {
            if (query.length >= 2 && results.length > 0) {
              setIsOpen(true);
            }
          }}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {isOpen && (results.length > 0 || (query.length >= 2 && !isLoading)) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => {
                const Icon = result.icon?.name ? getLucideIcon(result.icon.name) : null;
                const imageUrl = result.image ? buildImageUrl(result.image, { width: 150, height: 150 }) : null;
                return (
                  <Link
                    key={result._id}
                    href={result.url}
                    onClick={handleResultClick}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-md transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">
                        {result.name || result.title}
                      </div>
                      {result.excerpt && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {result.excerpt}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {result.category}
                      </div>
                    </div>
                    {Icon ? (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
                        <Icon className="h-6 w-6 text-brand-primary" />
                      </div>
                    ) : imageUrl ? (
                      <div className="flex-shrink-0">
                        <Image
                          src={imageUrl}
                          alt={result.name || result.title || ""}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                      </div>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ) : query.length >= 2 && !isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Inga resultat hittades
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
