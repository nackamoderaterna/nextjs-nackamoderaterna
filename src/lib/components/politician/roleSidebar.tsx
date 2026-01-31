import Link from "next/link";
import { Sidebar } from "@/lib/components/shared/Sidebar";

export interface Role {
  title: string;
  description: string;
  href?: string;
}

interface RoleSidebarProps {
  heading: string;
  roles: Role[];
}

export function RoleSidebar({ heading, roles }: RoleSidebarProps) {
  return (
    <Sidebar heading={heading}>
      <div className="space-y-4">
        {roles.map((role, index) => (
          <div key={index}>
            <h3 className="font-semibold">{role.title}</h3>
            {role.href ? (
              <Link
                href={role.href}
                className="text-sm  hover:text-foreground transition-colors"
              >
                {role.description}
              </Link>
            ) : (
              <p className="text-muted-foreground">{role.description}</p>
            )}
          </div>
        ))}
      </div>
    </Sidebar>
  );
}
