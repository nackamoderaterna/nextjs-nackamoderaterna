import {defineType} from 'sanity'

export const blockSettings = defineType({
  name: 'blockSettings',
  type: 'object',
  options: {collapsible: true},
  fields: [
    {
      name: 'theme',
      title: 'Theme',
      type: 'string',
      initialValue: 'default',
      options: {
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Dark', value: 'dark'},
          {title: 'Brand', value: 'brand'},
        ],
        layout: 'radio',
      },
    },
    {
      name: 'containerWidth',
      title: 'Container width',
      type: 'string',
      description: 'Controlls if the container can expand to the edge of the screen or not.',
      options: {
        list: [
          {title: 'Full Width', value: 'full'},
          {title: 'Contained', value: 'contained'},
        ],
      },
      initialValue: 'contained',
    },
    {
      name: 'blockPlacement',
      title: 'Block Alignment',
      description: 'Place the block inside the container',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'center',
      hidden: ({parent}) => parent?.contentWidth === 'full',
    },
    {
      name: 'contentWidth',
      title: 'Content Width',
      description: 'Controlls the width of the content of the block.',
      type: 'string',
      options: {
        list: [
          {title: 'Full Width', value: 'full'},
          {title: 'wide', value: 'wide'},
          {title: 'Narrow', value: 'narrow'},
        ],
      },
    },
    {
      name: 'contentAlignment',
      title: 'Alignment Mode',
      description: 'Align the content inside the block',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
    },
  ],
})
