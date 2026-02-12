"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { LayoutGrid, Table } from "lucide-react";
import { PoliticalIssuesDataTable } from "./PoliticalIssuesDataTable";
import { PoliticalIssueItem } from "../PoliticalIssueItem";
import { ResponsiveGrid } from "@/lib/components/shared/ResponsiveGrid";
import { ROUTE_BASE } from "@/lib/routes";
import type { PoliticalIssueWithAreas } from "./types";

interface PoliticalIssuesViewSwitcherProps {
  data: PoliticalIssueWithAreas[];
}

export function PoliticalIssuesViewSwitcher({
  data,
}: PoliticalIssuesViewSwitcherProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get("view") === "cards" ? "cards" : "table";

  const handleViewChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "cards") {
        params.set("view", "cards");
      } else {
        params.delete("view");
      }
      const qs = params.toString();
      router.push(qs ? `${ROUTE_BASE.POLITICS_ISSUES}?${qs}` : ROUTE_BASE.POLITICS_ISSUES);
    },
    [searchParams, router],
  );

  return (
    <Tabs value={view} onValueChange={handleViewChange} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="table" className="gap-2">
          <Table className="size-4" />
          Tabell
        </TabsTrigger>
        <TabsTrigger value="cards" className="gap-2">
          <LayoutGrid className="size-4" />
          Kortvy
        </TabsTrigger>
      </TabsList>
      <TabsContent value="table" className="mt-0">
        <PoliticalIssuesDataTable data={data} />
      </TabsContent>
      <TabsContent value="cards" className="mt-0">
        <ResponsiveGrid cols={3}>
          {data.map((issue) => (
            <PoliticalIssueItem
              key={issue._id}
              title={issue.question || ""}
              description={issue.description}
              politicalAreas={issue.politicalAreas}
              geographicalAreas={issue.geographicalAreas ?? []}
              issueSlug={issue.slug?.current}
              fulfilled={!!issue.fulfilled}
              featured={!!issue.featured}
            />
          ))}
        </ResponsiveGrid>
      </TabsContent>
    </Tabs>
  );
}
