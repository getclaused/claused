"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";

const faqs = [
  {
    q: "Claused의 법률 분석은 법적 효력이 있나요?",
    a: "Claused는 법률 자문을 대체하지 않습니다. AI가 제시하는 분석은 참고 자료이며, 중대한 법적 사안은 반드시 변호사 상담을 권장합니다. 다만, 2026년 3월 대법원이 AI 법률문서 자동작성의 적법성을 확인한 바 있습니다.",
  },
  {
    q: "내 계약서 데이터는 안전한가요?",
    a: "업로드된 계약서는 분석 완료 후 24시간 내 완전 삭제됩니다. AI 모델 학습에도 사용되지 않으며, CISO 출신 파운더가 설계한 보안 아키텍처를 적용합니다.",
  },
  {
    q: "어떤 종류의 계약서를 분석할 수 있나요?",
    a: "프리랜서 용역 계약, NDA, 임대차 계약, 주주간 계약, 투자 계약, 파트너십 계약 등 한국법 기반의 모든 계약서를 분석합니다. PDF, DOCX, 이미지(OCR) 형식을 지원합니다.",
  },
  {
    q: "베타 테스터 혜택은 정확히 무엇인가요?",
    a: "런칭 후 6개월간 정가 대비 50% 할인 (월 ₩9,900), 파운더 직접 1:1 피드백 세션, 그리고 향후 출시되는 모든 신규 기능에 우선 접근권이 제공됩니다.",
  },
  {
    q: "해외 계약서도 분석 가능한가요?",
    a: "런칭 시점에는 한국법 기반 계약서에 집중합니다. 영문 계약서 분석은 2026년 하반기 업데이트로 지원 예정입니다.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28 border-t border-[#1E293B]">
      <Container narrow>
        <h2 className="text-[1.75rem] md:text-[2.5rem] leading-tight font-bold text-white mb-12 text-center break-keep">
          자주 묻는 질문
        </h2>

        <div className="divide-y divide-[#1E293B]">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 py-5 text-left cursor-pointer group"
                aria-expanded={openIndex === i}
              >
                <span className="text-base font-medium text-[#F5F7FA] group-hover:text-accent transition-colors break-keep">
                  {faq.q}
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`flex-shrink-0 text-[#A1A9B8] transition-transform duration-[var(--duration-normal)] ${openIndex === i ? "rotate-180" : ""}`}
                >
                  <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] ${
                  openIndex === i ? "max-h-96 pb-5" : "max-h-0"
                }`}
              >
                <p className="text-sm leading-relaxed text-[#C0C7D1] break-keep">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
