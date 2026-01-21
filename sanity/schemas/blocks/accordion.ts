import { defineField, defineType } from "sanity";

export const accordionBlock = defineType({
  name: "block.accordion",
  title: "Accordion/FAQ Block",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "content",
              title: "Content",
              type: "array",
              of: [{ type: "block" }],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "title",
            },
            prepare({ title }) {
              return {
                title,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "allowMultiple",
      title: "Allow Multiple Open",
      type: "boolean",
      description: "Allow multiple items to be open at once",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      items: "items",
    },
    prepare({ heading, items }) {
      return {
        title: "Accordion Block",
        subtitle: heading || `${items?.length || 0} items`,
      };
    },
  },
});
