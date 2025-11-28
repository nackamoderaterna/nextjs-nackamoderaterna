import { BlockSettings } from "@/lib/sanity/sanity.types";
import Container from "./Container";
import Content from "./Content";
import { Themable } from "./Themable";

export type BlockProps = {
  settings?: BlockSettings;
  applyBackground?: boolean;
  applyProse?: boolean;
  children: React.ReactNode;
};

export default function Block({
  settings,
  children,
  applyBackground = true,
  applyProse = true,
}: BlockProps) {
  const { containerWidth, blockPlacement, contentAlignment } = settings ?? {};

  return (
    <Themable blockSettings={settings} applyBackground={applyBackground}>
      {children}
    </Themable>
  );
}
