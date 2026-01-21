"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactBlockProps {
  title?: string;
  description?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  messagePlaceholder?: string;
  submitText?: string;
  className?: string;
}

export function ContactBlock({
  title = "Kontakta oss",
  description = "Skicka in dina idéer, synpunkter eller frågor till oss så hör vi av oss.",
  namePlaceholder = "Ditt namn",
  emailPlaceholder = "exempel@nacka.se",
  messagePlaceholder = "Skriv ditt meddelande här...",
  submitText = "Skicka",
  className,
}: ContactBlockProps) {
  return (
    <section className={cn("w-full py-12 md:py-16 bg-muted/50", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {title}
          </h2>
          <p className="text-muted-foreground mb-8">{description}</p>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-muted-foreground">
                  Namn
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={namePlaceholder}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm text-muted-foreground"
                >
                  Epost
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={emailPlaceholder}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="message"
                className="text-sm text-muted-foreground"
              >
                Meddelande
              </Label>
              <Textarea
                id="message"
                placeholder={messagePlaceholder}
                rows={5}
                className="bg-background border-border resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="outline"
                className="px-6 bg-transparent"
              >
                {submitText}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
