import {defineType} from 'sanity'

export default defineType({
  name: 'navigationHeader',
  title: 'Header Navigation',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'title',
      type: 'string',
      hidden: true,
      readOnly: true,
    },
    {
      name: 'items',
      title: 'Menu Items',
      type: 'array',
      of: [{type: 'menuItem'}],
      validation: (Rule) => Rule.required().min(1),
    },
  ],
})
