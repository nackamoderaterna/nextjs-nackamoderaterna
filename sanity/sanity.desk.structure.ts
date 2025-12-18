import {StructureResolver} from 'sanity/structure'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Core')
    .items([
      S.documentTypeListItem('page'),
      S.documentTypeListItem('news'),
      S.documentTypeListItem('event'),
      S.documentTypeListItem('politician'),

      S.divider().title('Politik'),

      // Politics documents
      S.documentTypeListItem('politicalIssue'),
      S.listItem()
        .title('Nämnd')
        .child(
          S.list()
            .title('Typ')
            .items([S.documentTypeListItem('namnd'), S.documentTypeListItem('namndPosition')]),
        ),

      S.documentTypeListItem('politicalArea'),
      S.documentTypeListItem('geographicalArea'),
      S.divider().title('Inställningar'),
      S.listItem()
        .title('Huvudmeny')
        .schemaType('navigationHeader')
        .child(
          S.document()
            .schemaType('navigationHeader')
            .documentId('navigationHeader')
            .title('Huvudmeny'),
        ),
      S.listItem()
        .title('Globala Inställningar')
        .schemaType('globalSettings')
        .child(S.document().schemaType('globalSettings').documentId('globalSettings')),
    ])
