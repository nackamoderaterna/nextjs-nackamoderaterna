import { BlockSettings } from "~/sanity.types";

interface ContainerProps {
  children: React.ReactNode;
  settings?: BlockSettings;
}
export default function Container({ settings, children }: ContainerProps) {
  const padding = settings?.theme === "light" ? "" : "p-8";
  return <div className={`grid grid-cols-12 ${padding}`}>{children}</div>;
}
