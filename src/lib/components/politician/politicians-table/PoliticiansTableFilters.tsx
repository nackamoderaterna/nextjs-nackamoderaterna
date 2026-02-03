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

const FILTER_OPTIONS = ["all", "ja", "nej"] as const;
const FILTER_LABELS: Record<(typeof FILTER_OPTIONS)[number], string> = {
  all: "Alla",
  ja: "Ja",
  nej: "Nej",
};

const FILTER_COLUMNS = [
  { id: "kommunalrad", label: "Kommunalråd" },
  { id: "partistyrelse", label: "Föreningsstyrelse" },
  { id: "kommunfullmaktige", label: "Kommunfullmäktige" },
  { id: "namndLedare", label: "Gruppledare" },
] as const;

const KATEGORI_COLUMN_ID = "politiskaOmraden";

interface PoliticiansTableFiltersProps<TData> {
  table: Table<TData>;
}

export function PoliticiansTableFilters<TData>({
  table,
}: PoliticiansTableFiltersProps<TData>) {
  const activeCount = FILTER_COLUMNS.filter(({ id }) => {
    const raw = (table.getColumn(id)?.getFilterValue() as string) ?? "all";
    return raw !== "all";
  }).length;

  const clearAllFilters = () => {
    for (const { id } of FILTER_COLUMNS) {
      table.getColumn(id)?.setFilterValue(undefined);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            aria-label="Filter"
          >
            <SlidersHorizontal
              className="size-3.5 text-muted-foreground"
              aria-hidden
            />
            Filter
            {activeCount > 0 ? (
              <span className="text-muted-foreground">({activeCount})</span>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto min-w-56 p-3" align="start">
          <div className="flex flex-col gap-3">
            {FILTER_COLUMNS.map(({ id, label }) => {
              const raw =
                (table.getColumn(id)?.getFilterValue() as string) ?? "all";
              const value = FILTER_OPTIONS.includes(
                raw as (typeof FILTER_OPTIONS)[number],
              )
                ? (raw as (typeof FILTER_OPTIONS)[number])
                : "all";

              return (
                <div
                  key={id}
                  className="flex flex-col items-start gap-1.5"
                  role="group"
                  aria-label={label}
                >
                  <span className="text-muted-foreground text-xs font-medium">
                    {label}
                  </span>
                  <ToggleGroup
                    type="single"
                    value={value}
                    onValueChange={(v) => {
                      if (v) {
                        table
                          .getColumn(id)
                          ?.setFilterValue(v === "all" ? undefined : v);
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="inline-flex"
                  >
                    {FILTER_OPTIONS.map((opt) => (
                      <ToggleGroupItem key={opt} value={opt}>
                        {FILTER_LABELS[opt]}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      {activeCount > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={clearAllFilters}
          aria-label="Rensa filter"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}

export type CategoryWithIcon = { name: string; iconName?: string | null };

interface PoliticiansTableFiltersCategoryProps<TData> {
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

export function PoliticiansTableFiltersCategory<TData>({
  table,
  categories,
}: PoliticiansTableFiltersCategoryProps<TData>) {
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
