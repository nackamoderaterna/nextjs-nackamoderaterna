import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { SanityImage } from "../shared/SanityImage";
import { SocialLinks, type SocialLinksData } from "../shared/SocialLinks";
import { ROUTE_BASE } from "@/lib/routes";
import { formatPhoneNumber } from "@/lib/utils/phoneUtils";

interface PoliticianHeroProps {
  name: string;
  location: string;
  locationSlug: string;
  email?: string;
  phone?: string;
  image: any;
  socialLinks?: SocialLinksData | null;
}

export function PoliticianHero({
  name,
  location,
  locationSlug,
  email,
  phone,
  image,
  socialLinks,
}: PoliticianHeroProps) {
  return (
    <div className="rounded-lg py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column - Info */}
        <div className="bg-muted p-8 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-foreground">{name}</h1>
          <Link href={`${ROUTE_BASE.AREAS}/${locationSlug}`} className="text-muted-foreground hover:text-primary transition-colors">{location}</Link>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            {email && (
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Epost
                </p>
                <Link
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {email}
                </Link>
              </div>
            )}
            {phone && (
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Telefon
                </p>
                <Link
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {formatPhoneNumber(phone)}
                </Link>
              </div>
            )}
          </div>

          {/* Social Media */}
          <SocialLinks
            links={socialLinks}
            variant="default"
            heading="Sociala media"
          />
        </div>

        {/* Right column - Image */}
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
          <SanityImage image={image} fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}
