import { CONTAINER_MAX_WIDTH, CONTAINER_PADDING } from "@/lib/utils/layout";
import { Children } from "react";

export default function ContainedBlock({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`max-w-6xl mx-auto grid grid-cols-12 gap-2 w-full`}>
      {children}
    </div>
  );
}
