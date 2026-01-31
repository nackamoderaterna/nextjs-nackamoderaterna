import { CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { Sidebar } from "@/lib/components/shared/Sidebar";
import { PoliticalIssue } from "~/sanity.types";

interface PolicyList {
  title: string;
  policies: PoliticalIssue[];
}

export function PolicyList({
  title,
  policies,
}: PolicyList) {
  const fulfilledPolicies = policies.filter((policy) => policy.fulfilled);
  const unfulfilledPolicies = policies.filter((policy) => !policy.fulfilled);
  return (
    <Sidebar heading={title}>
      <ul className="space-y-4 mb-6">
        {fulfilledPolicies.map((policy, index) => (
          <li key={index} className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground leading-relaxed">
              {policy.question}
            </span>
          </li>
        ))}
        {unfulfilledPolicies.map((policy, index) => (
          <li key={index} className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-primary
             flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground leading-relaxed">
              {policy.question}
            </span>
          </li>
        ))}
      </ul> 
    </Sidebar>
  );
}
