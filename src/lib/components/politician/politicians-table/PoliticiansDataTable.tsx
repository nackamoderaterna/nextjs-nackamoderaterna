"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnFiltersState,
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

export function PoliticiansDataTable({ data }: PoliticiansDataTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const categories = React.useMemo(() => getUniqueCategories(data), [data]);

  const table = useReactTable({
    data,
    columns: politiciansColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    state: {
      globalFilter,
      columnFilters,
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PoliticiansTableSearch
          value={globalFilter ?? ""}
          onChange={setGlobalFilter}
        />
        <PoliticiansTableFilters table={table} />
      </div>
      <PoliticiansTableFiltersCategory table={table} categories={categories} />

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
