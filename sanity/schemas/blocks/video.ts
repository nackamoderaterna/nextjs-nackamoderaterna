import { defineField, defineType } from "sanity";
import { withAnchorBadge } from "../objects/blockHeading";

export const videoBlock = defineType({
  name: "block.video",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "blockHeading",
    }),
    defineField({
      name: "video",
      title: "Video-URL",
      type: "url",
      description: "URL till video på YouTube, Vimeo eller direkt videolänk.",
    }),
    defineField({
      name: "caption",
      title: "Bildtext",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: "caption",
      headingAnchorId: "heading.anchorId.current",
    },
    prepare({ title, headingAnchorId }) {
      return {
        title: title || "Video",
        subtitle: withAnchorBadge("Video", headingAnchorId),
      };
    },
  },
});
