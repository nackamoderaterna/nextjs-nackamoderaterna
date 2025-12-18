import {defineType} from 'sanity'

export const geographicalArea = defineType({
  name: 'geographicalArea',
  title: 'Geografiskt område',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Namn',
      type: 'string',
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
      type: 'text',
      rows: 3,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'type',
    },
  },
})
