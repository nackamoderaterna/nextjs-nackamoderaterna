import {
  Banknote,
  Leaf,
  GraduationCap,
  Globe,
  Scale,
  type LucideIcon,
  Coins,
  Home,
  Heart,
  Shield,
  Briefcase,
  Bus,
  Dumbbell,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

export const lucideIconMap: Record<string, LucideIcon> = {
  Banknote,
  Leaf,
  Coins,
  Home,
  GraduationCap,
  Globe,
  Scale,
  Heart,
  Shield,
  Briefcase,
  Bus,
  Dumbbell,
};

/**
 * Get a Lucide icon component by name
 * @param iconName - The name of the icon (e.g., "Heart", "Banknote")
 * @returns The icon component or null if not found
 */
export function getLucideIcon(iconName?: string | null): LucideIcon | null {
  if (!iconName) return null;
  
  // Try to get from the icon map first (for backwards compatibility)
  if (lucideIconMap[iconName]) {
    return lucideIconMap[iconName];
  }
  
  // Try to get directly from lucide-react
  const Icon = LucideIcons[iconName as keyof typeof LucideIcons];
  if (typeof Icon === "function") {
    return Icon as LucideIcon;
  }
  
  return null;
}
