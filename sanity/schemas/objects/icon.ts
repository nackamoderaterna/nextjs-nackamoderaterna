import {defineType} from 'sanity'

export default defineType({
  name: 'icon',
  title: 'Ikon',
  type: 'object',
  fields: [
    {
      name: 'name',
      title: 'Ikonnamn',
      type: 'string',
      description: 'Välj ikon från listan',
      components: {
        input: (props: any) => {
          // Lazy load the component
          const IconInput = require('../components/IconInput').default
          return IconInput(props)
        },
      },
    },
  ],
  preview: {
    select: {
      name: 'name',
    },
    prepare({name}: {name?: string}) {
      return {
        title: name || 'Ingen ikon vald',
        subtitle: 'Tabler Icon',
      }
    },
  },
})
