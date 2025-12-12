// ThemedContainer.tsx

import {
  blockPlacementMap,
  contentAlignmentMap,
  contentWidthMap,
} from "@/app/shared/layout/container";
import { resolveBlockTheme } from "@/app/shared/theme/theme";
import { BlockSettings } from "@/lib/sanity/sanity.types";
import Container from "./Container";
import Content from "./Content";

export interface ThemedProps {
  blockSettings?: BlockSettings;
  applyBackground?: boolean;
  children: React.ReactNode;
}

export function Themable({
  blockSettings: settings,
  children,
  applyBackground = true,
}: ThemedProps) {
  const { outerBackground, innerBackground, text } = resolveBlockTheme({
    applyBackground,
    settings,
  });
  return (
    <div className={`${outerBackground} w-full`}>
      <div className={`px-4 flex justify-center`}>
        <div className={`max-w-6xl w-full ${innerBackground}`}>
          <Container>
            <Content settings={settings}>{children}</Content>
          </Container>
        </div>
      </div>
    </div>
  );
}
