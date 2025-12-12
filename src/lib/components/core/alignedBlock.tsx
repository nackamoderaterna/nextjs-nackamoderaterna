import { BlockAlignment } from "@/types/types";
import ContainedBlock from "./containedBlock";
import { getThemeClasses, Theme } from "@/app/shared/utils/theme";

interface AlignedBlockProps {
  alignment: BlockAlignment;
  reflow: boolean;
  theme?: Theme;
  children: React.ReactNode;
}

export default function AlginedBlock({
  alignment,
  reflow,
  theme = "default",
  children,
}: AlignedBlockProps) {
  const alignmentClasses = {
    left: "col-start-1 col-end-6",
    center: "col-start-4 col-end-10",
    right: "col-start-7 col-end-13",
  };

  const reflowClasses = {
    left: "",
    center: "text-center flex flex-col items-center",
    right: "text-right flex flex-col items-end",
  };
  return (
    <ContainedBlock theme={theme}>
      <div
        className={`$ ${alignmentClasses[alignment]} ${reflow ? reflowClasses[alignment] : ""}`}
      >
        {children}
      </div>
    </ContainedBlock>
  );
}
