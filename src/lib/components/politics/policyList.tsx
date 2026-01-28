import { CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { PoliticalIssue } from "~/sanity.types";

interface PolicyListProps {
  title: string;
  policies: PoliticalIssue[];
  ctaText?: string;
  ctaHref?: string;
}

export function PolicyList({
  title,
  policies,
  ctaText,
  ctaHref,
}: PolicyListProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">{title}</h2>

      <ul className="space-y-4">
        {policies.map((policy, index) => (
          <li key={index} className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground leading-relaxed">
              {policy.question}
            </span>
          </li>
        ))}
      </ul>

      {ctaText && ctaHref && (
        <Button
          asChild
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            {ctaText}
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      )}
    </div>
  );
}
