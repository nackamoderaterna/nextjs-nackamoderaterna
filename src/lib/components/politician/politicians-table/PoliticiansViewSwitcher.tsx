"use client";

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
  return (
    <Tabs defaultValue="cards" className="w-full">
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
