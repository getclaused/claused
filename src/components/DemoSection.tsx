"use client";

import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";

const contractLines = [
  { text: "제5조 (위약금)", type: "heading" as const },
  { text: "을은 본 계약을 위반할 경우 계약금액의", type: "normal" as const },
  { text: "10배에 해당하는 금액을 위약금으로 갑에게", type: "danger" as const },
  { text: "지급하여야 하며, 이에 대한 이의를", type: "danger" as const },
  { text: "제기할 수 없다.", type: "danger" as const },
  { text: "", type: "normal" as const },
  { text: "제6조 (손해배상)", type: "heading" as const },
  { text: "을의 귀책사유로 발생한 모든 직·간접", type: "normal" as const },
  { text: "손해에 대해 무한 연대책임을 진다.", type: "danger" as const },
];

const analysis = {
  clause: "제5조 위약금 조항",
  risk: "계약금액 ₩5,000,000 × 10배 = ₩50,000,000",
  issue: "민법 제398조 부당이득 조항 위반 소지. 통상 손해 예상액의 2배 초과 시 법원이 감액 가능.",
  alternative: "위약금은 계약금액의 30%를 초과할 수 없으며, 실제 손해 입증 시 해당 금액으로 한정한다.",
};

export default function DemoSection() {
  const [stage, setStage] = useState(0); // 0: scanning, 1: highlighted, 2: analysis, 3: alternative
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((prev) => {
        if (prev >= 3) return 0;
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (stage === 0) {
      setScanLine(0);
      const lineTimer = setInterval(() => {
        setScanLine((prev) => (prev < contractLines.length - 1 ? prev + 1 : prev));
      }, 300);
      return () => clearInterval(lineTimer);
    }
  }, [stage]);

  return (
    <section id="demo" className="py-20 md:py-28 bg-bg-secondary">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="gold" className="mb-4">LIVE DEMO</Badge>
          <h2 className="text-[1.75rem] md:text-[2.5rem] leading-tight font-bold text-text-primary mb-4 break-keep">
            독소조항을 찾아내고, 대안을 제시합니다.
          </h2>
          <p className="text-text-tertiary text-base md:text-lg max-w-2xl mx-auto break-keep">
            실제 계약서에서 자주 발견되는 불리한 조항을 AI가 어떻게 분석하는지 확인하세요.
          </p>
        </div>

        {/* Demo UI */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Contract panel */}
          <div className="rounded-xl border border-border bg-bg-primary overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-secondary">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-text-muted/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-text-muted/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-text-muted/60" />
              </div>
              <span className="text-xs text-text-quaternary font-mono ml-2">프리랜서_개발계약서.pdf</span>
            </div>
            <div className="p-5 font-mono text-sm leading-7 min-h-[280px]">
              {contractLines.map((line, i) => (
                <div
                  key={i}
                  className={`transition-all duration-300 ${
                    line.type === "heading"
                      ? "font-semibold text-text-primary mt-2"
                      : line.type === "danger" && stage >= 1
                        ? "bg-danger-bg text-danger-text border-l-2 border-danger-border pl-2 -ml-2"
                        : "text-text-tertiary"
                  } ${stage === 0 && i <= scanLine ? "opacity-100" : stage === 0 ? "opacity-30" : "opacity-100"}`}
                >
                  {line.text || "\u00A0"}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis panel */}
          <div className="rounded-xl border border-border bg-bg-primary overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-secondary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-accent">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 4.5v3M7 9v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-xs text-text-quaternary font-mono">AI 분석 결과</span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-center min-h-[280px]">
              {stage < 2 ? (
                <div className="flex flex-col items-center justify-center text-center gap-3 text-text-quaternary">
                  <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  <span className="text-sm">{stage === 0 ? "계약서 스캔 중..." : "독소조항 2건 감지"}</span>
                </div>
              ) : (
                <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
                  <div>
                    <p className="text-xs font-medium text-danger-text mb-1">⚠ {analysis.clause}</p>
                    <p className="text-sm font-mono font-semibold text-text-primary">{analysis.risk}</p>
                  </div>
                  <div className="bg-danger-bg border border-danger-border rounded-lg p-3">
                    <p className="text-xs text-danger-text leading-relaxed">{analysis.issue}</p>
                  </div>
                  {stage >= 3 && (
                    <div className="bg-success-bg border border-success-border rounded-lg p-3 animate-[fadeIn_0.4s_ease-out]">
                      <p className="text-xs font-medium text-success-text mb-1">✓ 권장 수정안</p>
                      <p className="text-xs text-success-text leading-relaxed">&ldquo;{analysis.alternative}&rdquo;</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
