import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'navigationFooter',
  title: 'Footer Navigation',
  type: 'document',
  fields: [
    //
    // Footer Columns
    //
    defineField({
      name: 'columns',
      title: 'Footer Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'footerColumn',
          title: 'Footer Column',
          fields: [
            defineField({
              name: 'title',
              title: 'Column Title',
              type: 'string',
            }),
            defineField({
              name: 'items',
              title: 'Menu Items',
              type: 'array',
              of: [{type: 'menuItem'}],
            }),
          ],
        },
      ],
    }),

    //
    // Extra Footer Content
    //
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'array',
      of: [{type: 'block'}],
    }),

    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'social',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              title: 'Platform',
            }),
            defineField({
              name: 'url',
              type: 'url',
              title: 'URL',
            }),
          ],
        },
      ],
    }),

    defineField({
      name: 'legalText',
      title: 'Legal Text',
      type: 'string',
    }),
  ],
})
