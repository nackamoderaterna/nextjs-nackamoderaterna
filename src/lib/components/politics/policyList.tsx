import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PoliticalIssue } from "~/sanity.types";
import { ROUTE_BASE } from "@/lib/routes";

interface PolicyList {
  policies: PoliticalIssue[];
}

function PolicyItem({
  policy,
  fulfilled,
}: {
  policy: PoliticalIssue;
  fulfilled: boolean;
}) {
  const issueSlug = (policy as PoliticalIssue & { slug?: { current?: string } })
    .slug?.current;
  const content = (
    <span className="text-sm text-foreground leading-relaxed">
      {policy.question}
    </span>
  );

  return (
    <li className="group flex gap-3 rounded-md px-4 py-2 transition-colors hover:bg-accent">
      <CheckCircle2
        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
          fulfilled ? "text-green-600" : "text-brand-primary"
        }`}
      />
      {issueSlug ? (
        <Link
          href={`${ROUTE_BASE.POLITICS_ISSUES}/${issueSlug}`}
          className="transition-colors hover:text-accent-foreground group-hover:text-accent-foreground"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
}

export function PolicyList({ policies }: PolicyList) {
  // Sort: kärnfrågor (featured) first, then genomfört (fulfilled), then rest
  const sorted = [
    ...policies.filter((p) => p.featured && !p.fulfilled),
    ...policies.filter((p) => p.featured && p.fulfilled),
    ...policies.filter((p) => !p.featured && p.fulfilled),
    ...policies.filter((p) => !p.featured && !p.fulfilled),
  ];

  return (
    <ul>
      {sorted.map((policy, index) => (
        <PolicyItem
          key={policy._id ?? index}
          policy={policy}
          fulfilled={!!policy.fulfilled}
        />
      ))}
    </ul>
  );
}
