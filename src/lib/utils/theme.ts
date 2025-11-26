import { Theme } from "@/app/shared/utils/theme";

const textColors = {
  default: "text-gray-900",
  dark: "text-gray-50",
  primary: "text-blue-50",
};

const backgroundColors = {
  default: "white",
  dark: "bg-gray-900",
  primary: "bg-brand",
};

const buttonColors = {
  default: "bg-gray-900 text-gray-50",
  dark: "bg-gray-50 text-gray-900",
  primary: "bg-blue-50 text-brand",
};

export interface ThemeClasses {
  text: string;
  background: string;
  button: string;
}

const getThemeColors = (theme: Theme) => {
  return {
    text: textColors[theme],
    background: backgroundColors[theme],
    button: buttonColors[theme],
  };
};

export { getThemeColors };
