import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal', value: 'internal'},
          {title: 'Static Route', value: 'static'},
          {title: 'External', value: 'external'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
    }),

    // Internal link
    defineField({
      name: 'internalLink',
      title: 'Internal Link',
      type: 'reference',
      to: [
        {type: 'page'},
        {type: 'news'},
        {type: 'event'},
        {type: 'politician'},
        {type: 'politicalIssue'},
        // add more if needed
      ],
      hidden: ({parent}) => parent?.linkType !== 'internal',
    }),

    // Static route
    defineField({
      name: 'staticRoute',
      title: 'Static Route',
      type: 'string',
      options: {
        list: [
          {title: 'Hem', value: '/'},
          {title: 'Politiker', value: '/politiker'},
          {title: 'Nyheter', value: '/nyheter'},
          {title: 'Evenemang', value: '/event'},
          {title: 'Politik', value: '/politik'},
          {title: 'Kontakt', value: '/kontakt'},
        ],
      },
      hidden: ({parent}) => parent?.linkType !== 'static',
    }),

    // External URL
    defineField({
      name: 'url',
      title: 'URL (external)',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),

    // Submenu (optional)
    defineField({
      name: 'children',
      title: 'Children',
      type: 'array',
      of: [{type: 'menuItem'}],
      options: {
        sortable: true,
      },
    }),
  ],
})
