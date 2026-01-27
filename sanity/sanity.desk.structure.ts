import { StructureResolver } from "sanity/structure";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Core")
    .items([
      S.documentTypeListItem("page"),
      S.documentTypeListItem("news"),
      S.documentTypeListItem("event").title("Evenemang"),
      S.documentTypeListItem("listingPage"),
      S.documentTypeListItem("politician"),

      S.divider().title("Politik"),

      // Politics documents
      S.documentTypeListItem("namnd"),
      S.documentTypeListItem("politicalArea"),
      S.documentTypeListItem("politicalIssue"),
      S.documentTypeListItem("geographicalArea"),
      S.divider().title("Inställningar"),
      S.listItem()
        .title("Huvudmeny")
        .schemaType("navigationHeader")
        .child(
          S.document()
            .schemaType("navigationHeader")
            .documentId("navigationHeader")
            .title("Huvudmeny"),
        ),
        S.listItem()
        .title("Footermeny")
        .schemaType("navigationFooter")
        .child(
          S.document()
            .schemaType("navigationFooter")
            .documentId("navigationFooter")
            .title("Footermeny"),
        ),
      S.listItem()
        .title("Globala Inställningar")
        .schemaType("globalSettings")
        .child(
          S.document()
            .schemaType("globalSettings")
            .documentId("globalSettings"),
        ),
    ]);
