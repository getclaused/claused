import Link from "next/link";
import RiskBadge from "@/components/RiskBadge";
import OutcomeBadge from "@/components/OutcomeBadge";
import type {
  NegotiationOutcome,
  RiskLevel,
} from "@/lib/supabase/database.types";

export type HistoryEntry =
  | {
      kind: "analysis";
      id: string;
      createdAt: string;
      fileName: string;
      riskLevel: RiskLevel;
      issueCount: number;
    }
  | {
      kind: "comparison";
      id: string;
      createdAt: string;
      fileNameA: string;
      fileNameB: string;
      outcome: NegotiationOutcome;
      changeCount: number;
    };

function formatKstDate(iso: string): string {
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour") === "24" ? "00" : get("hour");
  const minute = get("minute");
  return `${year}.${month}.${day} ${hour}:${minute}`;
}

interface HistoryListProps {
  entries: HistoryEntry[];
}

export default function HistoryList({ entries }: HistoryListProps) {
  return (
    <ul className="space-y-3">
      {entries.map((entry) => {
        const href =
          entry.kind === "analysis"
            ? `/analyze/${entry.id}`
            : `/compare/${entry.id}`;

        return (
          <li key={`${entry.kind}-${entry.id}`}>
            <Link
              href={href}
              className="block rounded-xl border border-border bg-bg-primary p-5 md:p-6 transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-text-quaternary hover:bg-bg-secondary"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-bg-tertiary text-text-secondary">
                    {entry.kind === "analysis" ? "분석" : "비교"}
                  </span>
                  {entry.kind === "analysis" ? (
                    <RiskBadge level={entry.riskLevel} size="sm" />
                  ) : (
                    <OutcomeBadge outcome={entry.outcome} size="sm" />
                  )}
                </div>
                <span className="text-xs text-text-quaternary">
                  {formatKstDate(entry.createdAt)}
                </span>
              </div>

              {entry.kind === "analysis" ? (
                <>
                  <p className="text-base md:text-lg font-medium text-text-primary break-all">
                    {entry.fileName}
                  </p>
                  <p className="mt-1 text-xs md:text-sm text-text-tertiary">
                    이슈 {entry.issueCount}건
                  </p>
                </>
              ) : (
                <>
                  <p className="text-base md:text-lg font-medium text-text-primary break-all">
                    <span className="text-text-tertiary text-sm mr-1.5">A</span>
                    {entry.fileNameA}
                  </p>
                  <p className="text-base md:text-lg font-medium text-text-primary break-all">
                    <span className="text-text-tertiary text-sm mr-1.5">B</span>
                    {entry.fileNameB}
                  </p>
                  <p className="mt-1 text-xs md:text-sm text-text-tertiary">
                    변경점 {entry.changeCount}건
                  </p>
                </>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
