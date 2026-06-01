"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { getSupabaseBrowser } from "@/lib/supabase/client";

type Slot = "a" | "b";
type Status = "idle" | "uploading" | "analyzing" | "done" | "error";

interface PreparedFile {
  file: File;
  fileName: string;
  filePath: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const SESSION_KEY = "claused_session_id";

function getOrCreateSessionId(): string {
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function validateFile(file: File): string | null {
  if (file.size === 0) return "빈 파일은 업로드할 수 없습니다.";
  if (file.size > MAX_FILE_SIZE) return "파일 크기는 10MB 이하여야 합니다.";
  if (file.type !== "application/pdf") return "PDF 파일만 업로드할 수 있습니다.";
  return null;
}

interface UploadSlotProps {
  label: string;
  hint: string;
  file: File | null;
  busy: boolean;
  onPick: () => void;
  onDrop: (file: File) => void;
  onClear: () => void;
}

function UploadSlot({ label, hint, file, busy, onPick, onDrop, onClear }: UploadSlotProps) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onDrop(f);
      }}
      onClick={() => !busy && !file && onPick()}
      role="button"
      tabIndex={busy || !!file ? -1 : 0}
      onKeyDown={(e) => {
        if (!busy && !file && (e.key === "Enter" || e.key === " ")) onPick();
      }}
      aria-disabled={busy}
      className={`relative rounded-xl border-2 border-dashed transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] p-6 md:p-8 text-center ${
        busy ? "cursor-not-allowed opacity-80" : file ? "cursor-default" : "cursor-pointer"
      } ${
        dragging
          ? "border-accent bg-accent-light/40"
          : file
          ? "border-border bg-bg-secondary"
          : "border-border hover:border-accent/60 hover:bg-bg-secondary"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-text-quaternary mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-text-secondary mb-4 break-keep">{hint}</p>

      {!file && (
        <div>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-bg-tertiary">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-text-secondary">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm text-text-primary mb-1">PDF 끌어다 놓거나 클릭</p>
          <p className="text-xs text-text-tertiary">최대 10MB</p>
        </div>
      )}

      {file && (
        <div>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success-bg">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-success-text">
              <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm font-medium text-text-primary mb-1 break-all">{file.name}</p>
          <p className="text-xs text-text-tertiary mb-3">
            {(file.size / 1024).toFixed(0)} KB
          </p>
          {!busy && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-xs text-text-tertiary hover:text-text-primary underline cursor-pointer"
            >
              파일 변경
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  const router = useRouter();
  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrCreateSessionId();
  }, []);

  const busy = status === "uploading" || status === "analyzing";

  const setSlotFile = (slot: Slot, file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }
    if (slot === "a") setFileA(file);
    else setFileB(file);
    if (status === "error") setStatus("idle");
  };

  const clearSlot = (slot: Slot) => {
    if (slot === "a") setFileA(null);
    else setFileB(null);
  };

  const onPick = (slot: Slot) => {
    if (busy) return;
    (slot === "a" ? inputARef : inputBRef).current?.click();
  };

  const onFileChange = (slot: Slot) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSlotFile(slot, file);
    e.target.value = "";
  };

  const uploadFile = useCallback(
    async (file: File, sessionId: string): Promise<PreparedFile> => {
      const fileId = crypto.randomUUID();
      const filePath = `${sessionId}/${fileId}.pdf`;
      const supabase = getSupabaseBrowser();
      const { error: uploadError } = await supabase.storage
        .from("contracts")
        .upload(filePath, file, {
          contentType: "application/pdf",
          upsert: false,
        });
      if (uploadError) throw new Error(uploadError.message);
      return { file, fileName: file.name, filePath };
    },
    []
  );

  const handleStart = async () => {
    if (!fileA || !fileB) return;
    setError(null);
    setStatus("uploading");

    try {
      const sessionId = getOrCreateSessionId();
      const [preparedA, preparedB] = await Promise.all([
        uploadFile(fileA, sessionId),
        uploadFile(fileB, sessionId),
      ]);

      setStatus("analyzing");

      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_path_a: preparedA.filePath,
          file_path_b: preparedB.filePath,
          session_id: sessionId,
          file_name_a: preparedA.fileName,
          file_name_b: preparedB.fileName,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "비교 분석 중 오류가 발생했습니다." }));
        throw new Error(body.error || "비교 분석 중 오류가 발생했습니다.");
      }

      const { id } = await res.json();
      setStatus("done");
      router.push(`/compare/${id}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "비교 분석에 실패했습니다.";
      setError(message);
      setStatus("error");
    }
  };

  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <Container narrow>
          <h1 className="text-[2rem] leading-[1.2] md:text-[2.5rem] md:leading-[1.15] font-bold tracking-tight text-text-primary mb-4 break-keep">
            계약서 비교
          </h1>
          <p className="text-base md:text-lg text-text-tertiary mb-10 break-keep">
            두 개의 계약서를 비교하여 변경점과 위험 변화를 분석합니다.
          </p>

          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <UploadSlot
              label="A"
              hint="받은 초안"
              file={fileA}
              busy={busy}
              onPick={() => onPick("a")}
              onDrop={(f) => setSlotFile("a", f)}
              onClear={() => clearSlot("a")}
            />
            <UploadSlot
              label="B"
              hint="협상 후 수정본"
              file={fileB}
              busy={busy}
              onPick={() => onPick("b")}
              onDrop={(f) => setSlotFile("b", f)}
              onClear={() => clearSlot("b")}
            />
          </div>

          <input
            ref={inputARef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={onFileChange("a")}
            disabled={busy}
          />
          <input
            ref={inputBRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={onFileChange("b")}
            disabled={busy}
          />

          {status === "error" && error && (
            <div className="mb-6 rounded-lg border border-danger-border bg-danger-bg p-4 text-sm text-danger-text break-keep">
              {error}
            </div>
          )}

          {(status === "uploading" || status === "analyzing") && (
            <div className="mb-6 rounded-xl border border-border bg-bg-secondary p-6 text-center">
              <div className="mx-auto mb-3 h-10 w-10 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
              <p className="text-sm md:text-base font-medium text-text-primary mb-1">
                {status === "uploading"
                  ? "두 파일을 업로드하는 중..."
                  : "AI 가 두 계약서를 비교하고 있습니다..."}
              </p>
              <p className="text-xs md:text-sm text-text-tertiary break-keep">
                {status === "analyzing"
                  ? "최대 2~3분 소요될 수 있습니다. 스캔 PDF 인 경우 OCR 처리에 추가 시간이 필요합니다."
                  : null}
              </p>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              type="button"
              size="lg"
              disabled={!fileA || !fileB || busy}
              onClick={handleStart}
            >
              {busy ? "분석 중..." : "비교 분석 시작"}
            </Button>
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
