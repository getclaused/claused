"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import HistoryList, { type HistoryEntry } from "@/components/HistoryList";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type {
  AnalysisResult,
  ComparisonResult,
  RiskLevel,
} from "@/lib/supabase/database.types";

const SESSION_KEY = "claused_session_id";

type LoadState = "loading" | "ready" | "error";

interface AnalysisRow {
  id: string;
  file_name: string;
  created_at: string;
  risk_level: RiskLevel | null;
  result: AnalysisResult;
}

interface ComparisonRow {
  id: string;
  file_name_a: string;
  file_name_b: string;
  created_at: string;
  result: ComparisonResult;
}

export default function HistoryPage() {
  const [state, setState] = useState<LoadState>("loading");
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const sessionId = window.localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      setEntries([]);
      setState("ready");
      return;
    }

    const supabase = getSupabaseBrowser();
    Promise.all([
      supabase
        .from("analyses")
        .select("id, file_name, created_at, risk_level, result")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false }),
      supabase
        .from("comparisons")
        .select("id, file_name_a, file_name_b, created_at, result")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false }),
    ])
      .then(([analysesRes, comparisonsRes]) => {
        if (analysesRes.error) {
          console.error("analyses fetch error:", analysesRes.error);
          setState("error");
          return;
        }
        // comparisons may not exist yet (migration not applied) — degrade gracefully.
        const comparisons: ComparisonRow[] = comparisonsRes.error
          ? []
          : ((comparisonsRes.data ?? []) as ComparisonRow[]);
        const analyses = (analysesRes.data ?? []) as AnalysisRow[];

        const merged: HistoryEntry[] = [
          ...analyses.map<HistoryEntry>((row) => ({
            kind: "analysis",
            id: row.id,
            createdAt: row.created_at,
            fileName: row.file_name,
            riskLevel: (row.risk_level ?? row.result?.risk_level) as RiskLevel,
            issueCount: row.result?.issues?.length ?? 0,
          })),
          ...comparisons.map<HistoryEntry>((row) => ({
            kind: "comparison",
            id: row.id,
            createdAt: row.created_at,
            fileNameA: row.file_name_a,
            fileNameB: row.file_name_b,
            outcome: row.result?.negotiation_outcome ?? "neutral",
            changeCount: row.result?.changes?.length ?? 0,
          })),
        ].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

        setEntries(merged);
        setState("ready");
      })
      .catch((err) => {
        console.error("history load error:", err);
        setState("error");
      });
  }, []);

  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <Container narrow>
          <h1 className="text-[2rem] leading-[1.2] md:text-[2.5rem] md:leading-[1.15] font-bold tracking-tight text-text-primary mb-4 break-keep">
            내 분석 이력
          </h1>
          <p className="text-base md:text-lg text-text-tertiary mb-10 break-keep">
            이 브라우저에서 분석한 계약서 목록입니다.
          </p>

          {state === "loading" && (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
            </div>
          )}

          {state === "error" && (
            <div className="rounded-xl border border-danger-border bg-danger-bg p-6 text-center">
              <p className="text-sm text-danger-text">
                이력을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
              </p>
            </div>
          )}

          {state === "ready" && entries.length === 0 && (
            <div className="rounded-xl border border-border bg-bg-secondary p-10 md:p-16 text-center">
              <p className="text-base md:text-lg font-medium text-text-primary mb-2">
                아직 분석한 계약서가 없습니다.
              </p>
              <p className="text-sm text-text-tertiary mb-6 break-keep">
                PDF 를 업로드하면 분석 이력이 이곳에 표시됩니다.
              </p>
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] h-11 px-6 text-sm gap-2 bg-accent text-white hover:bg-accent-hover shadow-sm shadow-accent/20"
              >
                계약서 분석하기
              </Link>
            </div>
          )}

          {state === "ready" && entries.length > 0 && (
            <HistoryList entries={entries} />
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
