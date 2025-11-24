// lib/utils/theme.ts
export const themes = {
  default: {
    bg: "bg-white",
    text: "text-gray-900",
    heading: "text-gray-900",
    subtext: "text-gray-600",
    border: "border-gray-200",
    prose: "prose-gray",
  },
  dark: {
    bg: "bg-gray-900",
    text: "text-gray-100",
    heading: "text-white",
    subtext: "text-gray-400",
    border: "border-gray-700",
    prose: "prose-invert",
  },
  primary: {
    bg: "bg-brand-primary",
    text: "text-white",
    heading: "text-white",
    subtext: "text-blue-100",
    border: "border-blue-500",
    prose: "prose-invert",
  },
} as const;

export type Theme = keyof typeof themes;

export function getThemeClasses(theme?: Theme) {
  if (theme && theme in themes) {
    return themes[theme];
  }
  return themes.default;
}
