import { Sidebar } from "@/lib/components/shared/Sidebar";
import { SidebarList, SidebarListItem } from "@/lib/components/shared/SidebarList";

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
      <SidebarList>
        {roles.map((role, index) => (
          <SidebarListItem
            key={index}
            title={role.title}
            description={role.description}
            href={role.href}
          />
        ))}
      </SidebarList>
    </Sidebar>
  );
}
