import Image from "next/image";
import { SanityImage } from "../shared/SanityImage";

interface AreaHeroProps {
  image: any;
  title: string;
}

export function PoliticalAreaHero({ image, title }: AreaHeroProps) {
  return (
    <section className="mb-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">{title}</h1>

      <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden mb-6">
        <SanityImage image={image} fill />
      </div>
    </section>
  );
}
