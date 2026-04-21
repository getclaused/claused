import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
    title: "계약서 리스크 스캔",
    description:
      "계약서를 업로드하면 AI가 3분 안에 독소조항을 식별하고, 조항 발동 시 예상 손해를 구체적 숫자로 산출합니다.",
    detail: "위약금 계약금액의 10배 = ₩50,000,000",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "유리한 문구 자동 생성",
    description:
      "독소조항마다 수정안을 AI가 제시합니다. 상대방에게 보낼 수정 요청 이메일 초안까지 함께 생성합니다.",
    detail: null,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "표준 계약서 즉시 생성",
    description:
      "프리랜서 계약, NDA, 임대차, 주주간 계약 등 50+ 템플릿을 대화형으로 생성합니다.",
    detail: null,
  },
];

const steps = [
  { step: "01", label: "계약서 업로드", sub: "PDF, DOCX, 이미지" },
  { step: "02", label: "AI 분석 (3분)", sub: "독소조항 탐지 + 리스크 산출" },
  { step: "03", label: "수정안 확인", sub: "대안 문구 + 이메일 초안" },
];

export default function SolutionSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-bg-secondary">
      <Container>
        {/* Features */}
        <div className="mb-20 md:mb-28">
          <div className="max-w-2xl mb-12">
            <Badge className="mb-4">기능</Badge>
            <h2 className="text-[1.75rem] md:text-[2.5rem] leading-tight font-bold text-text-primary mb-4 break-keep">
              Claused는 이렇게 일합니다.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title}>
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3 break-keep">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-tertiary break-keep">
                  {feature.description}
                </p>
                {feature.detail && (
                  <p className="mt-3 text-sm font-mono text-accent px-3 py-2 bg-accent/5 rounded-md">
                    {feature.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-8">
            3단계로 끝나는 계약서 검토
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((item, i) => (
              <div key={item.step} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-white text-sm font-semibold flex items-center justify-center">
                  {item.step}
                </span>
                <div>
                  <p className="font-semibold text-text-primary">{item.label}</p>
                  <p className="text-sm text-text-tertiary mt-1">{item.sub}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
