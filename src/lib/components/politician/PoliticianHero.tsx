import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SanityImage } from "../shared/SanityImage";

interface PoliticianHeroProps {
  name: string;
  location: string;
  email: string;
  phone: string;
  image: any;
  socialLinks?: {
    tiktok?: string;
    facebook?: string;
    instagram?: string;
  };
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
          </div>

          {/* Social Media */}
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-3">
              Sociala media
            </p>
            <div className="flex gap-3">
              {socialLinks?.tiktok && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={socialLinks.tiktok}>
                    <span className="mr-2">🎵</span>
                    TikTok
                  </Link>
                </Button>
              )}
              {socialLinks?.facebook && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={socialLinks.facebook}>
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Link>
                </Button>
              )}
              {socialLinks?.instagram && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={socialLinks.instagram}>
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Image */}
        <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
          <SanityImage image={image} />
        </div>
      </div>
    </div>
  );
}
