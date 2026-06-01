import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import OutcomeBadge from "@/components/OutcomeBadge";
import ComparisonDownloadButton from "@/components/ComparisonDownloadButton";
import { getSupabaseAdmin } from "@/lib/supabase";
import type {
  ChangeType,
  ComparisonChange,
  ComparisonResult,
  RiskChange,
} from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

const changeTypeLabel: Record<ChangeType, string> = {
  modified: "변경",
  added: "추가",
  removed: "삭제",
};

const changeTypeStyles: Record<ChangeType, string> = {
  modified: "bg-[#DBEAFE] text-[#1D4ED8]",
  added: "bg-[#D1FAE5] text-[#047857]",
  removed: "bg-[#E5E7EB] text-[#374151]",
};

const riskChangeStyles: Record<RiskChange, string> = {
  increased: "text-[#DC2626]",
  decreased: "text-[#10B981]",
  unchanged: "text-text-tertiary",
};

const riskChangeLabel: Record<RiskChange, string> = {
  increased: "위험 증가 ↑",
  decreased: "위험 감소 ↓",
  unchanged: "위험 동일 →",
};

function ChangeCard({ change, index }: { change: ComparisonChange; index: number }) {
  return (
    <article className="rounded-xl border border-border bg-bg-primary p-5 md:p-6">
      <header className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs text-text-quaternary font-mono">#{index + 1}</span>
        <span
          className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md ${changeTypeStyles[change.change_type]}`}
        >
          {changeTypeLabel[change.change_type]}
        </span>
        <span className={`text-xs font-medium ${riskChangeStyles[change.risk_change]}`}>
          {riskChangeLabel[change.risk_change]}
        </span>
        <h3 className="text-base md:text-lg font-semibold text-text-primary break-keep">
          {change.category}
        </h3>
      </header>

      {change.before && change.change_type !== "added" && (
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-quaternary mb-1">
            이전 (A)
          </p>
          <blockquote className="border-l-2 border-border pl-3 text-sm text-text-secondary break-keep">
            {change.before}
          </blockquote>
        </div>
      )}

      {change.after && change.change_type !== "removed" && (
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-quaternary mb-1">
            이후 (B)
          </p>
          <blockquote className="border-l-2 border-accent pl-3 text-sm text-text-primary break-keep">
            {change.after}
          </blockquote>
        </div>
      )}

      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-quaternary mb-1">
          영향
        </p>
        <p className="text-sm md:text-base text-text-primary break-keep">{change.impact}</p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-quaternary mb-1">
          제안
        </p>
        <p className="text-sm md:text-base text-text-primary break-keep">
          {change.recommendation}
        </p>
      </div>
    </article>
  );
}

export default async function ComparisonResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await getSupabaseAdmin()
    .from("comparisons")
    .select(
      "id, created_at, file_name_a, file_name_b, result, status, error_message"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const result = data.result as ComparisonResult;

  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <Container narrow>
          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <OutcomeBadge outcome={result.negotiation_outcome} />
                <span className="text-sm text-text-quaternary">
                  {formatDate(data.created_at)}
                </span>
              </div>
              <ComparisonDownloadButton
                fileNameA={data.file_name_a}
                fileNameB={data.file_name_b}
                createdAt={data.created_at}
                result={result}
              />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-text-primary break-all">
              <span className="text-text-tertiary text-sm md:text-base mr-2">A.</span>
              {data.file_name_a}
            </h1>
            <div className="my-1 text-text-quaternary text-sm">↓</div>
            <h1 className="text-xl md:text-2xl font-bold text-text-primary break-all">
              <span className="text-text-tertiary text-sm md:text-base mr-2">B.</span>
              {data.file_name_b}
            </h1>
          </header>

          {/* Summary */}
          <section className="mb-10 rounded-xl border border-border bg-bg-secondary p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-quaternary mb-3">
              요약
            </p>
            <p className="text-base md:text-lg leading-relaxed text-text-primary break-keep mb-4">
              {result.summary}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-quaternary mb-2">
              평가 이유
            </p>
            <p className="text-sm md:text-base leading-relaxed text-text-secondary break-keep">
              {result.outcome_reason}
            </p>
          </section>

          {/* Changes */}
          {result.changes.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-5">
                변경점 <span className="text-text-quaternary font-normal">({result.changes.length})</span>
              </h2>
              <div className="space-y-4">
                {result.changes.map((change, idx) => (
                  <ChangeCard key={idx} change={change} index={idx} />
                ))}
              </div>
            </section>
          )}

          {/* Remaining concerns */}
          {result.remaining_concerns.length > 0 && (
            <section className="mb-10 rounded-xl border border-danger-border bg-danger-bg p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold text-danger-text mb-4">
                남은 우려 사항
              </h2>
              <ul className="space-y-2">
                {result.remaining_concerns.map((concern, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm md:text-base text-danger-text break-keep"
                  >
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-danger-text flex-shrink-0" />
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Successful negotiations */}
          {result.successful_negotiations.length > 0 && (
            <section className="mb-10 rounded-xl border border-success-border bg-success-bg p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold text-success-text mb-4">
                성공적으로 개선된 조항
              </h2>
              <ul className="space-y-2">
                {result.successful_negotiations.map((success, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm md:text-base text-success-text break-keep"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="mt-1.5 flex-shrink-0"
                    >
                      <path
                        d="M3 7l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{success}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* CTA */}
          <div className="flex flex-wrap justify-center gap-3 pt-6 border-t border-border">
            <Link
              href="/compare"
              className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] h-13 px-8 text-base gap-2.5 bg-accent text-white hover:bg-accent-hover shadow-sm shadow-accent/20"
            >
              새 비교 분석하기
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] h-13 px-8 text-base gap-2.5 bg-bg-primary text-text-primary border border-border hover:border-text-quaternary hover:bg-bg-secondary"
            >
              내 분석 이력
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
