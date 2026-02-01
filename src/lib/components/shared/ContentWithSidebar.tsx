import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContentWithSidebarProps {
  mainContent?: ReactNode | null;
  sidebarContent: ReactNode;
  className?: string;
}

export function ContentWithSidebar({
  mainContent,
  sidebarContent,
  className,
}: ContentWithSidebarProps) {
  const hasMainContent = mainContent != null && mainContent !== false;

  return (
    <div
      className={cn(
        "mb-16",
        hasMainContent
          ? "grid grid-cols-1 lg:grid-cols-3 gap-8"
          : "flex justify-start",
        className
      )}
    >
      {hasMainContent ? (
        <>
          {/* Main Content - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">{mainContent}</div>
          {/* Sidebar - Takes 1 column on large screens */}
          <aside className="lg:col-span-1">{sidebarContent}</aside>
        </>
      ) : (
        /* No main content: sidebar aligned to the left */
        <aside className="w-full max-w-sm">{sidebarContent}</aside>
      )}
    </div>
  );
}
