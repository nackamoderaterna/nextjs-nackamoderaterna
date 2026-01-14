"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { GlobalSettings } from "~/sanity.types";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";

const formSchema = z.object({
  name: z.string().min(2, { message: "Namnet måste vara minst 2 tecken" }),
  email: z.string().email({ message: "Ange en giltig e-postadress" }),
  message: z
    .string()
    .min(10, { message: "Meddelandet måste vara minst 10 tecken" }),
});

interface ContactPageClientProps {
  settings: GlobalSettings;
}

export function ContactPageClient({ settings }: ContactPageClientProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    alert("Tack för ditt meddelande! Vi återkommer så snart som möjligt.");
    form.reset();
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Kontakta oss</h1>
        <p className="text-muted-foreground text-lg mb-12">
          Har du frågor eller vill komma i kontakt med oss? Fyll i formuläret
          nedan så återkommer vi så snart som möjligt.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-muted p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Skicka ett meddelande</h2>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FieldGroup>
                  <FieldLegend className="sr-only">Kontaktformulär</FieldLegend>

                  {/* Name */}
                  <Field>
                    <FieldLabel htmlFor="name">Namn</FieldLabel>
                    <Input
                      id="name"
                      placeholder="Ditt namn"
                      className="bg-white"
                      {...form.register("name")}
                    />
                  </Field>

                  {/* Email */}
                  <Field>
                    <FieldLabel htmlFor="email">E-post</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="din.email@example.com"
                      className="bg-white"
                      {...form.register("email")}
                    />
                  </Field>

                  {/* Message */}
                  <Field>
                    <FieldLabel htmlFor="message">Meddelande</FieldLabel>
                    <Textarea
                      id="message"
                      placeholder="Skriv ditt meddelande här..."
                      className="min-h-32 bg-white"
                      {...form.register("message")}
                    />
                  </Field>
                </FieldGroup>

                <Button type="submit" size="lg" className="w-full md:w-auto">
                  Skicka meddelande
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Kontaktuppgifter</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <IconMail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">E-post</p>
                    <Link
                      href="mailto:nacka@moderaterna.se"
                      className="text-sm text-primary hover:underline"
                    >
                      nacka@moderaterna.se
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconPhone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">Telefon</p>
                    <Link
                      href="tel:08-123456789"
                      className="text-sm text-primary hover:underline"
                    >
                      08-123 456 789
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconMapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">Adress</p>
                    <p className="text-sm text-muted-foreground">
                      Nackamoderaterna
                      <br />
                      Box 4122
                      <br />
                      131 04 Nacka
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
