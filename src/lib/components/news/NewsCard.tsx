import Link from "next/link";
import { formatDate } from "@/lib/utils/dateUtils";
import { ArrowRight } from "lucide-react";

interface NewsCardProps {
  date: string;
  slug: string;
  title: string;
  isLast: boolean;
  excerpt: string;
}

export function NewsCard({
  date,
  title,
  excerpt,
  slug,
  isLast,
}: NewsCardProps) {
  return (
    <article
      className={`group relative ${!isLast ? "border-b border-border" : ""}`}
    >
      <Link
        href={`/nyheter/${slug}`}
        className="block py-8 md:py-10 lg:py-12 transition-colors hover:bg-accent/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          <div className="md:col-span-2 flex items-start">
            <time className="text-xs md:text-sm font-mono uppercase tracking-wider text-muted-foreground">
              {formatDate(date)}
            </time>
          </div>

          <div className="md:col-span-8 space-y-3">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-balance group-hover:text-primary transition-colors">
                {title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
              {excerpt}
            </p>
          </div>

          <div className="md:col-span-2 flex items-center justify-start md:justify-end">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border group-hover:border-foreground group-hover:bg-foreground group-hover:text-background transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

// export function NewsCard({ item }: NewsCardProps) {
//   return (
//     <Link
//       href={`/nyheter/${item.slug?.current}`}
//       className="block group h-full"
//     >
//       <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
//         {item.mainImage && (
//           <div className="relative aspect-[16/9] sm:aspect-[4/3] overflow-hidden">
//             <SanityImage
//               image={item.mainImage}
//               fill
//               className="group-hover:scale-105 transition-transform duration-300"
//             />
//           </div>
//         )}
//         <CardHeader>
//           <CardDescription className="text-xs">
//             {item.dateOverride || item._createdAt}
//           </CardDescription>
//           <CardTitle className="text-lg leading-6 line-clamp-2">
//             {item.title}
//           </CardTitle>
//         </CardHeader>
//         {item.excerpt && (
//           <CardContent>
//             <p className="text-sm text-muted-foreground line-clamp-3">
//               {item.excerpt}
//             </p>
//           </CardContent>
//         )}
//       </Card>
//     </Link>
//   );
// }
