import { sanityClient } from "@/lib/sanity/client";

async function getPoliticianBySlug(slug: string) {
  const query = `*[_type == "politician" && slug.current == $slug][0]{
  ...,
  image{..., asset->},
  livingArea-> {...},
  politicalAreas[]-> {...},
  namndPositions[]-> {...}
}
`;

  return await sanityClient.fetch(query, { slug });
}

interface PoliticianProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Politician({ params }: PoliticianProps) {
  const { slug } = await params;
  const politician = await getPoliticianBySlug(slug);
  return (
    <div className="w-full mx-auto">
      <h1>{politician.name}</h1>
    </div>
  );
}
