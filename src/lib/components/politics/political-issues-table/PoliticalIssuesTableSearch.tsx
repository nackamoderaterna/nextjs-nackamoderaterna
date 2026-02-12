"use client";

import { Input } from "@/lib/components/ui/input";
import { Search } from "lucide-react";

interface PoliticalIssuesTableSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function PoliticalIssuesTableSearch({
  value,
  onChange,
}: PoliticalIssuesTableSearchProps) {
  return (
    <div className="relative w-full min-w-0 md:flex-1">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Sök sakfråga..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
