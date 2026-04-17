const cards = [
  {
    symbol: "₩1.5M",
    period: "/ 월",
    title: "변호사 비용의 무게",
    description: "계약서 5건 × 상담료 30만 원. 매달 150만 원이 그냥 증발합니다.",
  },
  {
    symbol: "?!",
    period: "",
    title: "ChatGPT의 한계",
    description:
      "한국 법을 모르는 AI가 엉뚱한 답을 합니다. 할루시네이션은 위험합니다.",
  },
  {
    symbol: "₩∞",
    period: "",
    title: "소송이 더 비싼 현실",
    description:
      "불리한 계약서에 사인한 뒤의 분쟁 비용은 상담료의 수십 배입니다.",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="px-5 py-20 md:py-28 bg-soft-bg">
      <div className="w-full max-w-[1100px] mx-auto">
        <h2 className="font-serif text-[1.625rem] md:text-[2.25rem] leading-snug font-bold text-foreground mb-6 max-w-2xl break-keep">
          변호사는 비싸고,
          <br />
          ChatGPT는 믿을 수 없습니다.
        </h2>

        <p className="text-base md:text-lg leading-relaxed text-foreground/70 max-w-2xl mb-12 md:mb-16 break-keep">
          계약서 한 장 검토에 변호사 상담료 ₩300,000.
          바쁘게 일하는 당신이 매달 계약서 5건을 마주친다면
          월 ₩1,500,000이 그냥 증발합니다.
          그렇다고 ChatGPT에게 물어봤다가는 — 한국 법을 모르는 AI가
          엉뚱한 답을 합니다. 그 사이에 당신은 이미 불리한 계약서에 사인했습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <article
              key={card.title}
              className="bg-white p-8 rounded-sm border border-foreground/5"
            >
              <p className="font-mono text-2xl md:text-3xl font-medium text-accent-red mb-1">
                {card.symbol}
                {card.period && (
                  <span className="text-base text-foreground/40 ml-1">
                    {card.period}
                  </span>
                )}
              </p>
              <h3 className="font-serif text-lg font-bold text-foreground mt-4 mb-3">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/60 break-keep">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
