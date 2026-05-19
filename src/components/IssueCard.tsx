import RiskBadge from "@/components/RiskBadge";
import type { AnalysisIssue } from "@/lib/supabase/database.types";

interface IssueCardProps {
  issue: AnalysisIssue;
  index: number;
}

const borderStyles = {
  high: "border-l-4 border-l-[#DC2626]",
  medium: "border-l-4 border-l-[#F59E0B]",
  low: "border-l-4 border-l-[#10B981]",
} as const;

export default function IssueCard({ issue, index }: IssueCardProps) {
  return (
    <article
      className={`rounded-xl border border-border bg-bg-primary p-5 md:p-6 ${borderStyles[issue.severity]}`}
    >
      <header className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-quaternary">#{index + 1}</span>
          <h3 className="text-base md:text-lg font-semibold text-text-primary break-keep">
            {issue.category}
          </h3>
        </div>
        <RiskBadge level={issue.severity} size="sm" />
      </header>

      <blockquote className="mb-3 rounded-md bg-bg-secondary border-l-2 border-text-muted px-3 py-2 text-sm italic text-text-secondary break-keep">
        “{issue.clause_excerpt}”
      </blockquote>

      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-quaternary mb-1">
          문제점
        </p>
        <p className="text-sm md:text-base text-text-secondary leading-relaxed break-keep">
          {issue.description}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-quaternary mb-1">
          제안
        </p>
        <p className="text-sm md:text-base text-text-secondary leading-relaxed break-keep">
          {issue.suggestion}
        </p>
      </div>
    </article>
  );
}
