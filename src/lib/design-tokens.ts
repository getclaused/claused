/**
 * Claused LegalTech Design System — Tokens
 *
 * 이 파일은 globals.css의 @theme inline 토큰과 동기화됩니다.
 * Tailwind CSS v4는 CSS 변수를 직접 참조하므로 이 파일은
 * 외부 시스템(Figma, Storybook 등)과의 연동용입니다.
 */

export const tokens = {
  color: {
    primary: {
      DEFAULT: "#0A1628",
      light: "#1A2B45",
      lighter: "#2A3F5F",
    },
    accent: {
      DEFAULT: "#2563EB",
      hover: "#1D4ED8",
      light: "#DBEAFE",
    },
    semantic: {
      danger: { bg: "#FEF2F2", border: "#FECACA", text: "#991B1B" },
      success: { bg: "#F0FDF4", border: "#BBF7D0", text: "#166534" },
      info: { bg: "#EFF6FF", border: "#BFDBFE", text: "#1E40AF" },
    },
    text: {
      primary: "#0A1628",
      secondary: "#374151",
      tertiary: "#6B7280",
      quaternary: "#9CA3AF",
      muted: "#D1D5DB",
    },
    bg: {
      primary: "#FFFFFF",
      secondary: "#F9FAFB",
      tertiary: "#F3F4F6",
    },
    border: {
      DEFAULT: "#E5E7EB",
      light: "#F3F4F6",
    },
    gold: {
      DEFAULT: "#A87D2E",
      light: "#F5F0E6",
    },
  },

  typography: {
    fontFamily: {
      heading: "Pretendard Variable",
      body: "Pretendard Variable",
      mono: "JetBrains Mono",
      serif: "Nanum Myeongjo",
    },
    scale: {
      display: { size: "48px", lineHeight: "56px", mobile: { size: "36px", lineHeight: "44px" } },
      h1: { size: "40px", lineHeight: "48px", mobile: { size: "32px", lineHeight: "40px" } },
      h2: { size: "32px", lineHeight: "40px", mobile: { size: "26px", lineHeight: "34px" } },
      h3: { size: "24px", lineHeight: "32px", mobile: { size: "20px", lineHeight: "28px" } },
      "body-lg": { size: "18px", lineHeight: "28px" },
      body: { size: "16px", lineHeight: "26px" },
      caption: { size: "14px", lineHeight: "20px" },
      small: { size: "12px", lineHeight: "16px" },
    },
  },

  spacing: {
    base: 4, // 4px base grid
    section: {
      vertical: { mobile: "80px", desktop: "112px" }, // py-20 / py-28
      horizontal: { mobile: "20px", desktop: "32px" }, // px-5 / px-8
    },
    container: {
      maxWidth: "1120px",
      narrow: "840px",
    },
    card: {
      padding: { mobile: "24px", desktop: "32px" }, // p-6 / p-8
    },
  },

  motion: {
    easing: {
      out: "cubic-bezier(0.16, 1, 0.3, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    duration: {
      fast: "150ms",
      normal: "250ms",
      slow: "400ms",
    },
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
} as const;
