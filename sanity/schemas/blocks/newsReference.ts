import {defineType, defineField} from 'sanity'

export const newsBlock = defineType({
  name: 'block.news',
  title: 'Nyheter',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      type: 'blockHeading',
      title: 'Rubrik',
    }),

    {
      name: 'mode',
      title: 'Läge',
      description: 'Välj hur nyheter ska hämtas: senaste automatiskt, manuellt valda, eller filtrerade på område.',
      type: 'string',
      initialValue: 'manual',
      options: {
        list: [
          {value: 'latest', title: 'Senaste'},
          {value: 'manual', title: 'Manuellt'},
          {value: 'area', title: 'Geografiskt område'},
          {value: 'politics', title: 'Politiskt sakområde'},
        ],
      },
    },

    // Political area selector
    defineField({
      name: 'politicalArea',
      type: 'reference',
      title: 'Politiskt område',
      to: [{type: 'politicalArea'}],
      description: 'Välj ett politiskt område för att automatiskt hämta nyheter relaterade till det området.',
      options: {disableNew: true},
      hidden: ({parent}) => parent?.mode != 'politics',
    }),

    // Geographic area selector
    defineField({
      name: 'geographicArea',
      type: 'reference',
      title: 'Geografiskt område',
      to: [{type: 'geographicalArea'}],
      description: 'Välj ett geografiskt område för att automatiskt hämta nyheter relaterade till det området.',
      options: {disableNew: true},
      hidden: ({parent}) => parent?.mode != 'area',
    }),

    defineField({
      name: 'viewAllLink',
      title: '"Alla nyheter"-länk',
      description: 'Länk som visas till höger om rubriken. Lämna tom för standard (/nyheter).',
      type: 'string',
    }),

    // Manual overrides
    defineField({
      name: 'items',
      title: 'Manuellt valda nyheter',
      description: 'Valfritt. Om ifylld kommer dessa nyheter att visas istället för automatiska senaste nyheter.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'news'}]}],
      hidden: ({parent}) => parent?.mode != 'manual',
    }),
  ],

  // Validation rules
  validation: (Rule) =>
    Rule.custom((block) => {
      if (block?.politicalArea && block.geographicArea) {
        return 'Välj antingen ett politiskt område ELLER ett geografiskt område, inte båda.'
      }
      return true
    }),

  preview: {
    select: {'headingTitle': 'heading.title', mode: 'mode'},
    prepare: ({headingTitle, mode}) => {
      return {
        title: 'Nyheter',
        subtitle: headingTitle || mode,
      }
    },
  },
})
