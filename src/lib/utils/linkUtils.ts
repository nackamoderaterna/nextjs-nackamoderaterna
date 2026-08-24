interface LinkLike {
  linkType?: "internal" | "external" | null;
  href?: string | null;
  externalUrl?: string | null;
}

export function resolveButtonLink(button: LinkLike): {
  href: string | null;
  isExternal: boolean;
} {
  if (button.linkType === "external") {
    return { href: button.externalUrl ?? null, isExternal: true };
  }
  return { href: button.href ?? null, isExternal: false };
}
