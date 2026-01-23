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
      type: 'pageModal',
    },
    {
      name: 'seo',
      title: 'SEO',
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
