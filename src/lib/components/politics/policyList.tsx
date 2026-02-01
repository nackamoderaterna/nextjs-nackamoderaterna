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
    <li className="flex gap-3">
      <CheckCircle2
        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
          fulfilled ? "text-green-600" : "text-brand-primary"
        }`}
      />
      {issueSlug ? (
        <Link
          href={`${ROUTE_BASE.POLITICS_ISSUES}/${issueSlug}`}
          className="hover:underline"
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
  const fulfilledPolicies = policies.filter((policy) => policy.fulfilled);
  const unfulfilledPolicies = policies.filter((policy) => !policy.fulfilled);
  return (
    <ul className="space-y-4">
      {fulfilledPolicies.map((policy, index) => (
        <PolicyItem key={policy._id ?? index} policy={policy} fulfilled />
      ))}
      {unfulfilledPolicies.map((policy, index) => (
        <PolicyItem key={policy._id ?? index} policy={policy} fulfilled={false} />
      ))}
    </ul>
  );
}
