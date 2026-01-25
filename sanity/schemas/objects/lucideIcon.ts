import { defineType } from "sanity";

export default defineType({
  name: "lucideIcon",
  title: "Lucide-ikon",
  type: "object",
  fields: [
    {
      name: "name",
      title: "Ikonnamn",
      type: "string",
      description: "Välj en ikon från Lucide-biblioteket",
      components: {
        input: (props: any) => {
          // Lazy load the component
          const LucideIconInput = require("../components/LucideIconInput").default;
          return LucideIconInput(props);
        },
      },
    },
  ],
  preview: {
    select: {
      name: "name",
    },
    prepare({ name }: { name?: string }) {
      return {
        title: name || "Ingen ikon vald",
        subtitle: "Lucide Icon",
      };
    },
  },
});
