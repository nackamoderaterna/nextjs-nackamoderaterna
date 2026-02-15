import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/lib/components/ui/button";

export const metadata: Metadata = {
  title: "Sidan hittades inte – Nackamoderaterna",
};

export default function NotFound() {
  return (
    <div className="w-full border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col max-w-sm gap-4">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Sidan hittades inte
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Sidan du letar efter finns inte eller har flyttats.
          </p>
          <div className="mt-2">
            <Button asChild size="lg">
              <Link href="/">Till startsidan</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
