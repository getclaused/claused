import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  getAnthropicClient,
  CLAUDE_MODEL,
  COMPARISON_SYSTEM_PROMPT,
} from "@/lib/anthropic/client";
import { extractPdfText, OcrFailedError } from "@/lib/pdf/extract";
import type {
  ComparisonResult,
  NegotiationOutcome,
  ChangeType,
  RiskChange,
} from "@/lib/supabase/database.types";

export const runtime = "nodejs";
export const maxDuration = 120;

const requestSchema = z.object({
  file_path_a: z.string().min(1),
  file_path_b: z.string().min(1),
  session_id: z.string().min(1),
  file_name_a: z.string().min(1),
  file_name_b: z.string().min(1),
});

const MIN_TEXT_LENGTH = 100;
const MAX_TEXT_LENGTH = 40_000;

function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fenced) return fenced[1].trim();
  return trimmed;
}

function extractJsonObject(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object boundaries found");
  }
  return text.slice(start, end + 1);
}

function isOutcome(value: unknown): value is NegotiationOutcome {
  return value === "favorable" || value === "neutral" || value === "unfavorable";
}

function isChangeType(value: unknown): value is ChangeType {
  return value === "modified" || value === "added" || value === "removed";
}

function isRiskChange(value: unknown): value is RiskChange {
  return value === "increased" || value === "decreased" || value === "unchanged";
}

function isValidResult(value: unknown): value is ComparisonResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.summary !== "string") return false;
  if (!isOutcome(v.negotiation_outcome)) return false;
  if (typeof v.outcome_reason !== "string") return false;
  if (!Array.isArray(v.changes)) return false;
  for (const change of v.changes) {
    if (!change || typeof change !== "object") return false;
    const c = change as Record<string, unknown>;
    if (typeof c.category !== "string") return false;
    if (!isChangeType(c.change_type)) return false;
    if (!isRiskChange(c.risk_change)) return false;
    if (typeof c.impact !== "string") return false;
    if (typeof c.recommendation !== "string") return false;
  }
  if (!Array.isArray(v.remaining_concerns)) return false;
  if (!Array.isArray(v.successful_negotiations)) return false;
  return true;
}

async function downloadAndExtract(
  filePath: string
): Promise<{ text: string; error?: string }> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.from("contracts").download(filePath);
  if (error || !data) {
    return { text: "", error: "업로드된 파일을 찾을 수 없습니다." };
  }
  try {
    const buffer = await data.arrayBuffer();
    const text = await extractPdfText(buffer);
    if (text.trim().length < MIN_TEXT_LENGTH) {
      return { text: "", error: "PDF 에서 충분한 텍스트를 추출하지 못했습니다." };
    }
    return { text: text.slice(0, MAX_TEXT_LENGTH) };
  } catch (e) {
    if (e instanceof OcrFailedError) {
      return {
        text: "",
        error: "OCR 도 실패했습니다. PDF 가 손상되었거나 텍스트가 없습니다.",
      };
    }
    console.error("PDF extract error:", e);
    return { text: "", error: "PDF 텍스트 추출에 실패했습니다." };
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "필수 정보가 누락되었습니다." },
      { status: 400 }
    );
  }

  const { file_path_a, file_path_b, session_id, file_name_a, file_name_b } = parsed.data;

  // 1. Extract both PDFs
  const [extractedA, extractedB] = await Promise.all([
    downloadAndExtract(file_path_a),
    downloadAndExtract(file_path_b),
  ]);

  if (extractedA.error) {
    return NextResponse.json({ error: `A 파일: ${extractedA.error}` }, { status: 422 });
  }
  if (extractedB.error) {
    return NextResponse.json({ error: `B 파일: ${extractedB.error}` }, { status: 422 });
  }

  // 2. Single Claude call with both texts
  let rawText: string;
  let stopReason: string | null = null;
  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 16384,
      system: COMPARISON_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `다음 두 계약서를 비교 분석해주세요.\n\n===== A. 받은 초안 (파일: ${file_name_a}) =====\n${extractedA.text}\n\n===== B. 협상 후 수정본 (파일: ${file_name_b}) =====\n${extractedB.text}`,
        },
      ],
    });

    stopReason = message.stop_reason;
    rawText = message.content
      .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    if (!rawText) {
      throw new Error("Unexpected Claude response shape: no text block");
    }
  } catch (e) {
    console.error("Claude API error:", e);
    return NextResponse.json(
      { error: "AI 비교 분석 호출에 실패했습니다." },
      { status: 502 }
    );
  }

  // 3. Parse JSON
  let result: ComparisonResult;
  try {
    const cleaned = stripJsonFences(rawText);
    const jsonBody = extractJsonObject(cleaned);
    const parsedJson: unknown = JSON.parse(jsonBody);
    if (!isValidResult(parsedJson)) {
      throw new Error("Result shape mismatch");
    }
    result = parsedJson;
  } catch (e) {
    console.error(
      "Claude JSON parse error:", e,
      "stop_reason:", stopReason,
      "raw(500):", rawText.slice(0, 500)
    );
    const userMessage =
      stopReason === "max_tokens"
        ? "계약서가 너무 길어 분석이 중단되었습니다. 더 짧은 문서로 다시 시도해 주세요."
        : "AI 응답을 해석하지 못했습니다.";
    return NextResponse.json({ error: userMessage }, { status: 500 });
  }

  // 4. Save to DB
  const supabase = getSupabaseAdmin();
  const { data: inserted, error: insertError } = await supabase
    .from("comparisons")
    .insert({
      session_id,
      file_name_a,
      file_name_b,
      file_path_a,
      file_path_b,
      result,
      status: "completed",
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("Comparisons insert error:", insertError);
    return NextResponse.json(
      { error: "비교 분석 결과 저장에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: inserted.id });
}
