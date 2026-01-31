import { DocumentActionComponent, DocumentActionProps } from "sanity";

/**
 * Protects the hem (home) page from being deleted.
 * Returns null to hide the delete action when the document is the hem page.
 */
export function createProtectHemDeleteAction(
  originalDeleteAction: DocumentActionComponent
): DocumentActionComponent {
  return function ProtectHemDeleteAction(props: DocumentActionProps) {
    if ((props as any).type === "page" || (props as any).schemaType === "page") {
      const doc = (props.draft || props.published) as {
        slug?: { current?: string };
      } | null;
      if (doc?.slug?.current === "hem") {
        return null; // Hide delete for hem page
      }
    }
    return originalDeleteAction(props);
  };
}
