import { ReactNode } from "react";

interface SidebarProps {
  heading: string;
  children: ReactNode;
}

export function Sidebar({ heading, children }: SidebarProps) {
  return (
    <aside className="border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
        {heading}
      </h2>
      {children}
    </aside>
  );
}
