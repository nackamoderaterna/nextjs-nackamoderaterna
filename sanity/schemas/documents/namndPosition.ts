import { defineField, defineType } from "sanity";

export const namndPosition = defineType({
  name: "namndPosition",
  title: "Bolag/Nämnd-position",
  type: "document",
  groups: [
    { name: "assignment", title: "Uppdrag", default: true },
    { name: "dates", title: "Tidsperiod" },
    { name: "extra", title: "Övrigt" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      description: 'T.ex. "Ordförande", "Ledamot", "Ersättare"',
      group: "assignment",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "politician",
      title: "Politiker",
      type: "reference",
      group: "assignment",
      to: [{ type: "politician" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bolagNamnd",
      title: "Bolag/Nämnd",
      type: "reference",
      group: "assignment",
      to: [{ type: "namnd" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Startdatum",
      type: "date",
      group: "dates",
    }),
    defineField({
      name: "endDate",
      title: "Slutdatum",
      type: "date",
      group: "dates",
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      type: "text",
      rows: 3,
      group: "extra",
    }),
  ],
  preview: {
    select: {
      politician: 'politician.name',
      bolagNamnd: 'bolagNamnd.name',
      title: 'title',
    },
    prepare(selection) {
      const {politician, bolagNamnd, title} = selection
      return {
        title: `${politician} - ${title}`,
        subtitle: bolagNamnd,
      }
    },
  },
})
