"use client";

import type { Table } from "@tanstack/react-table";
import { ToggleGroup, ToggleGroupItem } from "@/lib/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/ui/popover";
import { Button } from "@/lib/components/ui/button";
import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
  ComboboxValue,
} from "@/lib/components/ui/combobox";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import { Tag, SlidersHorizontal, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Category filter                                                    */
/* ------------------------------------------------------------------ */

const KATEGORI_COLUMN_ID = "politiskaOmraden";

export type CategoryWithIcon = { name: string; iconName?: string | null };

interface PoliticalIssuesTableFiltersCategoryProps<TData> {
  table: Table<TData>;
  categories: CategoryWithIcon[];
}

function CategoryItemContent({
  name,
  iconName,
  className = "",
}: {
  name: string;
  iconName?: string | null;
  className?: string;
}) {
  const Icon = getLucideIcon(iconName ?? undefined);
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {Icon ? (
        <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
      ) : null}
      {name}
    </span>
  );
}

export function PoliticalIssuesTableFiltersCategory<TData>({
  table,
  categories,
}: PoliticalIssuesTableFiltersCategoryProps<TData>) {
  const selectedCategories =
    (table.getColumn(KATEGORI_COLUMN_ID)?.getFilterValue() as
      | string[]
      | undefined) ?? [];

  const handleValueChange = (value: string[] | null) => {
    const next = Array.isArray(value) && value.length > 0 ? value : undefined;
    table.getColumn(KATEGORI_COLUMN_ID)?.setFilterValue(next);
  };

  const categoryNames = categories.map((c) => c.name);
  const getCategory = (name: string) => categories.find((c) => c.name === name);

  if (categories.length === 0) return null;

  return (
    <div
      className="flex flex-col items-start gap-1.5"
      role="group"
      aria-label="Kategori"
    >
      <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
        <Tag className="size-3.5" aria-hidden />
        Kategori
      </span>
      <Combobox
        items={categoryNames}
        multiple
        value={selectedCategories}
        onValueChange={handleValueChange}
      >
        <ComboboxChips className="w-full min-w-64 max-w-md sm:min-w-80">
          <ComboboxValue>
            {selectedCategories.map((item) => {
              const cat = getCategory(item);
              return (
                <ComboboxChip key={item}>
                  <CategoryItemContent name={item} iconName={cat?.iconName} />
                </ComboboxChip>
              );
            })}
          </ComboboxValue>
          <ComboboxChipsInput placeholder="Välj kategori..." />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxEmpty>Inga kategorier hittades.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => {
              const cat = getCategory(item);
              return (
                <ComboboxItem key={item} value={item}>
                  <CategoryItemContent name={item} iconName={cat?.iconName} />
                </ComboboxItem>
              );
            }}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Kärnfrågor filter                                                  */
/* ------------------------------------------------------------------ */

const KERNFRAGA_COLUMN_ID = "kernfraga";
const KERNFRAGA_OPTIONS = ["all", "ja", "nej"] as const;
const KERNFRAGA_LABELS: Record<(typeof KERNFRAGA_OPTIONS)[number], string> = {
  all: "Alla",
  ja: "Ja",
  nej: "Nej",
};

interface PoliticalIssuesTableFiltersFeaturedProps<TData> {
  table: Table<TData>;
}

export function PoliticalIssuesTableFiltersFeatured<TData>({
  table,
}: PoliticalIssuesTableFiltersFeaturedProps<TData>) {
  const raw =
    (table.getColumn(KERNFRAGA_COLUMN_ID)?.getFilterValue() as string) ?? "all";
  const value = KERNFRAGA_OPTIONS.includes(raw as (typeof KERNFRAGA_OPTIONS)[number])
    ? (raw as (typeof KERNFRAGA_OPTIONS)[number])
    : "all";

  const isActive = value !== "all";

  return (
    <div className="flex items-center gap-1.5">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            aria-label="Kärnfrågorfilter"
          >
            <SlidersHorizontal
              className="size-3.5 text-muted-foreground"
              aria-hidden
            />
            Kärnfråga
            {isActive ? (
              <span className="text-muted-foreground">(1)</span>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto min-w-40 p-3" align="start">
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-xs font-medium">
              Kärnfråga
            </span>
            <ToggleGroup
              type="single"
              value={value}
              onValueChange={(v) => {
                if (v) {
                  table
                    .getColumn(KERNFRAGA_COLUMN_ID)
                    ?.setFilterValue(v === "all" ? undefined : v);
                }
              }}
              variant="outline"
              size="sm"
              className="inline-flex"
            >
              {KERNFRAGA_OPTIONS.map((opt) => (
                <ToggleGroupItem key={opt} value={opt}>
                  {KERNFRAGA_LABELS[opt]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </PopoverContent>
      </Popover>
      {isActive && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() =>
            table.getColumn(KERNFRAGA_COLUMN_ID)?.setFilterValue(undefined)
          }
          aria-label="Rensa kärnfrågorfilter"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status filter                                                      */
/* ------------------------------------------------------------------ */

const STATUS_COLUMN_ID = "status";
const STATUS_OPTIONS = ["all", "fulfilled", "not_fulfilled"] as const;
const STATUS_LABELS: Record<(typeof STATUS_OPTIONS)[number], string> = {
  all: "Alla",
  fulfilled: "Uppfyllt",
  not_fulfilled: "Ej uppfyllt",
};

interface PoliticalIssuesTableFiltersStatusProps<TData> {
  table: Table<TData>;
}

export function PoliticalIssuesTableFiltersStatus<TData>({
  table,
}: PoliticalIssuesTableFiltersStatusProps<TData>) {
  const raw =
    (table.getColumn(STATUS_COLUMN_ID)?.getFilterValue() as string) ?? "all";
  const value = STATUS_OPTIONS.includes(raw as (typeof STATUS_OPTIONS)[number])
    ? (raw as (typeof STATUS_OPTIONS)[number])
    : "all";

  const isActive = value !== "all";

  return (
    <div className="flex items-center gap-1.5">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            aria-label="Statusfilter"
          >
            <SlidersHorizontal
              className="size-3.5 text-muted-foreground"
              aria-hidden
            />
            Status
            {isActive ? (
              <span className="text-muted-foreground">(1)</span>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto min-w-40 p-3" align="start">
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-xs font-medium">
              Status
            </span>
            <ToggleGroup
              type="single"
              value={value}
              onValueChange={(v) => {
                if (v) {
                  table
                    .getColumn(STATUS_COLUMN_ID)
                    ?.setFilterValue(v === "all" ? undefined : v);
                }
              }}
              variant="outline"
              size="sm"
              className="inline-flex"
            >
              {STATUS_OPTIONS.map((opt) => (
                <ToggleGroupItem key={opt} value={opt}>
                  {STATUS_LABELS[opt]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </PopoverContent>
      </Popover>
      {isActive && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() =>
            table.getColumn(STATUS_COLUMN_ID)?.setFilterValue(undefined)
          }
          aria-label="Rensa statusfilter"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
