import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Claused — AI 계약서 검토 서비스";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A1628",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "#2563EB",
            display: "flex",
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#60A5FA",
            letterSpacing: "0.08em",
            marginBottom: "32px",
            display: "flex",
          }}
        >
          CLAUSED
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#F9FAFB",
            lineHeight: 1.25,
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>당신의 계약서,</span>
          <span>변호사 없이도 안전하게.</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: "#9CA3AF",
            lineHeight: 1.5,
            display: "flex",
          }}
        >
          AI가 계약서의 독소조항을 찾아내고, 유리한 대안을 제시합니다.
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 16,
            color: "#6B7280",
          }}
        >
          <span>claused.kr</span>
          <span>Pie Nest Inc. · 2026.06 런칭</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
