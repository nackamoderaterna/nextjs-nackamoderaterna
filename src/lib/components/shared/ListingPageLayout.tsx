import { ReactNode } from "react";
import { PageContainer } from "./PageContainer";
import { ListingHeader } from "./ListingHeader";

interface ListingPageLayoutProps {
  title?: string;
  intro?: string;
  fallbackTitle: string;
  fallbackIntro?: string;
  children: ReactNode;
  /** Vertical padding: default (py-12), compact (py-8), top (pt-12) */
  paddingY?: "default" | "compact" | "top";
  as?: "main" | "div";
  className?: string;
}

export function ListingPageLayout({
  title,
  intro,
  fallbackTitle,
  fallbackIntro,
  children,
  paddingY = "default",
  as = "main",
  className,
}: ListingPageLayoutProps) {
  return (
    <PageContainer as={as} paddingY={paddingY} className={className}>
      <ListingHeader
        title={title}
        intro={intro}
        fallbackTitle={fallbackTitle}
        fallbackIntro={fallbackIntro}
      />
      {children}
    </PageContainer>
  );
}
