import Link from "next/link";
import { SanityImage } from "../shared/SanityImage";
import { SocialLinks, type SocialLinksData } from "../shared/SocialLinks";

interface PoliticianHeroProps {
  name: string;
  location: string;
  email?: string;
  phone?: string;
  image: any;
  socialLinks?: SocialLinksData | null;
}

export function PoliticianHero({
  name,
  location,
  email,
  phone,
  image,
  socialLinks,
}: PoliticianHeroProps) {
  return (
    <div className="rounded-lg py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column - Info */}
        <div className="bg-muted p-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{name}</h1>
          <p className="text-muted-foreground mb-6">{location}</p>

          {/* Contact Info */}
          <div className="space-y-4 mb-8">
            {email && (
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Epost
                </p>
                <Link
                  href={`mailto:${email}`}
                  className="text-foreground hover:text-blue-600 transition-colors underline"
                >
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
                  className="text-foreground hover:text-blue-600 transition-colors underline"
                >
                  {phone}
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
