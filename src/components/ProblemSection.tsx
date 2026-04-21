import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";

const stats = [
  {
    number: "₩1.5M",
    unit: "/월",
    title: "변호사 비용의 무게",
    description: "계약서 5건 × 상담료 30만 원. 매달 150만 원이 증발합니다.",
  },
  {
    number: "71.3",
    unit: "%",
    title: "범용 AI의 할루시네이션",
    description: "법률 질문 10개 중 7개에서 부정확한 답변이 생성됩니다.",
  },
  {
    number: "×47",
    unit: "배",
    title: "분쟁 비용 vs 검토 비용",
    description: "사전 검토 비용 대비 분쟁 발생 시 평균 손실 배율입니다.",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl mb-12 md:mb-16">
          <h2 className="text-[1.75rem] md:text-[2.5rem] leading-tight font-bold text-text-primary mb-4 break-keep">
            변호사는 비싸고, ChatGPT는 위험합니다.
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-text-tertiary break-keep">
            계약서 한 장 검토에 ₩300,000. 바쁘게 일하는 당신이 매달 5건을 마주친다면
            월 ₩1,500,000이 증발합니다. 그렇다고 범용 AI에게 물어봤다가는 —
            한국 법을 모르는 AI가 엉뚱한 답을 합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-mono text-3xl md:text-4xl font-semibold text-text-primary">
                  {stat.number}
                </span>
                <span className="font-mono text-lg text-text-quaternary">
                  {stat.unit}
                </span>
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">
                {stat.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-tertiary break-keep">
                {stat.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
