import Block from "./Block";

interface Stat {
  value: string;
  label: string;
  description?: string;
}

interface StatsBlockProps {
  _type: "block.stats";
  heading?: string;
  description?: string;
  stats: Stat[];
  columns?: 2 | 3 | 4;
}

export function StatsBlock({ block }: { block: StatsBlockProps }) {
  const columns = block.columns || 4;
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <Block>
      <div className="max-w-6xl mx-auto">
        {(block.heading || block.description) && (
          <div className="text-center mb-12">
            {block.heading && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {block.heading}
              </h2>
            )}
            {block.description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {block.description}
              </p>
            )}
          </div>
        )}
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
          {block.stats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
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
      </div>
    </Block>
  );
}
