import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconGlobe,
  IconGlobeFilled,
  IconMail,
} from "@tabler/icons-react";
import { SanityImage } from "../shared/SanityImage";
import { Politician } from "~/sanity.types";

interface PoliticianCardLargeProps {
  image: any;
  name?: string;
  subtitle: string;
}

export function PoliticianCardLarge({
  image,
  name,
  subtitle,
}: PoliticianCardLargeProps) {
  return (
    <div className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative aspect-[3/4]">
        <SanityImage fill image={image} />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{subtitle}</p>
        <div className="flex gap-3">
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconMail className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconBrandInstagram className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconBrandFacebook className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconGlobe className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
