import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/lib/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  preserveParams?: Record<string, string>;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = "/nyheter",
  preserveParams = {},
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) {
      params.set("page", page.toString());
    }
    // Preserve other query params
    Object.entries(preserveParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-12"
      aria-label="Sidnavigering"
    >
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link href={getPageUrl(currentPage - 1)}>
          <Button variant="outline" size="sm" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            <span className="sr-only md:not-sr-only">Föregående</span>
          
        </Button>
          </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          <span className="sr-only md:not-sr-only">Föregående</span>
        </Button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-muted-foreground"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link key={pageNum} href={getPageUrl(pageNum)}>
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="min-w-[2.5rem]"
                aria-current={isActive ? "page" : undefined}
                aria-label={`Gå till sida ${pageNum}`}
              >
                {pageNum}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link href={getPageUrl(currentPage + 1)}>
          <Button variant="outline" size="sm" className="gap-2">
            <span className="sr-only md:not-sr-only">Nästa</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="gap-2">
          <span className="sr-only md:not-sr-only">Nästa</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </nav>
  );
}
