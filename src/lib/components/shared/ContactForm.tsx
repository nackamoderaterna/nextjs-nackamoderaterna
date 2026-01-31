"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/lib/components/ui/button";
import { Textarea } from "@/lib/components/ui/textarea";
import { Input } from "@/lib/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldError,
  FieldLabel,
} from "@/lib/components/ui/field";
import { useState } from "react";
import { ROUTE_BASE } from "@/lib/routes";

const formSchema = z.object({
  name: z.string().min(2, { message: "Namnet måste vara minst 2 tecken" }),
  email: z.email({ message: "Ange en giltig e-postadress" }),
  phone: z.string().optional(),
  message: z
    .string()
    .min(10, { message: "Meddelandet måste vara minst 10 tecken" }),
});

export interface ContactFormProps {
  heading?: string;
  description?: string;
  className?: string;
}

export function ContactForm({ heading, description, className = "" }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch(ROUTE_BASE.API_CONTACT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setSubmitStatus({
            type: "error",
            message:
              "För många förfrågningar. Vänta en stund innan du försöker igen.",
          });
          return;
        }
        throw new Error(data.error || "Något gick fel");
      }

      setSubmitStatus({
        type: "success",
        message: "Tack för ditt meddelande! Vi återkommer så snart som möjligt.",
      });
      form.reset();
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Kunde inte skicka meddelandet. Försök igen senare.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={className}>
      {heading && (
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{heading}</h2>
      )}

      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}

      {submitStatus.type === "success" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 ">
          {submitStatus.message}
        </div>
      )}

      {submitStatus.type === "error" && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <FieldLegend className="sr-only">Kontaktformulär</FieldLegend>

          <Field>
            <FieldLabel htmlFor="name">Namn</FieldLabel>
            <Input
              id="name"
              placeholder="Ditt namn"
              disabled={isSubmitting}
              {...form.register("name")}
              required
            />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">E-post</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="din.email@example.com"
              disabled={isSubmitting}
              {...form.register("email")}
              required
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Telefonnummer (valfritt)</FieldLabel>
            <Input
              id="phone"
              type="tel"
              placeholder="070-123 45 67"
              disabled={isSubmitting}
              {...form.register("phone")}
            />
            <FieldError errors={[form.formState.errors.phone]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="message">Meddelande</FieldLabel>
            <Textarea
              id="message"
              placeholder="Skriv ditt meddelande här..."
              className="min-h-32"
              required
              disabled={isSubmitting}
              {...form.register("message")}
            />
            <FieldError errors={[form.formState.errors.message]} />
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Skickar..." : "Skicka meddelande"}
        </Button>
      </form>
    </div>
  );
}
