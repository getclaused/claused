"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { getSupabaseBrowser } from "@/lib/supabase/client";

type Status = "idle" | "uploading" | "analyzing" | "done" | "error";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SESSION_KEY = "claused_session_id";

function getOrCreateSessionId(): string {
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export default function AnalyzePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    getOrCreateSessionId();
  }, []);

  const validateFile = (file: File): string | null => {
    if (file.size === 0) return "빈 파일은 업로드할 수 없습니다.";
    if (file.size > MAX_FILE_SIZE) return "파일 크기는 10MB 이하여야 합니다.";
    if (file.type !== "application/pdf") return "PDF 파일만 업로드할 수 있습니다.";
    return null;
  };

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setStatus("error");
        return;
      }

      setFileName(file.name);
      setStatus("uploading");

      try {
        const sessionId = getOrCreateSessionId();
        const fileId = crypto.randomUUID();
        const filePath = `${sessionId}/${fileId}.pdf`;

        const supabase = getSupabaseBrowser();
        const { error: uploadError } = await supabase.storage
          .from("contracts")
          .upload(filePath, file, {
            contentType: "application/pdf",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        setStatus("analyzing");

        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file_path: filePath,
            session_id: sessionId,
            file_name: file.name,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: "분석 중 오류가 발생했습니다." }));
          throw new Error(body.error || "분석 중 오류가 발생했습니다.");
        }

        const { id } = await res.json();
        setStatus("done");
        router.push(`/analyze/${id}`);
      } catch (e) {
        const message = e instanceof Error ? e.message : "업로드 중 오류가 발생했습니다.";
        setError(message);
        setStatus("error");
      }
    },
    [router]
  );

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onPickFile = () => {
    if (status === "uploading" || status === "analyzing") return;
    inputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = "";
  };

  const reset = () => {
    setStatus("idle");
    setError(null);
    setFileName(null);
  };

  const busy = status === "uploading" || status === "analyzing";

  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <Container narrow>
          <h1 className="text-[2rem] leading-[1.2] md:text-[2.5rem] md:leading-[1.15] font-bold tracking-tight text-text-primary mb-4 break-keep">
            계약서 검토
          </h1>
          <p className="text-base md:text-lg text-text-tertiary mb-10 break-keep">
            PDF 파일을 업로드하면 AI 가 위험 조항을 분석합니다.
          </p>

          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={onPickFile}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !busy) onPickFile();
            }}
            aria-disabled={busy}
            className={`relative rounded-xl border-2 border-dashed transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] p-10 md:p-16 text-center ${
              busy ? "cursor-not-allowed opacity-80" : "cursor-pointer"
            } ${
              isDragging
                ? "border-accent bg-accent-light/40"
                : "border-border hover:border-accent/60 hover:bg-bg-secondary"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={onFileChange}
              disabled={busy}
            />

            {status === "idle" && (
              <div>
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-bg-tertiary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-text-secondary">
                    <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-base md:text-lg font-medium text-text-primary mb-2">
                  PDF 파일을 끌어다 놓거나 클릭하세요
                </p>
                <p className="text-sm text-text-tertiary">
                  최대 10MB · PDF 파일만 지원
                </p>
              </div>
            )}

            {(status === "uploading" || status === "analyzing") && (
              <div>
                <div className="mx-auto mb-5 h-14 w-14 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
                <p className="text-base md:text-lg font-medium text-text-primary mb-2">
                  {status === "uploading" ? "파일을 업로드하는 중..." : "AI 가 계약서를 검토하고 있습니다..."}
                </p>
                <p className="text-sm text-text-tertiary">
                  {status === "analyzing"
                    ? "약 1분 소요됩니다. 잠시만 기다려 주세요."
                    : fileName}
                </p>
              </div>
            )}

            {status === "error" && (
              <div>
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-danger-bg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-danger-text">
                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-base md:text-lg font-medium text-text-primary mb-2">
                  업로드 실패
                </p>
                <p className="text-sm text-danger-text mb-5 break-keep">{error}</p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                >
                  다시 시도
                </Button>
              </div>
            )}
          </div>

          <p className="mt-6 text-xs text-text-quaternary text-center break-keep">
            업로드된 파일은 분석 목적으로만 사용되며, AI 학습에 사용되지 않습니다.
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
