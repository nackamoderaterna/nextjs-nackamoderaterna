import {defineType, defineField} from 'sanity'
import {withAnchorBadge} from '../objects/blockHeading'

export const politicianBlock = defineType({
  name: 'block.politician',
  title: 'Politiker',
  type: 'object',

  fields: [
    defineField({
      name: 'heading',
      title: 'Rubrik',
      type: 'blockHeading',
    }),
    defineField({
      name: 'mode',
      title: 'Läge',
      description: 'Välj om du vill välja politiker manuellt eller automatiskt visa alla kommunalråd.',
      type: 'string',
      initialValue: 'manual',
      options: {
        list: [
          {title: 'Utvalda politiker', value: 'manual'},
          {title: 'Alla kommunalråd', value: 'kommunalrad'},
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'items',
      title: 'Utvalda politiker',
      description: 'Välj vilka politiker som ska visas. Endast synligt när läget är "Utvalda politiker".',
      type: 'array',
      hidden: ({parent}) => parent?.mode !== 'manual',
      of: [
        {
          type: 'object',
          name: 'politicianWithOverride',
          fields: [
            defineField({
              name: 'politician',
              title: 'Politiker',
              type: 'reference',
              to: [{type: 'politician'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'titleOverride',
              title: 'Titel (valfritt)',
              description: 'Överskrid standardtiteln. Lämna tom för att visa "–".',
              type: 'string',
            }),
          ],
          preview: {
            select: {name: 'politician.name'},
            prepare: ({name}: {name?: string}) => ({
              title: name ?? 'Politiker',
            }),
          },
        },
      ],
    }),

  ],

  preview: {
    select: {mode: 'mode', items: 'items', headingAnchorId: 'heading.anchorId.current'},
    prepare: ({
      mode,
      items,
      headingAnchorId,
    }: {
      mode: 'manual' | 'kommunalrad'
      items?: any[]
      headingAnchorId?: string
    }) => {
      const subtitles = {
        manual: `${items?.length ?? 0} valda politiker`,
        kommunalrad: 'Alla kommunalråd',
      }

      return {
        title: 'Politiker',
        subtitle: withAnchorBadge(subtitles[mode] ?? '', headingAnchorId),
      }
    },
  },
})
