import {defineType, defineField} from 'sanity'

export const newsBlock = defineType({
  name: 'block.news',
  title: 'News Block',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),

    {
      name: 'mode',
      title: 'Mode',
      type: 'string',
      initialValue: 'manual',
      options: {
        list: [
          {value: 'latest', title: 'Senaste'},
          {value: 'manual', title: 'Manual'},
          {value: 'area', title: 'Geografiskt omrade'},
          {value: 'politics', title: 'Politiskt sakomrade'},
        ],
      },
    },

    // Political area selector
    defineField({
      name: 'politicalArea',
      type: 'reference',
      title: 'Political Area',
      to: [{type: 'politicalArea'}],
      description: 'Choose a political area to fetch news automatically.',
      options: {disableNew: true},
      hidden: ({parent}) => parent?.mode != 'politics',
    }),

    // Geographic area selector
    defineField({
      name: 'geographicArea',
      type: 'reference',
      title: 'Geographic Area',
      to: [{type: 'geographicalArea'}],
      description: 'Choose a geographic area to fetch news automatically.',
      options: {disableNew: true},
      hidden: ({parent}) => parent?.mode != 'area',
    }),

    // Manual overrides
    defineField({
      name: 'items',
      title: 'Manual News Items',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'news'}]}],
      description:
        'Optional. If filled, these items will be shown instead of automatic latest news.',
      hidden: ({parent}) => parent?.mode != 'manual',
    }),
    {
      name: 'limit',
      title: 'Limit',
      type: 'number',
      initialValue: 4,
    },
  ],

  // Validation rules
  validation: (Rule) =>
    Rule.custom((block) => {
      if (block?.politicalArea && block.geographicArea) {
        return 'Select *either* a political area OR a geographic area, not both.'
      }
      return true
    }),

  preview: {
    select: {mode: 'mode'},
    prepare: ({mode}) => {
      return {
        title: 'Nyheter',
        subtitle: mode,
      }
    },
  },
})
