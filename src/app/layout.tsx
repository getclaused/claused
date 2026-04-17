import type { Metadata } from "next";
import { Nanum_Myeongjo, IBM_Plex_Sans_KR, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
  display: "swap",
});

const ibmPlexSansKR = IBM_Plex_Sans_KR({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans-kr",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://claused.kr"),
  title: "Claused — AI 계약서 검토 서비스 | 변호사 없이도 안전하게",
  description:
    "AI가 계약서의 독소조항을 찾아내고, 당신에게 유리한 대안 문구를 제시합니다. 변호사 상담 한 번 값으로 1년간 무제한으로.",
  keywords: [
    "AI 계약서 검토",
    "계약서 분석",
    "독소조항",
    "법률 AI",
    "계약서 리스크",
    "프리랜서 계약서",
    "NDA",
    "Claused",
  ],
  authors: [{ name: "Pie Nest Inc." }],
  creator: "Pie Nest Inc.",
  publisher: "Pie Nest Inc.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://claused.kr",
    siteName: "Claused",
    title: "Claused — AI 계약서 검토 서비스",
    description:
      "AI가 계약서의 독소조항을 찾아내고, 당신에게 유리한 대안 문구를 제시합니다.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Claused — AI 계약서 검토 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claused — AI 계약서 검토 서비스",
    description:
      "AI가 계약서의 독소조항을 찾아내고, 당신에게 유리한 대안 문구를 제시합니다.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://claused.kr",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${nanumMyeongjo.variable} ${ibmPlexSansKR.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
