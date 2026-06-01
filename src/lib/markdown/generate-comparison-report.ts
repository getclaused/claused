import type {
  ChangeType,
  ComparisonResult,
  NegotiationOutcome,
  RiskChange,
} from "@/lib/supabase/database.types";

const outcomeLabelKo: Record<NegotiationOutcome, string> = {
  favorable: "유리함",
  neutral: "변화 없음",
  unfavorable: "불리함",
};

const changeTypeLabelKo: Record<ChangeType, string> = {
  modified: "변경",
  added: "추가",
  removed: "삭제",
};

const riskChangeLabelKo: Record<RiskChange, string> = {
  increased: "증가 ↑",
  decreased: "감소 ↓",
  unchanged: "동일 →",
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

export function generateComparisonMarkdown(
  fileNameA: string,
  fileNameB: string,
  createdAt: string,
  result: ComparisonResult
): string {
  const lines: string[] = [];

  lines.push("# 계약서 비교 분석 결과");
  lines.push("");
  lines.push(`**A (받은 초안):** ${fileNameA}`);
  lines.push(`**B (협상 후 수정본):** ${fileNameB}`);
  lines.push(`**분석일시:** ${formatKstDate(createdAt)}`);
  lines.push(`**협상 성과:** ${outcomeLabelKo[result.negotiation_outcome]}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 요약");
  lines.push("");
  lines.push(result.summary);
  lines.push("");
  lines.push(`**평가 이유:** ${result.outcome_reason}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`## 변경점 (${result.changes.length})`);
  lines.push("");

  result.changes.forEach((change, idx) => {
    lines.push(
      `### ${idx + 1}. ${change.category} — ${changeTypeLabelKo[change.change_type]} / 위험 ${riskChangeLabelKo[change.risk_change]}`
    );
    lines.push("");

    if (change.before && change.change_type !== "added") {
      lines.push("**이전 (A)**");
      lines.push(`> ${change.before}`);
      lines.push("");
    }

    if (change.after && change.change_type !== "removed") {
      lines.push("**이후 (B)**");
      lines.push(`> ${change.after}`);
      lines.push("");
    }

    lines.push("**영향**");
    lines.push(change.impact);
    lines.push("");
    lines.push("**제안**");
    lines.push(change.recommendation);
    lines.push("");
  });

  if (result.remaining_concerns.length > 0) {
    lines.push("---");
    lines.push("");
    lines.push("## 남은 우려 사항");
    lines.push("");
    for (const concern of result.remaining_concerns) {
      lines.push(`- ${concern}`);
    }
    lines.push("");
  }

  if (result.successful_negotiations.length > 0) {
    lines.push("---");
    lines.push("");
    lines.push("## 성공적으로 개선된 조항");
    lines.push("");
    for (const success of result.successful_negotiations) {
      lines.push(`- ${success}`);
    }
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push("*본 분석은 Claused AI 에 의해 생성되었습니다. 법률 자문이 아닌 참고 자료로 활용하시기 바랍니다.*");
  lines.push("*claused.kr*");
  lines.push("");

  return lines.join("\n");
}

export function generateComparisonMarkdownFileName(
  fileNameA: string,
  fileNameB: string
): string {
  const stripExt = (n: string) => n.replace(/\.pdf$/i, "");
  const sanitize = (n: string) => n.replace(/[\/\\:*?"<>|]/g, "_");
  return `${sanitize(stripExt(fileNameA))}_vs_${sanitize(stripExt(fileNameB))}_비교결과.md`;
}
