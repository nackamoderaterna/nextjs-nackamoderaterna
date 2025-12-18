import {defineType, defineField} from 'sanity'

export const politicianBlock = defineType({
  name: 'block.politician',
  title: 'Politiker',
  type: 'object',

  fields: [
    defineField({
      name: 'mode',
      title: 'Läge',
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
      type: 'array',
      of: [{type: 'reference', to: [{type: 'politician'}]}],
      hidden: ({parent}) => parent?.mode !== 'manual',
    }),
  ],

  preview: {
    select: {mode: 'mode', items: 'items'},
    prepare: ({mode, items}: {mode: 'manual' | 'kommunalrad'; items?: any[]}) => {
      const subtitles = {
        manual: `${items?.length ?? 0} valda politiker`,
        kommunalrad: 'Alla kommunalråd',
      }

      return {
        title: 'Politiker',
        subtitle: subtitles[mode] ?? '',
      }
    },
  },
})
