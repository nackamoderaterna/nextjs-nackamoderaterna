import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Sociala media
            </h3>
            <div className="flex gap-3">
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-secondary hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-secondary hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="Linkedin"
              >
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-secondary hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Meny</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/hem"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hem
                </Link>
              </li>
              <li>
                <Link
                  href="/politik"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Vår politik
                </Link>
              </li>
              <li>
                <Link
                  href="/nyheter"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Nyheter
                </Link>
              </li>
              <li>
                <Link
                  href="/foreningar"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Föreningar
                </Link>
              </li>
            </ul>
          </div>

          {/* Övergigt */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Övergigt</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/kontakt"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Kontakta oss
                </Link>
              </li>
              <li>
                <Link
                  href="/politik"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Vår politik
                </Link>
              </li>
              <li>
                <Link
                  href="/nyheter"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Nyheter
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontaktuppgifter */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Kontaktuppgifter
            </h3>
            <address className="not-italic text-sm text-muted-foreground space-y-1">
              <p>Stockholmsvägen 8</p>
              <p>Box 4372</p>
              <p>131 04, Nacka</p>
              <p className="mt-3">
                <a
                  href="mailto:nacka@moderaterna.se"
                  className="hover:text-foreground transition-colors underline"
                >
                  nacka@moderaterna.se
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
}
