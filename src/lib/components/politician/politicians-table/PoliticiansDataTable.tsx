"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { cleanInvisibleUnicode } from "@/lib/politicians";
import type { PoliticianWithNamnd } from "@/lib/politicians";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components/ui/table";
import { Button } from "@/lib/components/ui/button";
import { politiciansColumns } from "./columns";
import {
  PoliticiansTableFilters,
  PoliticiansTableFiltersCategory,
  type CategoryWithIcon,
} from "./PoliticiansTableFilters";
import { PoliticiansTableSearch } from "./PoliticiansTableSearch";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PoliticiansDataTableProps {
  data: PoliticianWithNamnd[];
}

const PAGE_SIZE = 10;

const COLUMN_WIDTH_CLASSES: Record<string, string> = {
  namn: "min-w-[220px]",
  boendeomrade: "min-w-[180px]",
  politiskaOmraden: "min-w-[260px]",
  actions: "w-0 min-w-0 whitespace-nowrap",
};

function getColumnClassName(columnId: string): string | undefined {
  return COLUMN_WIDTH_CLASSES[columnId];
}

function getUniqueCategories(data: PoliticianWithNamnd[]): CategoryWithIcon[] {
  const byName = new Map<string, string | null>();
  for (const p of data) {
    for (const pa of p.politicalAreas ?? []) {
      const name = pa.politicalArea?.name && cleanInvisibleUnicode(pa.politicalArea.name);
      if (name && !byName.has(name)) {
        byName.set(name, pa.politicalArea?.icon?.name ?? null);
      }
    }
  }
  return Array.from(byName.entries())
    .map(([name, iconName]) => ({ name, iconName }))
    .sort((a, b) => a.name.localeCompare(b.name, "sv"));
}

const FILTER_COLUMN_IDS = ["kommunalrad", "partistyrelse", "kommunfullmaktige", "namndLedare"] as const;

function buildUrl(params: URLSearchParams): string {
  const qs = params.toString();
  return qs ? `/politiker?${qs}` : "/politiker";
}

function columnFiltersFromParams(searchParams: URLSearchParams): ColumnFiltersState {
  const filters: ColumnFiltersState = [];
  for (const id of FILTER_COLUMN_IDS) {
    const val = searchParams.get(id);
    if (val === "ja" || val === "nej") {
      filters.push({ id, value: val });
    }
  }
  const cats = searchParams.get("categories");
  if (cats) {
    filters.push({ id: "politiskaOmraden", value: cats.split(",") });
  }
  return filters;
}

function syncParamsFromState(
  searchParams: URLSearchParams,
  globalFilter: string,
  columnFilters: ColumnFiltersState
): URLSearchParams {
  const params = new URLSearchParams();
  // Preserve view param
  const view = searchParams.get("view");
  if (view) params.set("view", view);

  if (globalFilter.trim()) params.set("search", globalFilter.trim());

  for (const f of columnFilters) {
    if (FILTER_COLUMN_IDS.includes(f.id as (typeof FILTER_COLUMN_IDS)[number])) {
      if (f.value === "ja" || f.value === "nej") {
        params.set(f.id, f.value as string);
      }
    }
    if (f.id === "politiskaOmraden" && Array.isArray(f.value) && f.value.length > 0) {
      params.set("categories", (f.value as string[]).join(","));
    }
  }
  return params;
}

export function PoliticiansDataTable({ data }: PoliticiansDataTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearch = searchParams.get("search") ?? "";
  const initialColumnFilters = React.useMemo(
    () => columnFiltersFromParams(searchParams),
    // Only compute on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [globalFilter, setGlobalFilter] = React.useState(initialSearch);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialColumnFilters);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const categories = React.useMemo(() => getUniqueCategories(data), [data]);

  // Sync state changes to URL
  const updateUrl = React.useCallback(
    (nextGlobal: string, nextColumnFilters: ColumnFiltersState) => {
      const params = syncParamsFromState(searchParams, nextGlobal, nextColumnFilters);
      router.replace(buildUrl(params), { scroll: false });
    },
    [searchParams, router]
  );

  const handleGlobalFilterChange = React.useCallback(
    (value: string) => {
      setGlobalFilter(value);
      updateUrl(value, columnFilters);
    },
    [updateUrl, columnFilters]
  );

  const handleColumnFiltersChange = React.useCallback(
    (updater: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => {
      setColumnFilters((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        updateUrl(globalFilter, next);
        return next;
      });
    },
    [updateUrl, globalFilter]
  );

  const table = useReactTable({
    data,
    columns: politiciansColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: handleGlobalFilterChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onSortingChange: setSorting,
    state: {
      globalFilter,
      columnFilters,
      sorting,
    },
    initialState: {
      pagination: { pageSize: PAGE_SIZE },
      columnVisibility: {
        kommunalrad: false,
        partistyrelse: false,
        kommunfullmaktige: false,
        namndLedare: false,
      },
    },
    globalFilterFn: (row, _columnId, filterValue: string) => {
      if (!filterValue || String(filterValue).trim() === "") return true;
      const p = row.original;
      const name = cleanInvisibleUnicode(p.name ?? "").toLowerCase();
      const livingArea = cleanInvisibleUnicode(p.livingArea?.name ?? "").toLowerCase();
      const politicalAreas = (p.politicalAreas ?? [])
        .map((a) => cleanInvisibleUnicode(a.politicalArea?.name ?? "").toLowerCase())
        .join(" ");
      const q = String(filterValue).trim().toLowerCase();
      return (
        name.includes(q) ||
        livingArea.includes(q) ||
        politicalAreas.includes(q)
      );
    },
  });

  const rows = table.getRowModel().rows;
  const pageCount = table.getPageCount();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
        <PoliticiansTableSearch
          value={globalFilter ?? ""}
          onChange={handleGlobalFilterChange}
        />
        <PoliticiansTableFiltersCategory table={table} categories={categories} />
        <PoliticiansTableFilters table={table} />
      </div>

      <div className="overflow-hidden rounded-md">
        <Table className="mx-auto w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={getColumnClassName(header.column.id)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={politiciansColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Inga politiker matchar sökningen eller filtren.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={getColumnClassName(cell.column.id)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {rows.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} politiker
            {globalFilter ? " (efter sökning/filter)" : ""}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-4" />
              Föregående
            </Button>
            <span className="text-sm text-muted-foreground">
              Sida {table.getState().pagination.pageIndex + 1} av {pageCount || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Nästa
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
