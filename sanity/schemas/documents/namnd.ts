import {defineType, defineField} from 'sanity'

export const namnd = defineType({
  name: 'namnd',
  title: 'Nämnd',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
