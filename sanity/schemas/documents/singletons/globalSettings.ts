import { defineField, defineType } from "sanity";

export default defineType({
  name: "globalSettings",
  title: "Globala Inställningar",
  type: "document",
  groups: [
    { name: "company", title: "Företag", default: true },
    { name: "contact", title: "Kontakt" },
    { name: "address", title: "Adress" },
    { name: "social", title: "Sociala medier" },
    { name: "seo", title: "SEO" },
    { name: "documents", title: "Dokument" },
  ],
  fields: [
    defineField({
      name: "companyName",
      title: "Företagsnamn",
      type: "string",
      group: "company",
    }),
    defineField({
      name: "logo",
      title: "Logotyp",
      type: "image",
      group: "company",
      options: { hotspot: true },
    }),
    defineField({
      name: "contactInfo",
      title: "Kontaktuppgifter",
      type: "object",
      group: "contact",
      fields: [
        defineField({
          name: 'phone',
          title: 'Telefonnummer',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'E-postadress',
          type: 'string',
        }),
        defineField({
          name: 'contactPerson',
          title: 'Kontaktperson',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: "pressContactInfo",
      title: "Presskontakt",
      type: "object",
      group: "contact",
      fields: [
        defineField({
          name: 'phone',
          title: 'Telefonnummer',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'E-postadress',
          type: 'string',
        }),
        defineField({
          name: 'contactPerson',
          title: 'Kontaktperson',
          type: 'string',
        }),
      ],
    }),

    //
    // ─────────────────────────
    // Address
    // ─────────────────────────
    //
    defineField({
      name: "postAddress",
      title: "Postadress",
      type: "object",
      group: "address",
      fields: [
        defineField({
          name: 'street',
          title: 'Gatuadress',
          type: 'string',
        }),
        defineField({
          name: 'zip',
          title: 'Postnummer',
          type: 'string',
        }),
        defineField({
          name: 'city',
          title: 'Stad',
          type: 'string',
        }),
        defineField({
          name: 'country',
          title: 'Land',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: "visitingAddress",
      title: "Besöksadress",
      type: "object",
      group: "address",
      fields: [
        defineField({
          name: 'street',
          title: 'Gatuadress',
          type: 'string',
        }),
        defineField({
          name: 'zip',
          title: 'Postnummer',
          type: 'string',
        }),
        defineField({
          name: 'city',
          title: 'Stad',
          type: 'string',
        }),
        defineField({
          name: 'country',
          title: 'Land',
          type: 'string',
        }),
      ],
    }),

    //
    // ─────────────────────────
    // Social Links
    // ─────────────────────────
    //
    defineField({
      name: "socialLinks",
      title: "Sociala medier",
      description: "Länkar till sociala medier. Visas i sidfoten på webbplatsen.",
      type: "socialLinks",
      group: "social",
    }),
    defineField({
      name: "seo",
      title: "SEO (Standard)",
      description:
        "Standard SEO-inställningar (titel, beskrivning, nyckelord och bild) som kan användas som fallback.",
      type: "seo",
      group: "seo",
    }),
    defineField({
      name: "handlingsprogram",
      title: "Handlingsprogram",
      description: "Ladda upp handlingsprogrammet som PDF",
      type: "file",
      group: "documents",
      options: {
        accept: ".pdf",
      },
    }),
  ],
});
