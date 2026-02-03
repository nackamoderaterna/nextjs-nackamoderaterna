"use client";

import Link from "next/link";
import { Button } from "@/lib/components/ui/button";
import { ButtonGroup } from "@/lib/components/ui/button-group";
import { Section } from "./Section";

type InPageNavProps = {
  entries: { id: string; label: string }[];
  label?: string;
  showLabel?: boolean;
};

export function InPageNav({
  entries,
  label = "Innehåll",
  showLabel = true,
}: InPageNavProps) {
  if (entries.length === 0) return null;

  return (
    <nav aria-label={label} className="w-full">
      <ButtonGroup aria-label={label} orientation="horizontal">
        {entries.map(({ id, label: entryLabel }) => (
          <Button key={id} variant="outline" size="default" asChild>
            <Link href={`#${id}`} scroll className="no-underline">
              {entryLabel}
            </Link>
          </Button>
        ))}
      </ButtonGroup>
    </nav>
  );
}
