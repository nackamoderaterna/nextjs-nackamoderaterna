import { ReactNode } from "react";

interface ContactInfoItemProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}

export function ContactInfoItem({
  icon,
  label,
  children,
}: ContactInfoItemProps) {
  return (
    <div>

<div className="flex items-start gap-2 text-sm text-muted-foreground [&>a]:hover:underline">
      
      <p className="text-sm font-medium mb-1">{label}</p>
       
      </div>
        <span className="min-w-0">{children}</span>
    </div>
  );
}
