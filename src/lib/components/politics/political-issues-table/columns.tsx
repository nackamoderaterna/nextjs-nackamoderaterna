"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { Badge } from "@/lib/components/ui/badge";
import { ROUTE_BASE } from "@/lib/routes";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import {
  HelpCircle,
  Tag,
  MoreHorizontal,
  ExternalLink,
  Link2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react";
import type { PoliticalIssueWithAreas } from "./types";

function SortableHeader({
  column,
  children,
  className,
}: {
  column: {
    getCanSort: () => boolean;
    getIsSorted: () => false | "asc" | "desc";
    getToggleSortingHandler: () => ((event: unknown) => void) | undefined;
  };
  children: React.ReactNode;
  className?: string;
}) {
  const canSort = column.getCanSort();
  const sorted = column.getIsSorted();
  const handler = column.getToggleSortingHandler();
  if (!canSort || !handler) {
    return <span className={className}>{children}</span>;
  }
  return (
    <button
      type="button"
      onClick={handler}
      className={`inline-flex items-center gap-1.5 text-left hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm ${className ?? ""}`}
    >
      {children}
      {sorted === "asc" ? (
        <ChevronUp className="size-3.5 text-muted-foreground shrink-0" aria-hidden />
      ) : sorted === "desc" ? (
        <ChevronDown className="size-3.5 text-muted-foreground shrink-0" aria-hidden />
      ) : (
        <ChevronDown className="size-3.5 text-muted-foreground shrink-0 opacity-50" aria-hidden />
      )}
    </button>
  );
}

export const politicalIssuesColumns: ColumnDef<PoliticalIssueWithAreas>[] = [
  {
    id: "fraga",
    accessorFn: (row) => row.question ?? "",
    header: ({ column }) => (
      <SortableHeader column={column}>
        <HelpCircle className="size-3.5 text-muted-foreground shrink-0" aria-hidden />
        Fråga
      </SortableHeader>
    ),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const a = (rowA.getValue("fraga") as string) ?? "";
      const b = (rowB.getValue("fraga") as string) ?? "";
      return a.localeCompare(b, "sv");
    },
    cell: ({ row }) => {
      const issue = row.original;
      const slug = issue.slug?.current ?? "";
      const href = `${ROUTE_BASE.POLITICS_ISSUES}/${slug}`.replace(/\/+/g, "/");
      const question = issue.question?.trim() ?? "Fråga saknas";
      return (
        <Link
          href={href}
          className="font-medium text-foreground hover:text-primary hover:underline line-clamp-2"
        >
          {question}
        </Link>
      );
    },
  },
  {
    id: "kernfraga",
    accessorFn: (row) => !!row.featured,
    header: "Kärnfråga",
    enableColumnFilter: true,
    filterFn: (row, _columnId, filterValue: string) => {
      if (!filterValue || filterValue === "all") return true;
      const featured = !!row.original.featured;
      if (filterValue === "ja") return featured;
      if (filterValue === "nej") return !featured;
      return true;
    },
  },
  {
    id: "status",
    accessorFn: (row) => !!row.fulfilled,
    header: "Status",
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: (row, _columnId, filterValue: string) => {
      if (!filterValue || filterValue === "all") return true;
      const fulfilled = !!row.original.fulfilled;
      if (filterValue === "fulfilled") return fulfilled;
      if (filterValue === "not_fulfilled") return !fulfilled;
      return true;
    },
    cell: ({ row }) => {
      const fulfilled = !!row.original.fulfilled;
      if (fulfilled) {
        return (
          <Badge variant="secondary" className="gap-1 text-green-700 dark:text-green-400">
            <CheckCircle className="size-3" aria-hidden />
            Uppfyllt
          </Badge>
        );
      }
      return <span className="text-muted-foreground">—</span>;
    },
  },
  {
    id: "politiskaOmraden",
    accessorFn: (row) =>
      (row.politicalAreas ?? [])
        .map((a: { name: string }) => a.name)
        .filter(Boolean)
        .join(", "),
    header: () => (
      <span className="inline-flex items-center gap-1.5">
        <Tag className="size-3.5 text-muted-foreground" aria-hidden />
        Politiska områden
      </span>
    ),
    enableColumnFilter: true,
    filterFn: (row, _columnId, filterValue: unknown) => {
      const selected = Array.isArray(filterValue) ? (filterValue as string[]) : [];
      if (selected.length === 0) return true;
      const rowNames = (row.original.politicalAreas ?? [])
        .map((a: { name: string }) => a.name)
        .filter(Boolean) as string[];
      return selected.every((name) => rowNames.includes(name));
    },
    cell: ({ row }) => {
      const areas = row.original.politicalAreas ?? [];
      if (areas.length === 0) return <span className="text-muted-foreground">–</span>;
      return (
        <div className="flex flex-wrap gap-1 max-w-[320px]">
          {areas.map((area: { _id: string; name: string; icon?: { name?: string } | null }) => {
            const Icon = getLucideIcon(area.icon?.name ?? undefined);
            return (
              <Badge
                key={area._id}
                variant="secondary"
                className="text-muted-foreground inline-flex items-center gap-1 text-xs font-normal py-0 px-1.5"
              >
                {Icon ? <Icon className="size-3 shrink-0" aria-hidden /> : null}
                {area.name}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <span>Åtg.</span>,
    cell: ({ row }) => {
      const issue = row.original;
      const slug = issue.slug?.current ?? "";
      const href = `${ROUTE_BASE.POLITICS_ISSUES}/${slug}`.replace(/\/+/g, "/");

      const copyLink = () => {
        const url =
          typeof window !== "undefined"
            ? `${window.location.origin}${href}`
            : href;
        void navigator.clipboard?.writeText(url);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Åtgärder</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={href} className="flex items-center gap-2">
                <HelpCircle className="size-4" />
                Öppna sakfråga
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="size-4" />
                Öppna i ny flik
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyLink} className="flex items-center gap-2">
              <Link2 className="size-4" />
              Kopiera länk
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
