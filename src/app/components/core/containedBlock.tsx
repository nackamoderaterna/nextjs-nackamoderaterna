import { CONTAINER_MAX_WIDTH, CONTAINER_PADDING } from "@/lib/utils/layout";
import { Children } from "react";

export default function ContainedBlock({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`w-full flex justify-center ${CONTAINER_PADDING}`}>
      <div className={`${CONTAINER_MAX_WIDTH}`}>{children}</div>
    </div>
  );
}
