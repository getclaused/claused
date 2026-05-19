import type { AnalysisResult, RiskLevel } from "@/lib/supabase/database.types";

const riskLabelKo: Record<RiskLevel, string> = {
  high: "위험",
  medium: "주의 필요",
  low: "양호",
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

export function generateAnalysisMarkdown(
  fileName: string,
  createdAt: string,
  result: AnalysisResult
): string {
  const lines: string[] = [];

  lines.push("# 계약서 분석 결과");
  lines.push("");
  lines.push(`**파일명:** ${fileName}`);
  lines.push(`**분석일시:** ${formatKstDate(createdAt)}`);
  lines.push(`**리스크 레벨:** ${riskLabelKo[result.risk_level]}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 요약");
  lines.push("");
  lines.push(result.summary);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`## 발견된 이슈 (${result.issues.length})`);
  lines.push("");

  result.issues.forEach((issue, idx) => {
    lines.push(`### ${idx + 1}. ${issue.category} — ${riskLabelKo[issue.severity]}`);
    lines.push("");
    lines.push(`> ${issue.clause_excerpt}`);
    lines.push("");
    lines.push("**문제점**");
    lines.push(issue.description);
    lines.push("");
    lines.push("**제안**");
    lines.push(issue.suggestion);
    lines.push("");
  });

  if (result.missing_clauses.length > 0) {
    lines.push("---");
    lines.push("");
    lines.push("## 누락된 조항");
    lines.push("");
    for (const clause of result.missing_clauses) {
      lines.push(`- ${clause}`);
    }
    lines.push("");
  }

  if (result.positive_points.length > 0) {
    lines.push("---");
    lines.push("");
    lines.push("## 잘 작성된 조항");
    lines.push("");
    for (const point of result.positive_points) {
      lines.push(`- ${point}`);
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

export function generateMarkdownFileName(originalFileName: string): string {
  const nameWithoutExt = originalFileName.replace(/\.pdf$/i, "");
  const sanitized = nameWithoutExt.replace(/[\/\\:*?"<>|]/g, "_");
  return `${sanitized}_분석결과.md`;
}
