import {defineType} from 'sanity'

export const boardPosition = defineType({
  name: 'boardPosition',
  title: 'Styrelseposition',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titel',
      type: 'string',
      description: 'T.ex. "Ordförande", "Vice ordförande", "Ledamot"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Sorteringsordning',
      type: 'number',
      description: 'Används för att sortera positioner i hierarkisk ordning',
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
      title: 'title',
      order: 'order',
    },
  },
})
