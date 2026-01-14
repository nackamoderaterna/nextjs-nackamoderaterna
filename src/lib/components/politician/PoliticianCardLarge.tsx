import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconGlobe,
  IconGlobeFilled,
  IconMail,
} from "@tabler/icons-react";
import { SanityImage } from "../shared/SanityImage";
import { Politician } from "~/sanity.types";

interface PeopleCardProps {
  image: any;
  name?: string;
  title: string;
  size: "small" | "large";
}

export function PeopleCard({
  image,
  title,
  name,
  size = "small",
}: PeopleCardProps) {
  const isSmall = size === "small";

  if (isSmall) {
    return (
      <div className="flex items-center gap-3 group">
        {/* Small circular image on the left */}
        <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
          <SanityImage image={image} fill />
        </div>

        {/* Text on the right */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-tight">
            {name}
          </h3>
          <p className="text-muted-foreground text-xs mt-0.5 leading-tight">
            {title}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className={`relative h-64 w-full overflow-hidden bg-muted`}>
        <SanityImage fill image={image} />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className={`font-semibold text-foreground text-xl`}>{name}</h3>
        <p className={`text-muted-foreground text-base mt-1`}>{title}</p>

        {/* Contact Icons - Only for Large Size */}
      </div>
    </div>
  );
}

// export function PoliticianCardLarge({
//   image,
//   name,
//   subtitle,
// }: PoliticianCardLargeProps) {
//   return (
//     <div className="overflow-hidden group hover:shadow-lg transition-shadow">
//       <div className="relative aspect-[3/4]">
//         <SanityImage fill image={image} />
//       </div>
//       <div className="p-4">
//         <h3 className="font-semibold text-lg mb-1">{name}</h3>
//         <p className="text-sm text-muted-foreground mb-3">{subtitle}</p>
//         <div className="flex gap-3">
//           <a
//             href="#"
//             className="text-muted-foreground hover:text-foreground transition-colors"
//           >
//             <IconMail className="h-5 w-5" />
//           </a>
//           <a
//             href="#"
//             className="text-muted-foreground hover:text-foreground transition-colors"
//           >
//             <IconBrandInstagram className="h-5 w-5" />
//           </a>
//           <a
//             href="#"
//             className="text-muted-foreground hover:text-foreground transition-colors"
//           >
//             <IconBrandFacebook className="h-5 w-5" />
//           </a>
//           <a
//             href="#"
//             className="text-muted-foreground hover:text-foreground transition-colors"
//           >
//             <IconGlobe className="h-5 w-5" />
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }
