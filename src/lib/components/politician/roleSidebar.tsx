export interface Role {
  title: string;
  description: string;
}

interface RoleSidebarProps {
  heading: string;
  roles: Role[];
}

export function RoleSidebar({ heading, roles }: RoleSidebarProps) {
  return (
    <aside className="bg-muted rounded-lg p-6">
      <h2 className="text-sm font-semibold text-foreground mb-4">{heading}</h2>
      <div className="space-y-4">
        {roles.map((role, index) => (
          <div key={index}>
            <h3 className="font-semibold text-foreground">{role.title}</h3>
            <p className="text-sm text-muted-foreground">{role.description}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
