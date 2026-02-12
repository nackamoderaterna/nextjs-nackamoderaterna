import { createElement } from "react";
import { defineField, defineType } from "sanity";

export const eventType = defineType({
  name: "eventType",
  title: "Evenemangstyp",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Namn",
      type: "string",
      description: 'T.ex. "Möte", "Konferens", "Kampanj"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description:
        "URL-vänlig identifierare för evenemangstypen. Genereras automatiskt från namnet.",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "color",
      title: "Färg",
      description: "Färg som visas på kalenderprickar och etiketter.",
      type: "string",
      options: {
        list: [
          { title: "Blå", value: "#0072CE" },
          { title: "Röd", value: "#E53935" },
          { title: "Grön", value: "#43A047" },
          { title: "Orange", value: "#FB8C00" },
          { title: "Lila", value: "#8E24AA" },
          { title: "Grå", value: "#546E7A" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      color: "color",
    },
    prepare({ title, color }) {
      return {
        title,
        media: color
          ? () =>
              createElement("span", {
                style: {
                  display: "block",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: color,
                },
              })
          : undefined,
      };
    },
  },
});
