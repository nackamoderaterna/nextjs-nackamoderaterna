import Link from "next/link";
import type { Metadata } from "next";
import { Fragment } from "react";
import { groq } from "next-sanity";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { Separator } from "@/lib/components/ui/separator";
import { sanityClient } from "@/lib/sanity/client";
import { globalSettingsQuery, type GlobalSettingsData } from "@/lib/queries/globalSettings";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { formatPhoneNumber } from "@/lib/utils/phoneUtils";
import { ROUTE_BASE } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Sidan hittades inte – Nackamoderaterna",
};

const kommunalradQuery = groq`
  *[_type == "politician" && kommunalrad.active == true] | order(kommunalrad.role desc, name asc) {
    _id,
    name,
    slug,
    image{ ..., hotspot, crop },
    email,
    phone,
    "role": kommunalrad.role,
  }
`;

type KommunalradPolitician = {
  _id: string;
  name?: string | null;
  slug?: { current?: string } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
};

type ContactEntry = {
  id: string;
  name?: string | null;
  slug?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
  email?: string | null;
  phone?: string | null;
};

function ContactGrid({ rows }: { rows: ContactEntry[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] w-full">
      {rows.map((row, i) => {
        const isLast = i === rows.length - 1;
        // Desktop: all three cells get a divider. Mobile: only the phone cell
        // (last in the stacked group) gets a divider — keeps email/phone visually
        // grouped under the name without extra lines between them.
        const desktopBorder = isLast ? "" : "sm:border-b sm:border-border";
        const mobileBorder  = isLast ? "" : "border-b border-border";

        const nameNode = row.slug ? (
          <Link
            href={`${ROUTE_BASE.POLITICIANS}/${row.slug}`}
            className="font-medium text-foreground hover:underline"
          >
            {row.name}
          </Link>
        ) : (
          <span className="font-medium text-foreground">{row.name}</span>
        );

        return (
          <Fragment key={row.id}>
            {/* Name column */}
            <div className={`flex items-center gap-3 pt-5 pb-3 sm:py-3 sm:pr-6 ${desktopBorder}`}>
              {row.image && (
                <div className="size-10 rounded-md overflow-hidden bg-muted border border-border shrink-0">
                  <SanityImage
                    image={row.image}
                    alt={row.name ?? ""}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    sizes="40px"
                  />
                </div>
              )}
              {nameNode}
            </div>

            {/* Email column */}
            <div className={`pb-2.5 sm:py-3 sm:px-6 text-sm text-muted-foreground ${desktopBorder}`}>
              {row.email && (
                <a
                  href={`mailto:${row.email}`}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors whitespace-nowrap"
                >
                  <Mail className="size-3.5 shrink-0" />
                  {row.email}
                </a>
              )}
            </div>

            {/* Phone column */}
            <div className={`pb-5 sm:py-3 sm:pl-6 text-sm text-muted-foreground ${desktopBorder} ${mobileBorder}`}>
              {row.phone && (
                <a
                  href={`tel:${row.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors whitespace-nowrap"
                >
                  <Phone className="size-3.5 shrink-0" />
                  {formatPhoneNumber(row.phone)}
                </a>
              )}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

export default async function NotFound() {
  const [settings, kommunalrad] = await Promise.all([
    sanityClient.fetch<GlobalSettingsData>(globalSettingsQuery, {}, { next: { revalidate: 3600 } }),
    sanityClient.fetch<KommunalradPolitician[]>(kommunalradQuery, {}, { next: { revalidate: 3600 } }),
  ]);

  const press = settings?.pressContactInfo;
  const hasPressContact = press?.contactPerson || press?.email || press?.phone;

  const kommunalradRows: ContactEntry[] = kommunalrad.map((p) => ({
    id: p._id,
    name: p.name,
    slug: p.slug?.current ?? null,
    image: p.image,
    email: p.email,
    phone: p.phone,
  }));

  const pressRows: ContactEntry[] = hasPressContact && press
    ? [{ id: "press", name: press.contactPerson, email: press.email, phone: press.phone }]
    : [];

  return (
    <div className="w-full">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* Hero */}
        <div className="mb-8">
          <p className="text-6xl font-bold text-muted-foreground/20 leading-none select-none mb-3">
            404
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Sidan hittades inte
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed">
            Sidan finns inte längre eller har fått en ny adress. Hitta det du söker via startsidan, eller kontakta oss direkt.
          </p>
          <div className="mt-4">
            <Button asChild size="sm">
              <Link href="/">
                <ArrowLeft className="size-3.5" />
                Till startsidan
              </Link>
            </Button>
          </div>
        </div>

        {(kommunalradRows.length > 0 || pressRows.length > 0) && (
          <div className="space-y-8">

            {kommunalradRows.length > 0 && (
              <div>
                <Separator className="mb-4" />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Kommunalråd
                </p>
                <ContactGrid rows={kommunalradRows} />
              </div>
            )}

            {pressRows.length > 0 && (
              <div>
                <Separator className="mb-4" />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Presskontakt
                </p>
                <ContactGrid rows={pressRows} />
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
