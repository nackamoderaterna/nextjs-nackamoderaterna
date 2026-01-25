import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'menuItem',
  title: 'Menypunkt',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      description: 'Texten som visas i menyn.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'linkType',
      title: 'Länktyp',
      description: 'Välj typ av länk: intern (till en sida i systemet), statisk rutt (fördefinierad sida), eller extern (extern webbadress).',
      type: 'string',
      options: {
        list: [
          {title: 'Intern', value: 'internal'},
          {title: 'Statisk rutt', value: 'static'},
          {title: 'Extern', value: 'external'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
    }),

    // Internal link
    defineField({
      name: 'internalLink',
      title: 'Intern länk',
      description: 'Välj en sida, nyhet, evenemang, politiker eller politisk fråga från systemet.',
      type: 'reference',
      to: [
        {type: 'page'},
        {type: 'news'},
        {type: 'event'},
        {type: 'politician'},
        {type: 'politicalIssue'},
        // add more if needed
      ],
      hidden: ({parent}) => parent?.linkType !== 'internal',
    }),

    // Static route
    defineField({
      name: 'staticRoute',
      title: 'Statisk rutt',
      description: 'Välj en fördefinierad sida i systemet.',
      type: 'string',
      options: {
        list: [
          {title: 'Hem', value: '/'},
          {title: 'Politiker', value: '/politiker'},
          {title: 'Nyheter', value: '/nyheter'},
          {title: 'Evenemang', value: '/event'},
          {title: 'Politik', value: '/politik'},
          {title: 'Kontakt', value: '/kontakt'},
        ],
      },
      hidden: ({parent}) => parent?.linkType !== 'static',
    }),

    // External URL
    defineField({
      name: 'url',
      title: 'URL (extern)',
      description: 'Extern webbadress (måste börja med http:// eller https://).',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),

    // Submenu (optional)
    defineField({
      name: 'children',
      title: 'Undermenyer',
      description: 'Valfritt: skapa undermenyer genom att lägga till fler menypunkter här.',
      type: 'array',
      of: [{type: 'menuItem'}],
      options: {
        sortable: true,
      },
    }),
  ],
})
