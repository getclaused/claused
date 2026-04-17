const checklist = [
  "변호사 2인 자문위원 정기 검수",
  "CISO 출신 파운더의 개인정보 보안 설계",
  "계약서 24시간 자동 삭제 옵션",
  "업로드 데이터는 AI 학습에 사용하지 않음",
];

export default function TrustSection() {
  return (
    <section className="px-5 py-20 md:py-28">
      <div className="w-full max-w-[1100px] mx-auto">
        <h2 className="font-serif text-[1.625rem] md:text-[2.25rem] leading-snug font-bold text-foreground mb-6 break-keep">
          합법적이고, 안전하게 설계됐습니다.
        </h2>

        <p className="text-base md:text-lg leading-relaxed text-foreground/70 max-w-2xl mb-10 md:mb-14 break-keep">
          2026년 3월 대법원이 AI 법률문서 자동작성의 적법성을 최종 확인했습니다.
          Claused는 변호사를 대체하는 서비스가 아니라
          변호사 상담 이전 단계의 안전장치입니다.
          중대 사안은 반드시 변호사 상담을 권유합니다.
        </p>

        <ul className="space-y-4 max-w-xl" role="list">
          {checklist.map((item) => (
            <li key={item} className="flex items-start gap-4">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center text-sm font-bold mt-0.5"
                aria-hidden="true"
              >
                ✓
              </span>
              <span className="text-base md:text-lg text-foreground/80 break-keep">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
