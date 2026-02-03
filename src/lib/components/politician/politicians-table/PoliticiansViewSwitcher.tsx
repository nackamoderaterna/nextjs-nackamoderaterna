"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import type { PoliticianWithNamnd } from "@/lib/politicians";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { PoliticiansDataTable } from "./PoliticiansDataTable";
import { LayoutGrid, Table } from "lucide-react";

interface PoliticiansViewSwitcherProps {
  politicians: PoliticianWithNamnd[];
  children: React.ReactNode;
}

export function PoliticiansViewSwitcher({
  politicians,
  children,
}: PoliticiansViewSwitcherProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get("view") === "table" ? "table" : "cards";

  const handleViewChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "table") {
        params.set("view", "table");
      } else {
        params.delete("view");
      }
      const qs = params.toString();
      router.push(qs ? `/politiker?${qs}` : "/politiker");
    },
    [searchParams, router]
  );

  return (
    <Tabs value={view} onValueChange={handleViewChange} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="cards" className="gap-2">
          <LayoutGrid className="size-4" />
          Kortvy
        </TabsTrigger>
        <TabsTrigger value="table" className="gap-2">
          <Table className="size-4" />
          Tabell
        </TabsTrigger>
      </TabsList>
      <TabsContent value="cards" className="mt-0">
        {children}
      </TabsContent>
      <TabsContent value="table" className="mt-0">
        <PoliticiansDataTable data={politicians} />
      </TabsContent>
    </Tabs>
  );
}
