import {defineField, defineType} from 'sanity'

export const heroBlock = defineType({
  name: 'block.hero',
  title: 'Hero Block',
  type: 'object',
  groups: [{name: 'blockSettings', title: 'Block Settings'}],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Overlay Opacity (0-100)',
      type: 'number',
      initialValue: 40,
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
        }),
        defineField({
          name: 'link',
          title: 'Link',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'reflow',
      title: 'Reflow?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'string',
      options: {
        list: [
          {title: 'Small (400px)', value: 'small'},
          {title: 'Medium (600px)', value: 'medium'},
          {title: 'Large (800px)', value: 'large'},
          {title: 'Full Screen', value: 'fullscreen'},
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'blockSettings',
      title: 'Block Settings',
      type: 'blockSettings',
      group: 'blockSettings',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare(selection) {
      return {
        title: 'Hero Block',
        subtitle: selection.heading,
      }
    },
  },
})
