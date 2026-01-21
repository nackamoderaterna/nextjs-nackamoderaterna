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
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Twitter/X', value: 'twitter'},
                ],
              },
            }),
            defineField({
              name: 'url',
              type: 'url',
              title: 'URL',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              platform: 'platform',
              url: 'url',
            },
            prepare({platform, url}) {
              return {
                title: platform || 'Social Link',
                subtitle: url,
              };
            },
          },
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
