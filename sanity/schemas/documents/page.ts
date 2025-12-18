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
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
