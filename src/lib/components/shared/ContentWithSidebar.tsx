import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContentWithSidebarProps {
  mainContent: ReactNode;
  sidebarContent: ReactNode;
  className?: string;
}

export function ContentWithSidebar({
  mainContent,
  sidebarContent,
  className,
}: ContentWithSidebarProps) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16", className)}>
      {/* Main Content - Takes 2 columns on large screens */}
      <div className="lg:col-span-2">{mainContent}</div>

      {/* Sidebar - Takes 1 column on large screens */}
      <aside className="lg:col-span-1">{sidebarContent}</aside>
    </div>
  );
}
