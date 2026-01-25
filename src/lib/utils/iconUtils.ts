import {
  type LucideIcon,
} from "lucide-react";
import * as LucideIcons from "lucide-react";


/**
 * Get a Lucide icon component by name
 * @param iconName - The name of the icon (e.g., "Heart", "Banknote")
 * @returns The icon component or null if not found
 */
export function getLucideIcon(iconName?: string | null): LucideIcon | null {
  if (!iconName) return null;
  
  // Clean the icon name: trim whitespace and remove invisible/zero-width characters
  // This handles cases where copy-paste from Sanity Studio includes invisible Unicode chars
  const cleanedName = String(iconName)
    .trim()
    // Remove zero-width spaces and other invisible characters
    .replace(/[\u200B-\u200D\uFEFF\u00AD\u200C\u200D]/g, '')
    // Remove other common invisible characters
    .replace(/[\u2060-\u206F]/g, '')
    .trim();
    
  if (!cleanedName) return null;
  
  // Try to get directly from lucide-react (exact match)
  let Icon = LucideIcons[cleanedName as keyof typeof LucideIcons];
  
  // If not found, try with "Icon" suffix (some icons are exported with Icon suffix)
  if (!Icon) {
    Icon = LucideIcons[`${cleanedName}Icon` as keyof typeof LucideIcons];
  }
  
  // Debug logging if not found
  if (!Icon) {
    // Check if there's a case-insensitive match
    const allKeys = Object.keys(LucideIcons);
    const lowerMatch = allKeys.find(
      key => key.toLowerCase() === cleanedName.toLowerCase() || 
             key.toLowerCase() === `${cleanedName}Icon`.toLowerCase()
    );
    
    if (lowerMatch) {
      console.warn(`Icon "${cleanedName}" not found, but found case-insensitive match: "${lowerMatch}". Using that instead.`);
      Icon = LucideIcons[lowerMatch as keyof typeof LucideIcons];
    } else {
      console.warn(`Icon "${cleanedName}" (cleaned from "${iconName}") not found in lucide-react. Available keys sample:`, allKeys.slice(0, 10));
    }
  }
  
  // Check if it's a valid React component (can be function or object)
  if (Icon && (typeof Icon === "function" || (typeof Icon === "object" && Icon !== null))) {
    return Icon as LucideIcon;
  }
  
  if (Icon) {
    console.warn(`Icon "${cleanedName}" found but is not a valid component. Type:`, typeof Icon);
  }
  
  return null;
}
