import React, { useState, useMemo, useEffect } from "react";
import { Stack, TextInput, Card, Grid, Box, Text, useTheme } from "@sanity/ui";
import { set, unset } from "sanity";
import { StringInputProps } from "sanity";
import * as LucideIcons from "lucide-react";

// Cache icon names after first load
let iconNames: string[] = [];

// Function to load and cache icon names
const loadIcons = (): string[] => {
  // Return cached icons if already loaded
  if (iconNames.length > 0) {
    return iconNames;
  }
  
  try {
    const allKeys = Object.keys(LucideIcons);
    const excludeList = [
      "createLucideIcon",
      "Icon",
      "default",
      "lucideReactNative",
      "IconNode",
      "IconProps",
      "IconTree",
      "LucideProps",
      "LucideIcon",
    ];
    
    const seen = new Set<string>();
    const filtered = allKeys
      .filter((name) => {
        // Exclude known non-icon exports
        if (excludeList.includes(name) || name.startsWith("_") || name.startsWith("Lucide")) {
          return false;
        }
        
        // Skip Icon-suffixed versions to avoid duplicates (e.g., "HeartIcon" when we have "Heart")
        if (name.endsWith("Icon")) {
          const baseName = name.slice(0, -4); // Remove "Icon" suffix
          if (allKeys.includes(baseName)) {
            return false; // Skip if base name exists
          }
        }
        
        const icon = LucideIcons[name];
        // Check if it's a valid React component
        // Lucide icons are objects with a render method, not functions
        const isFunction = typeof icon === "function";
        const isObject = typeof icon === "object" && icon !== null;
        // Check if object has render method (valid React component)
        const hasRender = isObject && typeof (icon as any).render === "function";
        
        const isValidComponent = isFunction || hasRender;
        
        if (isValidComponent) {
          // Use base name if it exists, otherwise use the current name
          const baseName = name.endsWith("Icon") ? name.slice(0, -4) : name;
          if (!seen.has(baseName)) {
            seen.add(baseName);
            return true;
          }
        }
        return false;
      })
      .map((name) => (name.endsWith("Icon") ? name.slice(0, -4) : name))
      .sort(); // Sort alphabetically for better UX
    
    iconNames = filtered;
    
    if (iconNames.length === 0) {
      console.warn("No Lucide icons found after filtering");
    }
    
    return iconNames;
  } catch (error) {
    console.error("Error loading Lucide icons:", error);
    // Return some common icons as fallback
    iconNames = ["Heart", "Home", "User", "Settings", "Mail", "Phone", "MapPin", "Calendar"];
    return iconNames;
  }
};

const LucideIconInput: React.FC<StringInputProps> = (props) => {
  const { value, onChange } = props;
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const theme = useTheme();

  // Load icons on mount
  useEffect(() => {
    loadIcons();
  }, []);

  const filteredIcons = useMemo(() => {
    const icons = loadIcons(); // Ensure icons are loaded
    if (!search) {
      // Show first 60 icons by default when no search
      return icons.slice(0, 60);
    }

    const searchLower = search.toLowerCase();
    return icons
      .filter((name) => name.toLowerCase().includes(searchLower))
      .slice(0, 100); // Limit search results
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

  // Get the selected icon component
  const getSelectedIcon = () => {
    if (!value || typeof value !== "string") return null;
    
    // Try the exact name first
    let Icon = LucideIcons[value as keyof typeof LucideIcons];
    
    // If not found, try with "Icon" suffix
    if (!Icon) {
      Icon = LucideIcons[`${value}Icon` as keyof typeof LucideIcons];
    }
    
    // Check if it's a valid React component - can be function or object
    if (Icon && (typeof Icon === "function" || (typeof Icon === "object" && Icon !== null))) {
      return Icon as React.ComponentType<any>;
    }
    return null;
  };

  const SelectedIcon = getSelectedIcon();

  return (
    <Stack space={3}>
      <Stack space={2}>
        <TextInput
          value={search}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.currentTarget.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
          onClick={() => {
            setIsOpen(true);
          }}
          placeholder="Sök efter ikon... (klicka för att se alla ikoner)"
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
                    ? `Visar ${filteredIcons.length} ikoner`
                    : `Visar ${filteredIcons.length} av ${loadIcons().length} ikoner. Skriv för att söka.`}
                </Text>
              </Box>
              <Grid columns={[3, 4, 5, 6]} gap={2}>
                {filteredIcons.map((iconName) => {
                  try {
                    // Try the exact name first
                    let IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
                    
                    // If not found, try with "Icon" suffix
                    if (!IconComponent) {
                      IconComponent = LucideIcons[`${iconName}Icon` as keyof typeof LucideIcons];
                    }
                    
                    // Safety check - only render if IconComponent is valid
                    if (!IconComponent) {
                      return null;
                    }
                    
                    // Check if it's a valid React component
                    // Lucide icons are objects with render methods, not plain functions
                    const isFunction = typeof IconComponent === "function";
                    const isObject = typeof IconComponent === "object" && IconComponent !== null;
                    const hasRender = isObject && typeof (IconComponent as any).render === "function";
                    
                    // Only render if it's a function or an object with a render method
                    if (!isFunction && !hasRender) {
                      return null;
                    }
                    
                    const Icon = IconComponent as React.ComponentType<any>;
                    
                    const isSelected = value === iconName;
                    
                    // Get theme colors with safe fallbacks
                    // Safely access theme properties with proper fallbacks
                    const safeTheme = theme?.color || {};
                    const safeCard = safeTheme?.card || {};
                    const safeBorder = safeTheme?.border || {};
                    
                    const cardBg = isSelected 
                      ? (safeCard?.selected?.bg || safeCard?.enabled?.bg || undefined)
                      : (safeCard?.enabled?.bg || undefined);
                    const cardBorder = isSelected
                      ? (safeCard?.selected?.border || safeBorder?.enabled || "#ccc")
                      : (safeBorder?.enabled || "#ccc");
                    const cardHoverBg = safeCard?.hovered?.bg || safeCard?.enabled?.bg || undefined;
                    // Use currentColor for icon so it inherits from parent, or get from theme
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
                            if (cardBg) {
                              e.currentTarget.style.background = cardBg;
                            } else {
                              e.currentTarget.style.background = "";
                            }
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
                  } catch (error) {
                    // Skip icons that can't be rendered
                    return null;
                  }
                })}
              </Grid>
            </>
          ) : (
            <Box padding={4}>
              <Text align="center" muted>
                {search
                  ? `Inga ikoner hittades för "${search}"`
                  : loadIcons().length === 0
                  ? "Inga ikoner kunde laddas. Kontrollera att lucide-react är installerat."
                  : "Inga ikoner tillgängliga"}
              </Text>
            </Box>
          )}
        </Card>
      )}
    </Stack>
  );
};

export default LucideIconInput;