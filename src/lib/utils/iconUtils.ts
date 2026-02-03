import { type LucideIcon } from "lucide-react";

// Curated map of ~100 icons available in the CMS icon picker.
// Both this file and sanity/schemas/components/LucideIconInput.tsx share
// the same list. When adding icons, update BOTH files.
//
// Categories covered:
//   Bo & bygga, Demokrati, Ekonomi, Fritid & idrott, Företagande, Jobb,
//   Kollektivtrafik, Kultur, Miljö & klimat, Natur, Omsorg, Skola,
//   Trafik & framkomlighet, Trygghet, Vård, Välfärd, Äldre + common UI icons.
import {
  // Bo & bygga
  Home,
  Building2,
  Building,
  Warehouse,
  HardHat,
  Hammer,
  Wrench,
  // Demokrati
  Vote,
  Landmark,
  Scale,
  Gavel,
  Flag,
  Megaphone,
  // Ekonomi
  Banknote,
  Wallet,
  PiggyBank,
  TrendingUp,
  BarChart3,
  PieChart,
  Receipt,
  // Fritid & idrott
  Dumbbell,
  Trophy,
  Medal,
  Bike,
  PersonStanding,
  Volleyball,
  // Företagande
  Briefcase,
  Store,
  Handshake,
  Rocket,
  Lightbulb,
  // Jobb
  GraduationCap,
  ClipboardList,
  BadgeCheck,
  UserCheck,
  // Kollektivtrafik
  Bus,
  Train,
  Ship,
  Plane,
  // Kultur
  Palette,
  Music,
  BookOpen,
  Theater,
  Camera,
  Film,
  // Miljö & klimat
  Leaf,
  Recycle,
  Sun,
  CloudSun,
  Wind,
  Thermometer,
  Droplets,
  // Natur
  TreePine,
  Trees,
  Mountain,
  Waves,
  Flower2,
  Bird,
  // Omsorg
  HeartHandshake,
  Heart,
  Baby,
  HandHeart,
  Smile,
  // Skola
  School,
  BookMarked,
  PencilLine,
  Apple,
  // Trafik & framkomlighet
  Car,
  TrafficCone,
  CircleParking,
  Route,
  Footprints,
  Accessibility,
  // Trygghet
  Shield,
  ShieldCheck,
  LockKeyhole,
  Siren,
  Eye,
  // Vård
  Stethoscope,
  Hospital,
  HeartPulse,
  Pill,
  Cross,
  // Välfärd
  Users,
  Globe,
  CircleDot,
  Target,
  // Äldre
  Armchair,
  Clock,
  Glasses,
  // Gemensamma / UI
  User,
  Settings,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Info,
  CircleHelp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Award,
  Zap,
  ExternalLink,
  ChevronRight,
  Search,
  Download,
  Upload,
  Link,
  Wifi,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  // Bo & bygga
  Home,
  Building2,
  Building,
  Warehouse,
  HardHat,
  Hammer,
  Wrench,
  // Demokrati
  Vote,
  Landmark,
  Scale,
  Gavel,
  Flag,
  Megaphone,
  // Ekonomi
  Banknote,
  Wallet,
  PiggyBank,
  TrendingUp,
  BarChart3,
  PieChart,
  Receipt,
  // Fritid & idrott
  Dumbbell,
  Trophy,
  Medal,
  Bike,
  PersonStanding,
  Volleyball,
  // Företagande
  Briefcase,
  Store,
  Handshake,
  Rocket,
  Lightbulb,
  // Jobb
  GraduationCap,
  ClipboardList,
  BadgeCheck,
  UserCheck,
  // Kollektivtrafik
  Bus,
  Train,
  Ship,
  Plane,
  // Kultur
  Palette,
  Music,
  BookOpen,
  Theater,
  Camera,
  Film,
  // Miljö & klimat
  Leaf,
  Recycle,
  Sun,
  CloudSun,
  Wind,
  Thermometer,
  Droplets,
  // Natur
  TreePine,
  Trees,
  Mountain,
  Waves,
  Flower2,
  Bird,
  // Omsorg
  HeartHandshake,
  Heart,
  Baby,
  HandHeart,
  Smile,
  // Skola
  School,
  BookMarked,
  PencilLine,
  Apple,
  // Trafik & framkomlighet
  Car,
  TrafficCone,
  CircleParking,
  Route,
  Footprints,
  Accessibility,
  // Trygghet
  Shield,
  ShieldCheck,
  LockKeyhole,
  Siren,
  Eye,
  // Vård
  Stethoscope,
  Hospital,
  HeartPulse,
  Pill,
  Cross,
  // Välfärd
  Users,
  Globe,
  CircleDot,
  Target,
  // Äldre
  Armchair,
  Clock,
  Glasses,
  // Gemensamma / UI
  User,
  Settings,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Info,
  CircleHelp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Award,
  Zap,
  ExternalLink,
  ChevronRight,
  Search,
  Download,
  Upload,
  Link,
  Wifi,
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
