import {defineField, defineType} from 'sanity'

export const videoBlock = defineType({
  name: 'block.video',
  title: 'Video block',
  type: 'object',
  fields: [
    defineField({
      name: 'video',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube, Vimeo, or direct video URL',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'blockSettings',
      title: 'Block Settings',
      type: 'blockSettings',
    }),
  ],
  preview: {
    select: {
      title: 'caption',
    },
    prepare({title}) {
      return {
        title: title || 'Media Block',
        subtitle: 'Video',
      }
    },
  },
})
