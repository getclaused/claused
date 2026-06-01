import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import RiskBadge from "@/components/RiskBadge";
import IssueCard from "@/components/IssueCard";
import DownloadButton from "@/components/DownloadButton";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { AnalysisResult, RiskLevel } from "@/lib/supabase/database.types";

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

export default async function AnalysisResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await getSupabaseAdmin()
    .from("analyses")
    .select("id, created_at, file_name, risk_level, result, status, error_message")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const result = data.result as AnalysisResult;
  const riskLevel = (data.risk_level ?? result.risk_level) as RiskLevel;

  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <Container narrow>
          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <RiskBadge level={riskLevel} />
                <span className="text-sm text-text-quaternary">
                  {formatDate(data.created_at)}
                </span>
              </div>
              <DownloadButton
                fileName={data.file_name}
                createdAt={data.created_at}
                result={result}
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary break-all">
              {data.file_name}
            </h1>
          </header>

          {/* Summary */}
          <section className="mb-10 rounded-xl border border-border bg-bg-secondary p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-quaternary mb-3">
              요약
            </p>
            <p className="text-base md:text-lg leading-relaxed text-text-primary break-keep">
              {result.summary}
            </p>
          </section>

          {/* Issues */}
          {result.issues.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-5">
                발견된 이슈 <span className="text-text-quaternary font-normal">({result.issues.length})</span>
              </h2>
              <div className="space-y-4">
                {result.issues.map((issue, idx) => (
                  <IssueCard key={idx} issue={issue} index={idx} />
                ))}
              </div>
            </section>
          )}

          {/* Missing clauses */}
          {result.missing_clauses.length > 0 && (
            <section className="mb-10 rounded-xl border border-danger-border bg-danger-bg p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold text-danger-text mb-4">
                누락된 조항
              </h2>
              <ul className="space-y-2">
                {result.missing_clauses.map((clause, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm md:text-base text-danger-text break-keep"
                  >
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-danger-text flex-shrink-0" />
                    <span>{clause}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Positive points */}
          {result.positive_points.length > 0 && (
            <section className="mb-10 rounded-xl border border-success-border bg-success-bg p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold text-success-text mb-4">
                잘 작성된 조항
              </h2>
              <ul className="space-y-2">
                {result.positive_points.map((point, idx) => (
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
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* CTA */}
          <div className="flex flex-wrap justify-center gap-3 pt-6 border-t border-border">
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] h-13 px-8 text-base gap-2.5 bg-accent text-white hover:bg-accent-hover shadow-sm shadow-accent/20"
            >
              새 계약서 분석하기
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
