export default function PricingSection() {
  return (
    <section className="px-5 py-20 md:py-28 bg-soft-bg">
      <div className="w-full max-w-[1100px] mx-auto">
        <h2 className="font-serif text-[1.625rem] md:text-[2.25rem] leading-snug font-bold text-foreground mb-6 break-keep">
          변호사 상담 한 번 = Claused 1년.
        </h2>

        <p className="text-base md:text-lg leading-relaxed text-foreground/70 max-w-2xl mb-10 md:mb-14 break-keep">
          Standard 플랜은 월 ₩19,900, 연 결제 시 ₩199,000.
          <br />
          변호사 상담 1시간이 최소 ₩200,000.
          <br />
          이게 저희가 제공하는 구조입니다.
        </p>

        {/* Early-bird offer box */}
        <div className="relative bg-white border-2 border-accent-gold/30 rounded-sm p-8 md:p-10 max-w-xl">
          {/* Badge */}
          <span className="absolute -top-3 left-8 bg-accent-gold text-white text-xs font-mono font-medium tracking-wider px-3 py-1 rounded-sm">
            EARLY BIRD
          </span>

          <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-3">
            베타 테스터 특별 혜택
          </h3>
          <p className="text-base leading-relaxed text-foreground/70 mb-6 break-keep">
            베타 테스터로 등록하면 런칭 후 6개월간 50% 할인.
          </p>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl md:text-4xl font-medium text-accent-red">
              ₩9,900
            </span>
            <span className="text-foreground/40 text-base">/ 월</span>
          </div>
          <p className="text-sm text-foreground/50 mt-2">
            <span className="line-through">₩19,900</span>
            <span className="ml-2 text-accent-red font-medium">50% OFF</span>
          </p>
        </div>
      </div>
    </section>
  );
}
