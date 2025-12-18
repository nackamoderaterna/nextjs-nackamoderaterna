import {defineType} from 'sanity'

export const politicalArea = defineType({
  name: 'politicalArea',
  title: 'Politiskt område',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Namn',
      type: 'string',
      description: 'T.ex. "Ekonomi", "Vård", "Klimat och miljö"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Beskrivning',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
