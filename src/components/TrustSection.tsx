import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";

const trustItems = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2l2.09 4.26L17 7.27l-3.5 3.41.82 4.82L10 13.27 5.68 15.5l.82-4.82L3 7.27l4.91-1.01L10 2z" />
      </svg>
    ),
    title: "변호사 2인 자문위원",
    description: "정기 검수 체계로 AI 분석 품질을 법률 전문가가 보증합니다.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="14" height="10" rx="2" />
        <path d="M7 8V5a3 3 0 016 0v3" />
      </svg>
    ),
    title: "CISO 출신 파운더",
    description: "보안 아키텍처 설계부터 개인정보 처리까지 전문 역량으로 운영합니다.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7" />
        <path d="M10 6v4l2.5 2.5" />
      </svg>
    ),
    title: "24시간 자동 삭제",
    description: "계약서 업로드 데이터는 분석 완료 후 24시간 내 완전 삭제됩니다.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 17a7 7 0 100-14 7 7 0 000 14zM5 5l10 10" />
      </svg>
    ),
    title: "AI 학습 미사용",
    description: "업로드 데이터는 모델 학습에 절대 사용되지 않습니다.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 md:py-28 bg-bg-secondary">
      <Container>
        <div className="max-w-2xl mb-12">
          <h2 className="text-[1.75rem] md:text-[2.5rem] leading-tight font-bold text-text-primary mb-4 break-keep">
            합법적이고, 안전하게 설계됐습니다.
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-text-tertiary break-keep">
            2026년 3월 대법원이 AI 법률문서 자동작성의 적법성을 최종 확인했습니다.
            Claused는 변호사를 대체하지 않으며, 상담 이전 단계의 안전장치입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {trustItems.map((item) => (
            <Card key={item.title} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-primary mb-1">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-tertiary break-keep">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
