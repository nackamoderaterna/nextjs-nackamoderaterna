"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search, X } from "lucide-react";
import Fuse from "fuse.js";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/lib/components/ui/input";
import { buildImageUrl } from "@/lib/sanity/image";
import { getLucideIcon } from "@/lib/utils/iconUtils";

export interface SearchItem {
  _id: string;
  name: string;
  description?: string;
  category: string;
  url: string;
  searchText?: string;
  iconName?: string | null;
  image?: {
    asset?: { _ref: string };
    _type: "image";
    [key: string]: unknown;
  } | null;
}

const fuseOptions = {
  threshold: 0.3,
  minMatchCharLength: 2,
  includeScore: true,
  keys: [
    { name: "name", weight: 0.5 },
    { name: "searchText", weight: 0.3 },
    { name: "description", weight: 0.2 },
  ],
};

export function SearchBar({ items = [], onResultClick }: { items?: SearchItem[]; onResultClick?: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(() => new Fuse(items, fuseOptions), [items]);

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
      return;
    }

    const hits = fuse.search(query).slice(0, 10);
    setResults(hits.map((r) => r.item));
    setIsOpen(true);
  }, [query, fuse]);

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
    onResultClick?.();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Sök på webbplatsen..."
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
      </div>

      {isOpen && (results.length > 0 || query.length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => {
                const Icon = result.iconName ? getLucideIcon(result.iconName) : null;
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
                        {result.name}
                      </div>
                      {result.description && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {result.description}
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
                          alt={result.name}
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
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Inga resultat hittades
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
