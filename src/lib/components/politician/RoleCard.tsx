import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/lib/components/ui/card";
import type { Role } from "./roleSidebar";

interface RoleCardProps {
  role: Role;
}

export function RoleCard({ role }: RoleCardProps) {
  const content = role.href ? (
    <Link
      href={role.href}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {role.description}
    </Link>
  ) : (
    <p className="text-sm text-muted-foreground">{role.description}</p>
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 h-full">
        <CardTitle className="text-base">{role.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{content}</CardContent>
    </Card>
  );
}
