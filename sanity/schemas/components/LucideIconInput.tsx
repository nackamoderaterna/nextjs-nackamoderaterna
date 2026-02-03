import React, { useState, useMemo } from "react";
import { Stack, TextInput, Card, Grid, Box, Text, useTheme } from "@sanity/ui";
import { set, unset } from "sanity";
import { StringInputProps } from "sanity";
import {
  // Bo & bygga
  Home, Building2, Building, Warehouse, HardHat, Hammer, Wrench,
  // Demokrati
  Vote, Landmark, Scale, Gavel, Flag, Megaphone,
  // Ekonomi
  Banknote, Wallet, PiggyBank, TrendingUp, BarChart3, PieChart, Receipt,
  // Fritid & idrott
  Dumbbell, Trophy, Medal, Bike, PersonStanding, Volleyball,
  // Företagande
  Briefcase, Store, Handshake, Rocket, Lightbulb,
  // Jobb
  GraduationCap, ClipboardList, BadgeCheck, UserCheck,
  // Kollektivtrafik
  Bus, Train, Ship, Plane,
  // Kultur
  Palette, Music, BookOpen, Theater, Camera, Film,
  // Miljö & klimat
  Leaf, Recycle, Sun, CloudSun, Wind, Thermometer, Droplets,
  // Natur
  TreePine, Trees, Mountain, Waves, Flower2, Bird,
  // Omsorg
  HeartHandshake, Heart, Baby, HandHeart, Smile,
  // Skola
  School, BookMarked, PencilLine, Apple,
  // Trafik & framkomlighet
  Car, TrafficCone, CircleParking, Route, Footprints, Accessibility,
  // Trygghet
  Shield, ShieldCheck, LockKeyhole, Siren, Eye,
  // Vård
  Stethoscope, Hospital, HeartPulse, Pill, Cross,
  // Välfärd
  Users, Globe, CircleDot, Target,
  // Äldre
  Armchair, Clock, Glasses,
  // Gemensamma / UI
  User, Settings, Mail, Phone, MapPin, Calendar,
  FileText, Info, CircleHelp, AlertTriangle, CheckCircle, XCircle,
  Star, Award, Zap, ExternalLink, ChevronRight, Search,
  Download, Upload, Link, Wifi,
} from "lucide-react";

/** @sanity/ui Theme doesn't declare .color; we use it for border/button/card tokens */
type ThemeColorTokens = {
  border?: { enabled?: string };
  button?: { default?: { enabled?: { bg?: string; fg?: string } } };
  card?: {
    enabled?: { bg?: string; fg?: string };
    selected?: { bg?: string; border?: string };
    hovered?: { bg?: string };
  };
};
interface ThemeWithColor {
  color?: ThemeColorTokens;
}

// Only these icons can be selected. Keep in sync with src/lib/utils/iconUtils.ts.
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Home, Building2, Building, Warehouse, HardHat, Hammer, Wrench,
  Vote, Landmark, Scale, Gavel, Flag, Megaphone,
  Banknote, Wallet, PiggyBank, TrendingUp, BarChart3, PieChart, Receipt,
  Dumbbell, Trophy, Medal, Bike, PersonStanding, Volleyball,
  Briefcase, Store, Handshake, Rocket, Lightbulb,
  GraduationCap, ClipboardList, BadgeCheck, UserCheck,
  Bus, Train, Ship, Plane,
  Palette, Music, BookOpen, Theater, Camera, Film,
  Leaf, Recycle, Sun, CloudSun, Wind, Thermometer, Droplets,
  TreePine, Trees, Mountain, Waves, Flower2, Bird,
  HeartHandshake, Heart, Baby, HandHeart, Smile,
  School, BookMarked, PencilLine, Apple,
  Car, TrafficCone, CircleParking, Route, Footprints, Accessibility,
  Shield, ShieldCheck, LockKeyhole, Siren, Eye,
  Stethoscope, Hospital, HeartPulse, Pill, Cross,
  Users, Globe, CircleDot, Target,
  Armchair, Clock, Glasses,
  User, Settings, Mail, Phone, MapPin, Calendar,
  FileText, Info, CircleHelp, AlertTriangle, CheckCircle, XCircle,
  Star, Award, Zap, ExternalLink, ChevronRight, Search,
  Download, Upload, Link, Wifi,
};

const CURATED_ICONS = Object.keys(ICON_MAP);

const LucideIconInput: React.FC<StringInputProps> = (props) => {
  const { value, onChange } = props;
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const theme = useTheme() as ThemeWithColor;

  const filteredIcons = useMemo(() => {
    if (!search) return CURATED_ICONS;
    const lower = search.toLowerCase();
    return CURATED_ICONS.filter((name) => name.toLowerCase().includes(lower));
  }, [search]);

  const handleSelect = (iconName: string) => {
    onChange(set(iconName));
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = () => {
    onChange(unset());
    setSearch("");
  };

  const resolveIcon = (name: string): React.ComponentType<any> | null => {
    return ICON_MAP[name] ?? null;
  };

  const SelectedIcon = value ? resolveIcon(value) : null;

  return (
    <Stack space={3}>
      <Stack space={2}>
        <TextInput
          value={search}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.currentTarget.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          placeholder="Sök bland ikoner…"
        />

        {value && (
          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Box>
                <Text size={1} muted>
                  Vald ikon:
                </Text>
              </Box>
              <Stack space={2} style={{ alignItems: "flex-start" }}>
                {SelectedIcon && (
                  <Box style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <SelectedIcon size={24} />
                    <Text size={1}>{value}</Text>
                  </Box>
                )}
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    cursor: "pointer",
                    border: `1px solid ${theme?.color?.border?.enabled || "#ccc"}`,
                    borderRadius: "4px",
                    background: theme?.color?.button?.default?.enabled?.bg || "transparent",
                    color: theme?.color?.button?.default?.enabled?.fg || "currentColor",
                  }}
                >
                  Rensa
                </button>
              </Stack>
            </Stack>
          </Card>
        )}
      </Stack>

      {isOpen && (
        <Card
          padding={3}
          radius={2}
          shadow={2}
          style={{
            maxHeight: "400px",
            overflow: "auto",
            position: "relative",
            zIndex: 1000,
          }}
        >
          {filteredIcons.length > 0 ? (
            <>
              <Box padding={2} marginBottom={2}>
                <Text size={1} muted>
                  {search
                    ? `${filteredIcons.length} träffar`
                    : `${CURATED_ICONS.length} ikoner`}
                </Text>
              </Box>
              <Grid columns={[3, 4, 5, 6]} gap={2}>
                {filteredIcons.map((iconName) => {
                  const Icon = resolveIcon(iconName);
                  if (!Icon) return null;

                  const isSelected = value === iconName;
                  const safeTheme: ThemeColorTokens = theme?.color ?? {};
                  const safeCard = safeTheme.card ?? {};
                  const safeBorder = safeTheme.border ?? {};
                  const cardBg = isSelected
                    ? safeCard?.selected?.bg || safeCard?.enabled?.bg || undefined
                    : safeCard?.enabled?.bg || undefined;
                  const cardBorder = isSelected
                    ? safeCard?.selected?.border || safeBorder?.enabled || "#ccc"
                    : safeBorder?.enabled || "#ccc";
                  const cardHoverBg = safeCard?.hovered?.bg || safeCard?.enabled?.bg || undefined;
                  const iconColor = safeCard?.enabled?.fg || "currentColor";
                  const hoverBorder = safeBorder?.enabled || "#ccc";

                  return (
                    <Card
                      key={iconName}
                      as="button"
                      type="button"
                      padding={3}
                      radius={2}
                      tone={isSelected ? "primary" : "default"}
                      onClick={() => handleSelect(iconName)}
                      style={{
                        cursor: "pointer",
                        border: `1px solid ${cardBorder}`,
                        ...(cardBg ? { background: cardBg } : {}),
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected && cardHoverBg) {
                          e.currentTarget.style.background = cardHoverBg;
                          e.currentTarget.style.borderColor = hoverBorder;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = cardBg || "";
                          e.currentTarget.style.borderColor = cardBorder;
                        }
                      }}
                    >
                      <Stack space={2} style={{ alignItems: "center" }}>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: iconColor,
                          }}
                        >
                          {React.createElement(Icon, { size: 24 })}
                        </Box>
                        <Text
                          size={0}
                          style={{
                            textAlign: "center",
                            wordBreak: "break-word",
                            fontSize: "10px",
                          }}
                        >
                          {iconName}
                        </Text>
                      </Stack>
                    </Card>
                  );
                })}
              </Grid>
            </>
          ) : (
            <Box padding={4}>
              <Text align="center" muted>
                Inga ikoner hittades för &quot;{search}&quot;
              </Text>
            </Box>
          )}
        </Card>
      )}
    </Stack>
  );
};

export default LucideIconInput;
