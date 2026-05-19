import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAnthropicClient, CLAUDE_MODEL, SYSTEM_PROMPT } from "@/lib/anthropic/client";
import { extractPdfText } from "@/lib/pdf/extract";
import type { AnalysisResult, RiskLevel } from "@/lib/supabase/database.types";

export const runtime = "nodejs";
export const maxDuration = 120;

const requestSchema = z.object({
  file_path: z.string().min(1),
  session_id: z.string().min(1),
  file_name: z.string().min(1),
});

const MIN_TEXT_LENGTH = 100;
const MAX_TEXT_LENGTH = 80_000;

function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fenced) return fenced[1].trim();
  return trimmed;
}

function isValidRiskLevel(value: unknown): value is RiskLevel {
  return value === "high" || value === "medium" || value === "low";
}

function isValidResult(value: unknown): value is AnalysisResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.summary !== "string") return false;
  if (!isValidRiskLevel(v.risk_level)) return false;
  if (!Array.isArray(v.issues)) return false;
  if (!Array.isArray(v.missing_clauses)) return false;
  if (!Array.isArray(v.positive_points)) return false;
  return true;
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

  const { file_path, session_id, file_name } = parsed.data;
  const supabase = getSupabaseAdmin();

  // 1. Download PDF
  const { data: fileBlob, error: dlError } = await supabase.storage
    .from("contracts")
    .download(file_path);

  if (dlError || !fileBlob) {
    console.error("PDF download error:", dlError);
    return NextResponse.json(
      { error: "업로드된 파일을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  // 2. Extract text
  let text: string;
  try {
    const buffer = await fileBlob.arrayBuffer();
    text = await extractPdfText(buffer);
  } catch (e) {
    console.error("PDF extract error:", e);
    return NextResponse.json(
      { error: "PDF 텍스트 추출에 실패했습니다." },
      { status: 422 }
    );
  }

  if (text.trim().length < MIN_TEXT_LENGTH) {
    return NextResponse.json(
      { error: "스캔된 PDF 로 보입니다. OCR 처리가 필요합니다." },
      { status: 422 }
    );
  }

  const truncated = text.slice(0, MAX_TEXT_LENGTH);

  // 3. Call Claude API
  let rawText: string;
  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `다음 계약서를 분석해주세요:\n\n${truncated}`,
        },
      ],
    });

    const firstBlock = message.content[0];
    if (!firstBlock || firstBlock.type !== "text") {
      throw new Error("Unexpected Claude response shape");
    }
    rawText = firstBlock.text;
  } catch (e) {
    console.error("Claude API error:", e);
    return NextResponse.json(
      { error: "AI 분석 호출에 실패했습니다." },
      { status: 502 }
    );
  }

  // 4. Parse JSON
  let result: AnalysisResult;
  try {
    const cleaned = stripJsonFences(rawText);
    const parsedJson: unknown = JSON.parse(cleaned);
    if (!isValidResult(parsedJson)) {
      throw new Error("Result shape mismatch");
    }
    result = parsedJson;
  } catch (e) {
    console.error("Claude JSON parse error:", e, "raw:", rawText);
    return NextResponse.json(
      { error: "AI 응답을 해석하지 못했습니다." },
      { status: 500 }
    );
  }

  // 5. Save to DB
  const { data: inserted, error: insertError } = await supabase
    .from("analyses")
    .insert({
      session_id,
      file_name,
      file_path,
      risk_level: result.risk_level,
      result,
      status: "completed",
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("Analyses insert error:", insertError);
    return NextResponse.json(
      { error: "분석 결과 저장에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: inserted.id });
}
