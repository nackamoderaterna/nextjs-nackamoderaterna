"use client";

import * as React from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components/ui/table";
import { Button } from "@/lib/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { politicalIssuesColumns } from "./columns";
import {
  PoliticalIssuesTableFiltersCategory,
  PoliticalIssuesTableFiltersGeo,
  PoliticalIssuesTableFiltersFeatured,
  PoliticalIssuesTableFiltersStatus,
  type CategoryWithIcon,
} from "./PoliticalIssuesTableFilters";
import { PoliticalIssuesTableSearch } from "./PoliticalIssuesTableSearch";
import type { PoliticalIssueWithAreas } from "./types";

interface PoliticalIssuesDataTableProps {
  data: PoliticalIssueWithAreas[];
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
const DEFAULT_PAGE_SIZE = 10;

const COLUMN_WIDTH_CLASSES: Record<string, string> = {
  fraga: "min-w-[260px]",
  status: "min-w-[100px]",
  politiskaOmraden: "min-w-[260px]",
  actions: "w-0 min-w-0 whitespace-nowrap",
};

function getColumnClassName(columnId: string): string | undefined {
  return COLUMN_WIDTH_CLASSES[columnId];
}

function getUniqueCategories(
  data: PoliticalIssueWithAreas[],
): CategoryWithIcon[] {
  const byName = new Map<string, string | null>();
  for (const issue of data) {
    for (const area of issue.politicalAreas ?? []) {
      if (area.name && !byName.has(area.name)) {
        byName.set(area.name, area.icon?.name ?? null);
      }
    }
  }
  return Array.from(byName.entries())
    .map(([name, iconName]) => ({ name, iconName }))
    .sort((a, b) => a.name.localeCompare(b.name, "sv"));
}

function getUniqueGeoAreas(data: PoliticalIssueWithAreas[]): string[] {
  const names = new Set<string>();
  for (const issue of data) {
    for (const area of issue.geographicalAreas ?? []) {
      if (area.name) names.add(area.name);
    }
  }
  return Array.from(names).sort((a, b) => a.localeCompare(b, "sv"));
}

export function PoliticalIssuesDataTable({
  data,
}: PoliticalIssuesDataTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const categories = React.useMemo(() => getUniqueCategories(data), [data]);
  const geoAreas = React.useMemo(() => getUniqueGeoAreas(data), [data]);

  const table = useReactTable({
    data,
    columns: politicalIssuesColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    state: {
      globalFilter,
      columnFilters,
      sorting,
    },
    initialState: {
      pagination: { pageSize: DEFAULT_PAGE_SIZE },
      columnVisibility: {
        kernfraga: false,
        status: false,
        geografiskaOmraden: false,
      },
    },
    globalFilterFn: (row, _columnId, filterValue: string) => {
      if (!filterValue || String(filterValue).trim() === "") return true;
      const issue = row.original;
      const question = (issue.question ?? "").toLowerCase();
      const politicalAreas = (issue.politicalAreas ?? [])
        .map((a: { name: string }) => (a.name ?? "").toLowerCase())
        .join(" ");
      const geographicalAreas = (issue.geographicalAreas ?? [])
        .map((a: { name: string }) => (a.name ?? "").toLowerCase())
        .join(" ");
      const q = String(filterValue).trim().toLowerCase();
      return (
        question.includes(q) ||
        politicalAreas.includes(q) ||
        geographicalAreas.includes(q)
      );
    },
  });

  const rows = table.getRowModel().rows;
  const pageCount = table.getPageCount();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap w-full items-end gap-2 gap-y-4">
        <PoliticalIssuesTableSearch
          value={globalFilter ?? ""}
          onChange={setGlobalFilter}
        />
        <div className="flex gap-2 w-full max-w-lg">
          <PoliticalIssuesTableFiltersCategory
            table={table}
            categories={categories}
          />
          <PoliticalIssuesTableFiltersGeo table={table} areas={geoAreas} />
        </div>
        <div className="flex gap-2">
          <PoliticalIssuesTableFiltersFeatured table={table} />
          <PoliticalIssuesTableFiltersStatus table={table} />
        </div>
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
                          header.getContext(),
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
                  colSpan={politicalIssuesColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Inga sakfrågor matchar sökningen eller filtren.
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
                        cell.getContext(),
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
        <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} sakfrågor
            {globalFilter ? " (efter sökning/filter)" : ""}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Visa</span>
              <Select
                value={String(table.getState().pagination.pageSize)}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                Sida {table.getState().pagination.pageIndex + 1} av{" "}
                {pageCount || 1}
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
        </div>
      )}
    </div>
  );
}
