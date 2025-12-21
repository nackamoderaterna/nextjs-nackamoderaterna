export type Theme = "light" | "dark" | "brand";

export const themeBgMap: Record<Theme, string> = {
  light: "bg-white",
  dark: "bg-gray-900",
  brand: "bg-brand",
};

export const themeTextMap: Record<Theme, string> = {
  light: "text-gray-900",
  dark: "text-gray-50",
  brand: "text-white",
};

export const proseMap: Record<Theme, string> = {
  light: "prose-gray",
  dark: "prose-invert",
  brand: "prose-invert",
};

export interface ResolveThemeOptions {
  applyBackground: boolean;
}
