"use client";

/**
 * Hero Visual — Variation A: "Annotated Document"
 *
 * Floating contract mockup with:
 * - Toxic clause highlights (red underline + badge)
 * - Alternative wording card (green) connected by line
 * - Subtle grid bg + electric blue glow
 * - CSS-only animations (scan line, pulse, fade-in)
 */

export default function HeroVisual() {
  return (
    <div className="relative w-full max-w-[520px] aspect-[4/3] select-none" aria-hidden="true">
      {/* Grid background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0v32" fill="none" stroke="#1E293B" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Electric blue ambient glow */}
      <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-[#3B82F6]/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-[#3B82F6]/5 rounded-full blur-2xl" />

      {/* Main document card — slight 3D perspective */}
      <div
        className="absolute top-8 left-6 right-12 bottom-16 bg-[#0F1D2E] border border-[#1E293B] rounded-xl shadow-2xl shadow-black/40 overflow-hidden"
        style={{ transform: "perspective(800px) rotateY(-2deg) rotateX(1deg)" }}
      >
        {/* Document header bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1E293B] bg-[#0A1628]">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]/60" />
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]/60" />
            <span className="w-2 h-2 rounded-full bg-[#22C55E]/60" />
          </div>
          <span className="text-[10px] font-mono text-[#64748B] ml-2">
            프리랜서_용역계약서_v2.pdf
          </span>
        </div>

        {/* Document content */}
        <div className="p-4 space-y-2.5 font-mono text-[11px] leading-5">
          {/* Normal line */}
          <div className="text-[#64748B]">제1조 (목적)</div>
          <div className="h-2 w-[85%] bg-[#1E293B] rounded-sm" />
          <div className="h-2 w-[70%] bg-[#1E293B] rounded-sm" />

          <div className="text-[#64748B] mt-4">제5조 (위약금)</div>

          {/* Toxic clause — highlighted */}
          <div className="relative group">
            <div className="bg-[#991B1B]/10 border-l-2 border-[#EF4444] px-2 py-1.5 rounded-r-sm">
              <span className="text-[#FCA5A5]">
                을은 계약 위반 시 계약금액의
              </span>
              <span className="text-[#FCA5A5] font-semibold underline decoration-[#EF4444] decoration-2 underline-offset-2">
                {" "}10배를 위약금으로
              </span>
              <span className="text-[#FCA5A5]"> 지급한다</span>
            </div>
            {/* Badge */}
            <span className="absolute -top-2 right-2 px-1.5 py-0.5 bg-[#991B1B] text-[8px] text-white rounded font-semibold tracking-wide animate-pulse">
              ⚠ 독소조항
            </span>
          </div>

          <div className="h-2 w-[60%] bg-[#1E293B] rounded-sm" />

          {/* Another toxic line */}
          <div className="relative">
            <div className="bg-[#991B1B]/10 border-l-2 border-[#EF4444] px-2 py-1.5 rounded-r-sm">
              <span className="text-[#FCA5A5]">
                이에 대한 이의를 제기할 수 없다
              </span>
            </div>
          </div>

          <div className="h-2 w-[75%] bg-[#1E293B] rounded-sm" />
          <div className="h-2 w-[55%] bg-[#1E293B] rounded-sm" />

          {/* Scanning line animation */}
          <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-60 animate-[scanDown_3s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Alternative wording card (green) — floating */}
      <div
        className="absolute bottom-4 right-0 w-52 bg-[#0A1628] border border-[#166534] rounded-lg p-3 shadow-lg shadow-[#22C55E]/5 animate-[fadeInUp_0.6s_ease-out_1.5s_both]"
      >
        {/* Connector line */}
        <svg className="absolute -top-8 left-6 w-px h-8" aria-hidden="true">
          <line x1="0" y1="0" x2="0" y2="32" stroke="#166534" strokeWidth="1" strokeDasharray="3 3" />
        </svg>

        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-4 h-4 rounded-full bg-[#166534]/30 flex items-center justify-center">
            <span className="text-[8px] text-[#22C55E]">✓</span>
          </span>
          <span className="text-[9px] font-semibold text-[#22C55E] tracking-wide">
            권장 수정안
          </span>
        </div>
        <p className="text-[10px] leading-4 text-[#86EFAC]">
          &ldquo;위약금은 계약금액의 30%를 초과할 수 없으며, 실제 손해액으로 한정한다.&rdquo;
        </p>
      </div>

      {/* Risk calculation badge — top right */}
      <div className="absolute top-4 right-0 bg-[#0A1628] border border-[#1E293B] rounded-lg px-3 py-2 shadow-lg animate-[fadeInUp_0.6s_ease-out_1s_both]">
        <div className="text-[9px] text-[#64748B] mb-1">예상 손해</div>
        <div className="font-mono text-sm font-semibold text-[#FCA5A5]">
          ₩50,000,000
        </div>
      </div>

    </div>
  );
}
