import { getLucideIcon } from "@/lib/utils/iconUtils";
import { SanityImage } from "../shared/SanityImage";

interface AreaHeroProps {
  icon?: { name?: string | null } | null;
  title: string;
  image?: any;
}

export function PoliticalAreaHero({ icon, title, image }: AreaHeroProps) {
  const Icon = icon?.name ? getLucideIcon(icon.name) : null;

  return (
    <section className="mb-12 border-b border-border rounded-lg pb-12 flex flex-col gap-8 ">
      <div className="flex items-center gap-4">
        {image && (
          <div className=" lg:w-24 lg:h-24 w-16 h-16 rounded">
            <SanityImage image={image} width={256} height={256} className="rounded" />
          </div>
        )}
        {Icon && (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
            <Icon className="h-7 w-7 text-brand-primary" />
          </div>
        )}
        <h1 className="text-4xl font-bold text-foreground">{title}</h1>
      </div>
    
    </section>
  );
}
