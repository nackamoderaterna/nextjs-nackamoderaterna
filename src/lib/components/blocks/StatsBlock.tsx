import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";

interface Stat {
  value: string;
  label: string;
  description?: string;
}

interface StatsBlockProps {
  _type: "block.stats";
  heading?: { title?: string | null; subtitle?: string | null } | string;
  description?: string;
  stats: Stat[];
  columns?: 1 | 2 | 3 | 4; // Allow 1 column for single stat
}

export function StatsBlock({ block }: { block: StatsBlockProps }) {
  // Automatically determine columns based on number of stats
  const statsCount = block.stats?.length || 0;
  let autoColumns: 1 | 2 | 3 | 4 = 4;
  
  if (statsCount === 1) {
    autoColumns = 1; // Single column for 1 stat
  } else if (statsCount === 2) {
    autoColumns = 2; // 2 columns for 2 stats
  } else if (statsCount === 3) {
    autoColumns = 3; // 3 columns for 3 stats
  } else {
    autoColumns = 4; // 4 columns for 4+ stats
  }
  
  // Use manual columns if provided, otherwise use auto
  const columns = (block.columns || autoColumns) as 1 | 2 | 3 | 4;
  
  const gridCols: Record<number, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  const { title, subtitle } = getBlockHeading(block);

  return (
    <Block maxWidth="7xl">
        <BlockHeading title={title} subtitle={subtitle} className="mb-12" />
        <div className={`grid grid-cols-1 ${gridCols[columns] || gridCols[4]} gap-8`}>
          {block.stats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold mb-2">{stat.label}</div>
              {stat.description && (
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              )}
            </div>
          ))}
        </div>
    </Block>
  );
}
