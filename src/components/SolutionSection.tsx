const features = [
  {
    marker: "◆",
    title: "계약서 리스크 스캔",
    description:
      "계약서를 업로드하면 AI가 3분 안에 독소조항을 빨간줄로 표시하고, 이 조항이 발동되면 얼마의 손해가 발생할지 구체적 숫자로 계산합니다.",
    example: '"위약금 계약금액의 10배 = ₩50,000,000" 이런 식으로요.',
  },
  {
    marker: "◆",
    title: "당신에게 유리한 문구 자동 생성",
    description:
      "독소조항마다 당신이 요구할 수 있는 수정안을 AI가 제시합니다. 상대방에게 보낼 수정 요청 이메일 초안까지 함께.",
    example: null,
  },
  {
    marker: "◆",
    title: "표준 계약서 즉시 생성",
    description:
      "프리랜서 계약, NDA, 임대차, 주주간 계약 등 50+ 템플릿을 대화형으로 생성. 당신의 상황에 맞춰 자동 커스터마이징.",
    example: null,
  },
];

export default function SolutionSection() {
  return (
    <section className="px-5 py-20 md:py-28">
      <div className="w-full max-w-[1100px] mx-auto">
        <h2 className="font-serif text-[1.625rem] md:text-[2.25rem] leading-snug font-bold text-foreground mb-12 md:mb-16">
          Claused는 이렇게 일합니다.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature) => (
            <article key={feature.title}>
              <p className="text-accent-gold text-xl mb-4" aria-hidden="true">
                {feature.marker}
              </p>
              <h3 className="font-serif text-lg md:text-xl font-bold text-foreground mb-4 break-keep">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-foreground/65 break-keep">
                {feature.description}
              </p>
              {feature.example && (
                <p className="mt-3 text-sm font-mono text-accent-red/80 break-keep">
                  {feature.example}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
