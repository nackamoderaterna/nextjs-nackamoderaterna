import { defineType } from "sanity";
import LucideIconInput from "../components/LucideIconInput";

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
        input: LucideIconInput,
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
