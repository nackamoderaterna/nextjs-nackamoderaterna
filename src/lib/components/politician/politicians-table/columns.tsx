"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { Button } from "@/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { Badge } from "@/lib/components/ui/badge";
import { ROUTE_BASE } from "@/lib/routes";
import { cleanInvisibleUnicode } from "@/lib/politicians";
import type { PoliticianWithNamnd } from "@/lib/politicians";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import {
  Check,
  Minus,
  Mail,
  Phone,
  User,
  MoreHorizontal,
  Tag,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Link2,
} from "lucide-react";

function BooleanCell({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1 text-foreground">
      <Check className="size-4 text-green-600" aria-hidden />
      Ja
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <Minus className="size-4" aria-hidden />
      Nej
    </span>
  );
}

function SortableHeader({
  column,
  children,
  className,
}: {
  column: { getCanSort: () => boolean; getIsSorted: () => false | "asc" | "desc"; getToggleSortingHandler: () => ((event: unknown) => void) | undefined };
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

export const politiciansColumns: ColumnDef<PoliticianWithNamnd>[] = [
  {
    id: "namn",
    accessorFn: (row) => cleanInvisibleUnicode(row.name ?? ""),
    header: ({ column }) => (
      <SortableHeader column={column}>
        <User className="size-3.5 text-muted-foreground shrink-0" aria-hidden />
        Namn
      </SortableHeader>
    ),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const a = (rowA.getValue("namn") as string) ?? "";
      const b = (rowB.getValue("namn") as string) ?? "";
      return a.localeCompare(b, "sv");
    },
    cell: ({ row }) => {
      const p = row.original;
      const slug = p.slug?.current ?? "";
      const href = `${ROUTE_BASE.POLITICIANS}/${slug}`.replace(/\/+/g, "/");
      const displayName = cleanInvisibleUnicode(p.name?.trim() ?? "Namn saknas");
      return (
        <Link
          href={href}
          className="flex items-center gap-3 font-medium text-foreground hover:text-primary hover:underline"
        >
          <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted">
            {p.image ? (
              <SanityImage
                image={p.image}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-xs text-muted-foreground" />
            )}
          </span>
          {displayName}
        </Link>
      );
    },
    enableColumnFilter: true,
    filterFn: (row, _columnId, filterValue: string) => {
      if (!filterValue || filterValue.trim() === "") return true;
      const name = cleanInvisibleUnicode(row.original.name ?? "").toLowerCase();
      const area = cleanInvisibleUnicode(
        row.original.livingArea?.name ?? ""
      ).toLowerCase();
      const q = filterValue.trim().toLowerCase();
      return name.includes(q) || area.includes(q);
    },
  },
  {
    id: "kommunalrad",
    accessorFn: (row) => row.kommunalrad?.active === true,
    header: "Kommunalråd",
    cell: ({ row }) => (
      <BooleanCell value={row.original.kommunalrad?.active === true} />
    ),
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue: string) => {
      if (!filterValue || filterValue === "all") return true;
      const val = row.original.kommunalrad?.active === true;
      if (filterValue === "ja") return val;
      if (filterValue === "nej") return !val;
      return true;
    },
  },
  {
    id: "partistyrelse",
    accessorFn: (row) => row.partyBoard?.active === true,
    header: "Partistyrelse",
    cell: ({ row }) => (
      <BooleanCell value={row.original.partyBoard?.active === true} />
    ),
    enableColumnFilter: true,
    filterFn: (row, _columnId, filterValue: string) => {
      if (!filterValue || filterValue === "all") return true;
      const val = row.original.partyBoard?.active === true;
      if (filterValue === "ja") return val;
      if (filterValue === "nej") return !val;
      return true;
    },
  },
  {
    id: "kommunfullmaktige",
    accessorFn: (row) => row.kommunfullmaktige?.active === true,
    header: "Kommunfullmäktige",
    cell: ({ row }) => (
      <BooleanCell value={row.original.kommunfullmaktige?.active === true} />
    ),
    enableColumnFilter: true,
    filterFn: (row, _columnId, filterValue: string) => {
      if (!filterValue || filterValue === "all") return true;
      const val = row.original.kommunfullmaktige?.active === true;
      if (filterValue === "ja") return val;
      if (filterValue === "nej") return !val;
      return true;
    },
  },
  {
    id: "namndLedare",
    accessorFn: (row) =>
      (row.namndPositions ?? []).some((p) => p.isLeader === true),
    header: "Gruppledare",
    cell: ({ row }) => (
      <BooleanCell
        value={(row.original.namndPositions ?? []).some(
          (p) => p.isLeader === true
        )}
      />
    ),
    enableColumnFilter: true,
    filterFn: (row, _columnId, filterValue: string) => {
      if (!filterValue || filterValue === "all") return true;
      const val = (row.original.namndPositions ?? []).some(
        (p) => p.isLeader === true
      );
      if (filterValue === "ja") return val;
      if (filterValue === "nej") return !val;
      return true;
    },
  },
  {
    id: "boendeomrade",
    accessorFn: (row) => cleanInvisibleUnicode(row.livingArea?.name ?? ""),
    header: ({ column }) => (
      <SortableHeader column={column}>
        <MapPin className="size-3.5 text-muted-foreground shrink-0" aria-hidden />
        Boendeområde
      </SortableHeader>
    ),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const a = (rowA.getValue("boendeomrade") as string) ?? "";
      const b = (rowB.getValue("boendeomrade") as string) ?? "";
      return a.localeCompare(b, "sv");
    },
    cell: ({ row }) => {
      const name = row.original.livingArea?.name;
      return (
        <span className="text-muted-foreground">
          {name ? cleanInvisibleUnicode(name) : "–"}
        </span>
      );
    },
  },
  {
    id: "politiskaOmraden",
    accessorFn: (row) =>
      (row.politicalAreas ?? [])
        .map((a) => a.politicalArea?.name)
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
        .map((a) => a.politicalArea?.name && cleanInvisibleUnicode(a.politicalArea.name))
        .filter(Boolean) as string[];
      return selected.every((name) => rowNames.includes(name));
    },
    cell: ({ row }) => {
      const areas = row.original.politicalAreas ?? [];
      const items = areas
        .map((a) => {
          const name = a.politicalArea?.name && cleanInvisibleUnicode(a.politicalArea.name);
          return name ? { name, iconName: a.politicalArea?.icon?.name } : null;
        })
        .filter(Boolean) as { name: string; iconName?: string | null }[];
      if (items.length === 0) return <span className="text-muted-foreground">–</span>;
      return (
        <div className="flex flex-wrap gap-1 max-w-[320px]">
          {items.map(({ name, iconName }) => {
            const Icon = getLucideIcon(iconName ?? undefined);
            return (
              <Badge
                key={name}
                variant="secondary"
                className="text-muted-foreground inline-flex items-center gap-1 text-xs font-normal py-0 px-1.5"
              >
                {Icon ? <Icon className="size-3 shrink-0" aria-hidden /> : null}
                {name}
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
      const p = row.original;
      const slug = p.slug?.current ?? "";
      const profileHref = `${ROUTE_BASE.POLITICIANS}/${slug}`.replace(/\/+/g, "/");
      const hasEmail = !!p.email?.trim();
      const hasPhone = !!p.phone?.trim();
      const hasAny = hasEmail || hasPhone;

      const copyProfileLink = () => {
        const url = typeof window !== "undefined" ? `${window.location.origin}${profileHref}` : profileHref;
        void navigator.clipboard?.writeText(url);
      };

      if (!hasAny) {
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
                <Link href={profileHref} className="flex items-center gap-2">
                  <User className="size-4" />
                  Öppna profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={profileHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink className="size-4" />
                  Öppna i ny flik
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyProfileLink} className="flex items-center gap-2">
                <Link2 className="size-4" />
                Kopiera länk
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }

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
              <Link href={profileHref} className="flex items-center gap-2">
                <User className="size-4" />
                Öppna profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={profileHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <ExternalLink className="size-4" />
                Öppna i ny flik
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyProfileLink} className="flex items-center gap-2">
              <Link2 className="size-4" />
              Kopiera länk
            </DropdownMenuItem>
            {hasEmail && (
              <DropdownMenuItem asChild>
                <a
                  href={`mailto:${p.email!.trim()}`}
                  className="flex items-center gap-2"
                >
                  <Mail className="size-4" />
                  Skicka e-post
                </a>
              </DropdownMenuItem>
            )}
            {hasPhone && (
              <DropdownMenuItem asChild>
                <a
                  href={`tel:${p.phone!.replace(/\D/g, "")}`}
                  className="flex items-center gap-2"
                >
                  <Phone className="size-4" />
                  Ring
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
