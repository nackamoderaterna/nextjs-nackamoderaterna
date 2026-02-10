import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { deskStructure } from "./sanity/sanity.desk.structure";
import { schemas } from "./sanity/schemas";
import { createProtectHemDeleteAction } from "./sanity/sanity.documentActions";

export default defineConfig({
  name: "default",
  title: "Nackamoderaterna",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "0vagy5jk",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/studio",

  plugins: [structureTool({ structure: deskStructure })],
  schema: {
    types: schemas,
  },
  document: {
    actions: (prev) =>
      prev.map((action) =>
        action.action === "delete"
          ? createProtectHemDeleteAction(action)
          : action
      ),
  },
});
