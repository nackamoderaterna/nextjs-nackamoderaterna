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
    position,
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
  "politicalAreas": politicalAreas[]-> {
    _id,
    name,
    slug,
  },
  socialMedia
}`;

// Type for the query result with dereferenced namnd
export type PoliticianWithNamnd = Omit<
  Politician,
  "namndPositions" | "livingArea" | "politicalAreas"
> & {
  namndPositions: Array<{
    position:
      | "president"
      | "first-president"
      | "second-president"
      | "groupleader"
      | "member"
      | "replacement";
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
    _id: string;
    name: string;
    slug: string;
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
      ordforande: [] as PoliticianWithNamnd[],
      ledamot: [] as PoliticianWithNamnd[],
    },
    kommunfullmaktige: {
      ordinary: [] as PoliticianWithNamnd[],
      substitute: [] as PoliticianWithNamnd[],
    },
    namnder: {} as Record<
      string,
      {
        namndInfo: {
          _id: string;
          title: string;
          slug: { current: string };
        };
        positions: Record<string, PoliticianWithNamnd[]>;
      }
    >,
    other: [] as PoliticianWithNamnd[], // Politicians with no active assignments
  };

  politicians.forEach((politician) => {
    let hasAssignment = false;
    // Group by Kommunalråd
    if (politician.kommunalrad?.active && politician.kommunalrad.role) {
      const role = politician.kommunalrad
        .role as keyof typeof groups.kommunalrad;
      groups.kommunalrad[role].push(politician);
      hasAssignment = true;
    }

    // Group by Party Board
    if (politician.partyBoard?.active && politician.partyBoard.position) {
      const position = politician.partyBoard
        .position as keyof typeof groups.partyBoard;
      groups.partyBoard[position].push(politician);
      hasAssignment = true;
    }

    // Group by Kommunfullmäktige
    if (
      politician.kommunfullmaktige?.active &&
      politician.kommunfullmaktige.role
    ) {
      const role = politician.kommunfullmaktige
        .role as keyof typeof groups.kommunfullmaktige;
      groups.kommunfullmaktige[role].push(politician);
      hasAssignment = true;
    }

    // Group by Nämnd
    if (politician.namndPositions && politician.namndPositions.length > 0) {
      politician.namndPositions.forEach((namndPos) => {
        const namndId = namndPos.namnd._id;

        if (!groups.namnder[namndId]) {
          groups.namnder[namndId] = {
            namndInfo: namndPos.namnd,
            positions: {},
          };
        }

        if (!groups.namnder[namndId].positions[namndPos.position]) {
          groups.namnder[namndId].positions[namndPos.position] = [];
        }

        groups.namnder[namndId].positions[namndPos.position].push(politician);
        hasAssignment = true;
      });
    }

    if (!hasAssignment) {
      groups.other.push(politician);
    }
  });

  return groups;
}

// Position title translations
export const positionTitles = {
  // Kommunalråd
  president: "Ordförande",
  ordinary: "Kommunalråd",

  // Party Board
  ordforande: "Ordförande",
  ledamot: "Ledamot",

  // Kommunfullmäktige
  substitute: "Ersättare",

  // Nämnd positions
  "first-president": "1:e vice ordförande",
  "second-president": "2:e vice ordförande",
  groupleader: "Gruppledare",
  member: "Ledamot",
  replacement: "Ersättare",
} as const;

// Section title translations
export const sectionTitles = {
  kommunalrad: "Kommunalråd",
  partyBoard: "Styrelsen",
  kommunfullmaktige: "Kommunfullmäktige",
  namnder: "Nämnder",
  other: "Övriga politiker",
} as const;
