"use client";

import Link from "next/link";
import { Button } from "@/lib/components/ui/button";
import { ButtonGroup } from "@/lib/components/ui/button-group";
import { Section } from "./Section";

type InPageNavProps = {
  entries: { id: string; label: string }[];
  label?: string;
};

export function InPageNav({ entries, label = "Innehåll" }: InPageNavProps) {
  if (entries.length === 0) return null;

  return (
    <Section id="innehåll" title="Innehåll" className="scroll-mt-24">
    <nav aria-label={label} className="w-full pb-8 border-b border-border
    ">
      <ButtonGroup
        aria-label={label}
        orientation="horizontal"
        
      >
        {entries.map(({ id, label: entryLabel }) => (
          <Button key={id} variant="ghost" size="default" asChild>
            <Link href={`#${id}`} scroll className="no-underline">
              {entryLabel}
            </Link>
          </Button>
        ))}
      </ButtonGroup>
    </nav>
    </Section>
  );
}
