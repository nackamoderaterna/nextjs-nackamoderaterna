import {defineType} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Sidor',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      description: 'URL-vänlig identifierare för sidan. Genereras automatiskt från titeln. Används för att skapa sidans URL.',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Beskrivning',
      type: 'text',
      description: 'En kort beskrivning av sidan. Används som fallback för SEO om ingen SEO-beskrivning är angiven.',
      rows: 3,
    },
    {
      name: 'blocks',
      title: 'Sidkomponenter',
      description: 'Bygg upp sidan med olika komponenter (block). Dra och släpp för att ändra ordning.',
      type: 'array',
      of: [
        {type: 'block.text'},
        {type: 'block.hero'},
        {type: 'block.image'},
        {type: 'block.video'},
        {type: 'block.politician'},
        {type: 'block.news'},
        {type: 'block.cta'},
        {type: 'block.stats'},
        {type: 'block.twoColumn'},
        {type: 'block.accordion'},
        {type: 'block.quote'},
        {type: 'block.imageGallery'},
      ],
    },
    {
      name: 'pageModal',
      title: 'Modal',
      description: 'Konfigurera en modal som visas automatiskt när sidan laddas. Användbart för viktiga meddelanden eller kampanjer.',
      type: 'pageModal',
    },
    {
      name: 'seo',
      title: 'SEO',
      description: 'Sökmotoroptimering. Ange titel, beskrivning, nyckelord och bild för bättre synlighet i sökmotorer.',
      type: 'seo',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
