import {defineType} from 'sanity'

export const namndPosition = defineType({
  name: 'namndPosition',
  title: 'Bolag/Nämnd-position',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titel',
      type: 'string',
      description: 'T.ex. "Ordförande", "Ledamot", "Ersättare"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'politician',
      title: 'Politiker',
      type: 'reference',
      to: [{type: 'politician'}],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'bolagNamnd',
      title: 'Bolag/Nämnd',
      type: 'reference',
      to: [{type: 'namnd'}],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'startDate',
      title: 'Startdatum',
      type: 'date',
    },
    {
      name: 'endDate',
      title: 'Slutdatum',
      type: 'date',
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
      politician: 'politician.name',
      bolagNamnd: 'bolagNamnd.name',
      title: 'title',
    },
    prepare(selection) {
      const {politician, bolagNamnd, title} = selection
      return {
        title: `${politician} - ${title}`,
        subtitle: bolagNamnd,
      }
    },
  },
})
