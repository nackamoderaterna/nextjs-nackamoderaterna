import {defineType} from 'sanity'

export const blockSettings = defineType({
  name: 'blockSettings',
  type: 'object',
  title: 'Blockinställningar',
  options: {collapsible: true},
  fields: [
    {
      name: 'theme',
      title: 'Tema',
      description: 'Färgtema för blocket. Brand använder partifärger.',
      type: 'string',
      initialValue: 'default',
      options: {
        list: [
          {title: 'Ljust', value: 'light'},
          {title: 'Mörkt', value: 'dark'},
          {title: 'Partifärger', value: 'brand'},
        ],
        layout: 'radio',
      },
    },
    {
      name: 'containerWidth',
      title: 'Containerbredd',
      description: 'Kontrollerar om containern kan expandera till skärmens kant eller begränsas till en maxbredd.',
      type: 'string',
      options: {
        list: [
          {title: 'Full bredd', value: 'full'},
          {title: 'Begränsad', value: 'contained'},
        ],
      },
      initialValue: 'contained',
    },
    {
      name: 'blockPlacement',
      title: 'Blockjustering',
      description: 'Placerar blocket inom containern. Endast synligt när innehållsbredden inte är full.',
      type: 'string',
      options: {
        list: [
          {title: 'Vänster', value: 'left'},
          {title: 'Centrerat', value: 'center'},
          {title: 'Höger', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'center',
      hidden: ({parent}) => parent?.contentWidth === 'full',
    },
    {
      name: 'contentWidth',
      title: 'Innehållsbredd',
      description: 'Kontrollerar bredden på innehållet i blocket. Full bredd använder hela containern, smal begränsar till en smal kolumn.',
      type: 'string',
      options: {
        list: [
          {title: 'Full bredd', value: 'full'},
          {title: 'Bred', value: 'wide'},
          {title: 'Smal', value: 'narrow'},
        ],
      },
    },
    {
      name: 'contentAlignment',
      title: 'Justeringsläge',
      description: 'Justerar innehållet horisontellt inom blocket.',
      type: 'string',
      options: {
        list: [
          {title: 'Vänster', value: 'left'},
          {title: 'Centrerat', value: 'center'},
          {title: 'Höger', value: 'right'},
        ],
        layout: 'radio',
      },
    },
  ],
})
