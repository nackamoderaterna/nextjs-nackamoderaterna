import { groq } from "next-sanity";
import { Politician } from "~/sanity.types";

// Main query to fetch all politicians with their assignments
export const politiciansDirectoryQuery = groq`*[_type == "politician"] | order(name asc) {
  _id,
  name,
  slug,
  image,
  email,
  phone,
  bio,
  kommunalrad {
    active,
    role
  },
  partyBoard {
    active,
    title,
    isLeader
  },
  kommunfullmaktige {
    active,
    title,
    role
  },
  "namndPositions": namndPositions[] {
    title,
    isLeader,
    "namnd": namndRef-> {
      _id,
      title,
      slug
    }
  },
  "livingArea": livingArea-> {
    _id,
    name,
    slug
  },
  "politicalAreas": politicalAreas[] {
    showOnPoliticalAreaPage,
    "politicalArea": politicalArea-> {
      _id,
      name,
      slug
    }
  },
  socialLinks
}`;

// Sanity image with optional alt/caption (e.g. pressbilder items)
export type PressbildItem = {
  _key?: string;
  asset?: { _ref?: string; _id?: string; url?: string };
  alt?: string | null;
  caption?: string | null;
};

// Type for the query result with dereferenced namnd (overrides schema types for partyBoard, kommunfullmaktige, namndPositions, kommunalrad)
export type PoliticianWithNamnd = Omit<
  Politician,
  "namndPositions" | "livingArea" | "politicalAreas" | "partyBoard" | "kommunfullmaktige" | "kommunalrad"
> & {
  pressbilder?: PressbildItem[] | null;
  kommunalrad?: {
    active?: boolean;
    role?: "president" | "ordinary";
  };
  partyBoard?: {
    active?: boolean;
    title?: string;
    isLeader?: boolean;
  };
  kommunfullmaktige?: {
    active?: boolean;
    title?: string;
    role?: "ordinary" | "substitute";
  };
  namndPositions: Array<{
    title?: string;
    isLeader?: boolean;
    namnd: {
      _id: string;
      title: string;
      slug: {
        current: string;
      };
    };
  }>;
  livingArea?: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
  };
  politicalAreas?: Array<{
    showOnPoliticalAreaPage?: boolean;
    politicalArea: {
      _id: string;
      name: string;
      slug: {
        current: string;
      };
    };
  }>;
  referencedInNews?: Array<{
    _id: string;
    title: string;
    slug: {
      current: string;
    };
    publishedAt?: string;
    excerpt?: string;
    _createdAt: string;
    dateOverride?: string;
    effectiveDate?: string;
    // mainImage?: {
    //   asset: {
    //     _ref: string;
    //     _type: "reference";
    //   };
    //   alt?: string;
    // };
  }>;
  socialLinks?: {
    facebook?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    tiktok?: string | null;
  } | null;
};

/**
 * Removes invisible Unicode characters from a string.
 * This includes zero-width spaces, zero-width non-joiners, BOM markers, and other invisible characters.
 */
export function cleanInvisibleUnicode(str: string | null | undefined): string {
  if (!str) return "";
  
  return str
    // Remove BOM (Byte Order Mark) - \uFEFF
    // Remove zero-width space - \u200B
    // Remove zero-width non-joiner - \u200C
    // Remove zero-width joiner - \u200D
    // Remove word joiner - \u2060
    // Remove left-to-right mark - \u200E
    // Remove right-to-left mark - \u200F
    // Remove directional formatting characters - \u202A-\u202E
    // Remove isolate formatting characters - \u2066-\u2069
    .replace(/[\u200B-\u200D\uFEFF\u2060\u200C\u200D\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "")
    // Trim whitespace
    .trim();
}

/**
 * Recursively cleans all string fields in a politician object, including nested objects.
 * This ensures that invisible Unicode characters are removed from all string values.
 */
export function cleanPoliticianData(politician: PoliticianWithNamnd): PoliticianWithNamnd {
  const cleaned = { ...politician };
  
  // Clean top-level string fields
  if (cleaned.name) {
    cleaned.name = cleanInvisibleUnicode(cleaned.name);
  }
  
  // Clean kommunalrad object
  if (cleaned.kommunalrad) {
    cleaned.kommunalrad = {
      ...cleaned.kommunalrad,
      role: cleaned.kommunalrad.role ? cleanInvisibleUnicode(cleaned.kommunalrad.role) as "president" | "ordinary" : undefined,
    };
  }
  
  // Clean partyBoard object
  if (cleaned.partyBoard) {
    cleaned.partyBoard = {
      ...cleaned.partyBoard,
      title: cleaned.partyBoard.title ? cleanInvisibleUnicode(cleaned.partyBoard.title) : undefined,
    };
  }
  
  // Clean kommunfullmaktige object
  if (cleaned.kommunfullmaktige) {
    cleaned.kommunfullmaktige = {
      ...cleaned.kommunfullmaktige,
      title: cleaned.kommunfullmaktige.title ? cleanInvisibleUnicode(cleaned.kommunfullmaktige.title) : undefined,
      role: cleaned.kommunfullmaktige.role ? cleanInvisibleUnicode(cleaned.kommunfullmaktige.role) as "ordinary" | "substitute" : undefined,
    };
  }
  
  // Clean namndPositions array
  if (cleaned.namndPositions && Array.isArray(cleaned.namndPositions)) {
    cleaned.namndPositions = cleaned.namndPositions.map(pos => ({
      ...pos,
      title: pos.title ? cleanInvisibleUnicode(pos.title) : undefined,
      namnd: pos.namnd ? {
        ...pos.namnd,
        title: cleanInvisibleUnicode(pos.namnd.title),
      } : pos.namnd,
    }));
  }
  
  // Clean livingArea
  if (cleaned.livingArea) {
    cleaned.livingArea = {
      ...cleaned.livingArea,
      name: cleanInvisibleUnicode(cleaned.livingArea.name),
    };
  }
  
  // Clean politicalAreas array
  if (cleaned.politicalAreas && Array.isArray(cleaned.politicalAreas)) {
    cleaned.politicalAreas = cleaned.politicalAreas.map(area => ({
      ...area,
      politicalArea: area.politicalArea ? {
        ...area.politicalArea,
        name: cleanInvisibleUnicode(area.politicalArea.name),
      } : area.politicalArea,
    }));
  }
  
  return cleaned;
}

/**
 * Cleans invisible Unicode characters from politician names
 * @deprecated Use cleanPoliticianData instead for comprehensive cleaning
 */
export function cleanPoliticianName(politician: PoliticianWithNamnd): PoliticianWithNamnd {
  return cleanPoliticianData(politician);
}

// Helper function to group politicians by their roles
export function groupPoliticiansByRole(politicians: PoliticianWithNamnd[]) {
  const groups = {
    kommunalrad: {
      president: [] as PoliticianWithNamnd[],
      ordinary: [] as PoliticianWithNamnd[],
    },
    partyBoard: {
      leaders: [] as PoliticianWithNamnd[],
      members: [] as PoliticianWithNamnd[],
    },
    kommunfullmaktige: {
      ordinary: [] as PoliticianWithNamnd[],
      substitute: [] as PoliticianWithNamnd[],
    },
    namndLeaders: [] as Array<{
      politician: PoliticianWithNamnd;
      namndTitle: string;
      positionTitle: string;
    }>,
    other: [] as PoliticianWithNamnd[], // Politicians with no active assignments
  };

  politicians.forEach((politician) => {
    let hasAssignment = false;
    // Group by Kommunalråd
    if (politician.kommunalrad && politician.kommunalrad.active === true) {
      const role = (politician.kommunalrad.role || "ordinary") as keyof typeof groups.kommunalrad;
      if (role === "president" || role === "ordinary") {
        groups.kommunalrad[role].push(politician);
        hasAssignment = true;
      }
    }

    // Group by Party Board (isLeader -> leaders, else -> members)
    if (politician.partyBoard && politician.partyBoard.active === true) {
      if (politician.partyBoard.isLeader) {
        groups.partyBoard.leaders.push(politician);
      } else {
        groups.partyBoard.members.push(politician);
      }
      hasAssignment = true;
    }

    // Group by Kommunfullmäktige (role: ordinary | substitute)
    if (politician.kommunfullmaktige && politician.kommunfullmaktige.active === true) {
      const role = politician.kommunfullmaktige.role || "ordinary"; // Default to ordinary if not set
      if (role === "ordinary" || role === "substitute") {
        groups.kommunfullmaktige[role].push(politician);
        hasAssignment = true;
      }
    }

    // Group by Nämnd (only leaders, flat list with namnd name as subtitle)
    if (politician.namndPositions && politician.namndPositions.length > 0) {
      politician.namndPositions.forEach((namndPos) => {
        // Only include leaders (isLeader must be explicitly true)
        if (namndPos.isLeader === true && namndPos.namnd?.title) {
          groups.namndLeaders.push({
            politician,
            namndTitle: namndPos.namnd.title,
            positionTitle: namndPos.title?.trim() || "Ordförande",
          });
          hasAssignment = true;
        }
      });
    }

    if (!hasAssignment) {
      groups.other.push(politician);
    }
  });

  return groups;
}

// Fallbacks when free-form title is empty (kommunfullmaktige role only)
export const positionTitles = {
  substitute: "Ersättare",
  ordinary: "Ledamot",
} as const;

// Section title translations
export const sectionTitles = {
  kommunalrad: "Kommunalråd",
  partyBoard: "Föreningsstyrelsen",
  kommunfullmaktige: "Kommunfullmäktige",
  other: "Övriga politiker",
} as const;
