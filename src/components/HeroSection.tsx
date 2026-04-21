"use client";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import HeroVisual from "@/components/HeroVisual";

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary/50 to-bg-primary pointer-events-none" />

      <Container className="relative">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          {/* Left — Copy */}
          <div className="flex-1 max-w-2xl">
            {/* Status badge */}
            <Badge variant="info" className="mb-6">
              2026.06 런칭 예정 · 얼리버드 50% 할인
            </Badge>

            {/* Headline */}
            <h1 className="text-[2.25rem] leading-[1.2] md:text-[3.5rem] md:leading-[1.15] font-bold tracking-tight text-text-primary mb-6 break-keep">
              당신의 계약서,
              <br />
              <span className="text-accent">변호사 없이도</span> 안전하게.
            </h1>

            {/* Sub copy */}
            <p className="text-lg md:text-xl leading-relaxed text-text-tertiary max-w-xl mb-10 break-keep">
              AI가 계약서의 독소조항을 찾아내고,
              당신에게 유리한 대안 문구를 제시합니다.
              변호사 상담 한 번 값으로 1년간 무제한.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Button size="lg" onClick={() => scrollTo("waitlist")}>
                베타 테스터 신청하기
              </Button>
              <Button variant="secondary" size="lg" onClick={() => scrollTo("demo")}>
                라이브 데모 보기
              </Button>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-quaternary">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-success-text"><path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                CISO 출신 파운더
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-success-text"><path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                변호사 자문 검수
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-success-text"><path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                데이터 AI 학습 미사용
              </span>
            </div>
          </div>

          {/* Right — Visual asset */}
          <div className="hidden lg:flex flex-1 justify-center mt-0">
            <HeroVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}
