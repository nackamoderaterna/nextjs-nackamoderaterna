import { Theme } from "@/app/shared/utils/theme";

export default function OverflowBlock({
  theme = "default",
  children,
}: {
  children: React.ReactNode;
  theme?: Theme;
}) {
  return <div className={`w-full`}>{children}</div>;
}
