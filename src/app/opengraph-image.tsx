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
          background: "#FFFFFF",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "serif",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "#8B0000",
            display: "flex",
          }}
        />

        {/* Logo text */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: "#A87D2E",
            letterSpacing: "0.15em",
            marginBottom: "24px",
            display: "flex",
          }}
        >
          CLAUSED
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#0F1419",
            lineHeight: 1.3,
            marginBottom: "24px",
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
            fontSize: 24,
            color: "#555",
            lineHeight: 1.6,
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
            fontSize: 18,
            color: "#999",
          }}
        >
          <span>claused.kr</span>
          <span>Pie Nest Inc. · 2026.07 런칭</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
