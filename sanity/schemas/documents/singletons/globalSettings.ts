import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'globalSettings',
  title: 'Globala Inställningar',
  type: 'document',
  fields: [
    //
    // ─────────────────────────
    // Company Information
    // ─────────────────────────
    //
    defineField({
      name: 'companyName',
      title: 'Företagsnamn',
      type: 'string',
    }),

    defineField({
      name: 'logo',
      title: 'Logotyp',
      type: 'image',
      options: {hotspot: true},
    }),

    //
    // ─────────────────────────
    // Contact Information
    // ─────────────────────────
    //
    defineField({
      name: 'contactInfo',
      title: 'Kontaktuppgifter',
      type: 'object',
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
      name: 'postAddress',
      title: 'Postadress',
      type: 'object',
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
      name: 'visitingAddress',
      title: 'Besöksadress',
      type: 'object',
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
      name: 'socialLinks',
      title: 'Sociala Medier',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'social',
          fields: [
            defineField({
              name: 'platform',
              title: 'Plattform',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO (Standard)',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Titel (Standard)',
          type: 'string',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Beskrivning (Standard)',
          type: 'text',
        }),
        defineField({
          name: 'openGraphImage',
          title: 'OG-bild (Standard)',
          type: 'image',
          options: {hotspot: true},
        }),
      ],
    }),
    //
    // ─────────────────────────
    // Handlingsprogram
    // ─────────────────────────
    //
    defineField({
      name: 'handlingsprogram',
      title: 'Handlingsprogram',
      description: 'Ladda upp handlingsprogrammet som PDF',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    }),
  ],
})
