import React, { useState, useMemo, useEffect } from "react";
import { Stack, TextInput, Card, Grid, Box, Text } from "@sanity/ui";
import { set, unset } from "sanity";
import { StringInputProps } from "sanity";

// Lazy load lucide-react to avoid issues in Sanity Studio
let LucideIcons: any = null;
let iconNames: string[] = [];
let iconsLoading = false;

// Function to load icons
const loadIcons = (): string[] => {
  // Return cached icons if already loaded
  if (LucideIcons && iconNames.length > 0) {
    return iconNames;
  }
  
  // Prevent multiple simultaneous loads
  if (iconsLoading) {
    return iconNames;
  }
  
  try {
    iconsLoading = true;
    // Dynamic require for better compatibility in Sanity Studio
    LucideIcons = require("lucide-react");
    
    if (!LucideIcons) {
      console.warn("lucide-react module not found");
      iconNames = ["Heart", "Home", "User", "Settings", "Mail", "Phone", "MapPin", "Calendar"];
      iconsLoading = false;
      return iconNames;
    }
    
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
    
    const filtered = allKeys
      .filter((name) => {
        // Exclude known non-icon exports
        if (excludeList.includes(name) || name.startsWith("_") || name.startsWith("lucide")) {
          return false;
        }
        
        const icon = LucideIcons[name];
        // Check if it's a function (React component)
        return typeof icon === "function";
      })
      .sort(); // Sort alphabetically for better UX
    
    iconNames = filtered;
    iconsLoading = false;
    
    if (iconNames.length === 0) {
      console.warn("No Lucide icons found after filtering");
    }
    
    return iconNames;
  } catch (error) {
    console.error("Error loading Lucide icons:", error);
    iconsLoading = false;
    // Return some common icons as fallback
    iconNames = ["Heart", "Home", "User", "Settings", "Mail", "Phone", "MapPin", "Calendar"];
    return iconNames;
  }
};

const LucideIconInput: React.FC<StringInputProps> = (props) => {
  const { value, onChange } = props;
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [iconsLoaded, setIconsLoaded] = useState<boolean>(false);

  // Load icons on mount
  useEffect(() => {
    if (!iconsLoaded) {
      loadIcons();
      setIconsLoaded(true);
    }
  }, [iconsLoaded]);

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
  }, [search, iconsLoaded]);

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
    if (!LucideIcons) {
      loadIcons();
    }
    if (!LucideIcons) return null;
    
    const Icon = LucideIcons[value];
    if (typeof Icon === "function") {
      return Icon as React.ComponentType<{ size?: number; className?: string }>;
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
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "white",
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
                    if (!LucideIcons) {
                      loadIcons();
                    }
                    if (!LucideIcons) return null;
                    
                    const IconComponent = LucideIcons[iconName] as React.ComponentType<{
                      size?: number;
                      className?: string;
                    }>;
                    
                    // Safety check - only render if IconComponent is valid
                    if (!IconComponent || typeof IconComponent !== "function") {
                      return null;
                    }
                    
                    return (
                      <Card
                        key={iconName}
                        as="button"
                        type="button"
                        padding={3}
                        radius={2}
                        tone={value === iconName ? "primary" : "default"}
                        onClick={() => handleSelect(iconName)}
                        style={{
                          cursor: "pointer",
                          border: value === iconName ? "2px solid #2276fc" : "1px solid #e1e3e6",
                          background: value === iconName ? "#f1f5f9" : "white",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (value !== iconName) {
                            e.currentTarget.style.background = "#f9fafb";
                            e.currentTarget.style.borderColor = "#cbd5e0";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (value !== iconName) {
                            e.currentTarget.style.background = "white";
                            e.currentTarget.style.borderColor = "#e1e3e6";
                          }
                        }}
                      >
                        <Stack space={2} style={{ alignItems: "center" }}>
                          <IconComponent size={24} />
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
