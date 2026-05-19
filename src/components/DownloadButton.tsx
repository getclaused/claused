"use client";

import {
  generateAnalysisMarkdown,
  generateMarkdownFileName,
} from "@/lib/markdown/generate-report";
import type { AnalysisResult } from "@/lib/supabase/database.types";

interface DownloadButtonProps {
  fileName: string;
  createdAt: string;
  result: AnalysisResult;
  className?: string;
}

export default function DownloadButton({
  fileName,
  createdAt,
  result,
  className = "",
}: DownloadButtonProps) {
  const handleDownload = () => {
    const markdown = generateAnalysisMarkdown(fileName, createdAt, result);
    const downloadFileName = generateMarkdownFileName(fileName);

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className={`inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium rounded-lg border border-border bg-bg-primary text-text-primary hover:border-text-quaternary hover:bg-bg-secondary transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] cursor-pointer ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M3 13h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      분석 결과 다운로드
    </button>
  );
}
