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
  kommunalrad,
  partyBoard,
  kommunfullmaktige,
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
    title
  },
  "politicalAreas": politicalAreas[] {
    showOnPoliticalAreaPage,
    "politicalArea": politicalArea-> {
      _id,
      name,
      slug
    }
  },
  socialMedia
}`;

// Type for the query result with dereferenced namnd (overrides schema types for partyBoard, kommunfullmaktige, namndPositions, kommunalrad)
export type PoliticianWithNamnd = Omit<
  Politician,
  "namndPositions" | "livingArea" | "politicalAreas" | "partyBoard" | "kommunfullmaktige" | "kommunalrad"
> & {
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
    slug: string;
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
    // mainImage?: {
    //   asset: {
    //     _ref: string;
    //     _type: "reference";
    //   };
    //   alt?: string;
    // };
  }>;
};

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
  partyBoard: "Partistyrelse",
  kommunfullmaktige: "Kommunfullmäktige",
  other: "Övriga politiker",
} as const;
