/**
 * Shared type utilities for Sanity documents and dereferenced references.
 * Use Dereferenced<T> for array fields that are expanded from references.
 */

/** Base shape for Sanity documents (required by Dereferenced). */
export type SanityDocumentBase = {
  _id: string;
  _type: string;
};

/**
 * Document type with an effective date (e.g. news, events).
 * Use for query results where `effectiveDate` is computed (e.g. dateOverride ?? _createdAt).
 */
export type WithEffectiveDate<T> = T & {
  effectiveDate: string;
};

/**
 * Array of expanded reference documents.
 * Use for fields that are references in Sanity but returned as full documents by GROQ.
 * Each item keeps _id and omits _type to avoid conflicting with the source type.
 */
export type Dereferenced<T extends SanityDocumentBase> = Array<
  Pick<T, "_id"> & Omit<T, "_type">
>;

/**
 * Maps a document type to a version where specific reference fields are expanded to Dereferenced<T>.
 * Use for query result types where some refs are dereferenced in the projection.
 *
 * @example
 * type NewsRefs = {
 *   referencedPoliticians: Politician;
 *   politicalAreas: PoliticalArea;
 *   geographicalAreas: GeographicalArea;
 * };
 * type NewsExpanded = WithDereferencedFields<News, NewsRefs> & { effectiveDate: string; ... };
 */
export type WithDereferencedFields<
  TDoc extends SanityDocumentBase,
  TRefMap extends Record<string, SanityDocumentBase>,
> = Omit<TDoc, keyof TRefMap> & {
  [K in keyof TRefMap]?: Dereferenced<TRefMap[K]>;
};
