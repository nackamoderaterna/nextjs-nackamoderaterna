import { type LucideIcon } from "lucide-react";

// Curated map of icons used in the CMS. This avoids importing the entire
// lucide-react barrel (~1500 icons) which adds ~200KB+ of JS to evaluate.
// Add icons here as they are configured in Sanity.
import {
  Heart,
  Home,
  User,
  Users,
  Settings,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Landmark,
  Building2,
  GraduationCap,
  TreePine,
  Leaf,
  Shield,
  Scale,
  Banknote,
  Bus,
  Bike,
  Hospital,
  Baby,
  Briefcase,
  Globe,
  Handshake,
  HeartHandshake,
  Megaphone,
  BookOpen,
  FileText,
  CircleDot,
  Lightbulb,
  Palette,
  Wrench,
  Hammer,
  Mountain,
  Waves,
  Sun,
  Flag,
  Star,
  Award,
  Target,
  Zap,
  TrendingUp,
  BarChart3,
  PieChart,
  Accessibility,
  Stethoscope,
  Dumbbell,
  Music,
  Camera,
  Wifi,
  LockKeyhole,
  ShieldCheck,
  Vote,
  CircleHelp,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Home,
  User,
  Users,
  Settings,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Landmark,
  Building2,
  GraduationCap,
  TreePine,
  Leaf,
  Shield,
  Scale,
  Banknote,
  Bus,
  Bike,
  Hospital,
  Baby,
  Briefcase,
  Globe,
  Handshake,
  HeartHandshake,
  Megaphone,
  BookOpen,
  FileText,
  CircleDot,
  Lightbulb,
  Palette,
  Wrench,
  Hammer,
  Mountain,
  Waves,
  Sun,
  Flag,
  Star,
  Award,
  Target,
  Zap,
  TrendingUp,
  BarChart3,
  PieChart,
  Accessibility,
  Stethoscope,
  Dumbbell,
  Music,
  Camera,
  Wifi,
  LockKeyhole,
  ShieldCheck,
  Vote,
  CircleHelp,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
};

/**
 * Get a Lucide icon component by its PascalCase name (as stored in Sanity).
 *
 * Only icons listed in the curated `iconMap` above are returned. If an icon
 * configured in the CMS is missing, add its named import above.
 */
export function getLucideIcon(iconName?: string | null): LucideIcon | null {
  if (!iconName) return null;

  const cleaned = String(iconName)
    .trim()
    .replace(/[\u200B-\u200D\uFEFF\u00AD\u200C\u200D\u2060-\u206F]/g, "")
    .trim();
  if (!cleaned) return null;

  // Direct match
  const icon = iconMap[cleaned] ?? iconMap[cleaned.replace(/Icon$/, "")];
  if (icon) return icon;

  // Case-insensitive fallback
  const lower = cleaned.toLowerCase();
  for (const [key, value] of Object.entries(iconMap)) {
    if (key.toLowerCase() === lower) return value;
  }

  return null;
}
