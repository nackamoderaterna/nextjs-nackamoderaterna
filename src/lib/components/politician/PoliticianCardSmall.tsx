import { SanityImage } from "../shared/SanityImage";

interface PoliticianCardSmallProps {
  name?: string;
  subtitle: string;
  image: any;
}

export function PoliticianCardSmall({
  name,
  subtitle,
  image,
}: PoliticianCardSmallProps) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
      <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0">
        <SanityImage fill image={image} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-sm truncate">{name}</h4>
        <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
      </div>
    </div>
  );
}
