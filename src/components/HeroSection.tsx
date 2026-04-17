"use client";

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-5 py-20 md:py-32">
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-accent-red" />

      <div className="w-full max-w-[1100px] mx-auto">
        {/* Logo */}
        <p className="font-mono text-sm tracking-[0.2em] text-accent-gold mb-10 md:mb-14">
          CLAUSED
        </p>

        {/* Headline */}
        <h1 className="font-serif text-[2rem] leading-[1.4] md:text-[3.25rem] md:leading-[1.35] font-bold text-foreground mb-6 md:mb-8 max-w-2xl break-keep">
          당신의 계약서,
          <br />
          변호사 없이도 안전하게.
        </h1>

        {/* Sub copy */}
        <p className="text-base md:text-lg leading-relaxed text-foreground/70 max-w-xl mb-10 md:mb-12 break-keep">
          AI가 계약서의 독소조항을 찾아내고,
          <br className="hidden md:block" />
          당신에게 유리한 대안 문구를 제시합니다.
          <br className="hidden md:block" />
          변호사 상담 한 번 값으로 1년간 무제한으로.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-14 md:mb-20">
          <button
            onClick={() => scrollTo("waitlist")}
            className="inline-flex items-center justify-center h-13 px-8 bg-accent-red text-white font-medium text-base rounded-sm hover:bg-accent-red/90 transition-colors cursor-pointer"
          >
            베타 테스터 신청하기 →
          </button>
          <button
            onClick={() => scrollTo("problem")}
            className="inline-flex items-center justify-center h-13 px-8 border border-foreground/15 text-foreground font-medium text-base rounded-sm hover:border-foreground/30 transition-colors cursor-pointer"
          >
            어떤 서비스인가요? ↓
          </button>
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/50">
          <span>2026.07 런칭 예정</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span>얼리버드 50% 할인</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span>CISO 출신 파운더</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span>변호사 자문 검수</span>
        </div>
      </div>
    </section>
  );
}
