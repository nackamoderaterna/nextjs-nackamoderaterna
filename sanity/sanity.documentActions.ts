/**
 * Protects the hem (home) page from being deleted.
 * Returns null to hide the delete action when the document is the hem page.
 */
export function createProtectHemDeleteAction(originalDeleteAction: any) {
  return function ProtectHemDeleteAction(props: {
    type: string;
    draft?: { slug?: { current?: string } };
    published?: { slug?: { current?: string } };
  }) {
    if (props.type === "page") {
      const doc = props.draft || props.published;
      if (doc?.slug?.current === "hem") {
        return null; // Hide delete for hem page
      }
    }
    return originalDeleteAction(props);
  };
}
