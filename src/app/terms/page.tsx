import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "이용약관",
  description: "Claused 서비스 이용약관",
};

const sections = [
  {
    id: "purpose",
    title: "제1조 (목적)",
    content:
      "이 약관은 파이네스트 주식회사(이하 \"회사\")가 제공하는 Claused 서비스(이하 \"서비스\")의 이용 조건 및 절차, 회사와 이용자의 권리·의무·책임사항을 규정함을 목적으로 합니다.",
  },
  {
    id: "definitions",
    title: "제2조 (정의)",
    content: `① "서비스"란 회사가 제공하는 AI 기반 계약서 검토·분석·생성 서비스를 의미합니다.\n② "이용자"란 이 약관에 따라 서비스를 이용하는 자를 의미합니다.\n③ "계약서 데이터"란 이용자가 분석을 위해 업로드하는 계약서 파일 및 그 내용을 의미합니다.\n④ "분석 결과"란 서비스가 생성한 리스크 분석, 수정안, 표준 계약서 초안을 의미합니다.`,
  },
  {
    id: "agreement",
    title: "제3조 (약관의 효력 및 변경)",
    content:
      "① 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.\n② 회사는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위에서 이 약관을 변경할 수 있으며, 변경 시 적용일자 및 변경사유를 명시하여 7일 전 공지합니다.\n③ 변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단할 수 있습니다.",
  },
  {
    id: "registration",
    title: "제4조 (서비스 이용 신청 및 계약)",
    content:
      "① 이용자는 회사가 정한 양식에 따라 이메일 주소 등 정보를 기입하여 서비스 이용을 신청합니다.\n② 회사는 다음 각 호에 해당하는 경우 이용 신청을 거부할 수 있습니다.\n  1. 허위 정보를 기재한 경우\n  2. 기술상 서비스 제공이 불가능한 경우\n  3. 기타 회사가 정한 이용 요건을 충족하지 못하는 경우",
  },
  {
    id: "service-scope",
    title: "제5조 (서비스 내용 및 제한)",
    content:
      "① 서비스는 AI 기반 계약서 리스크 분석, 수정안 제시, 표준 계약서 생성 기능을 제공합니다.\n② 서비스의 분석 결과는 참고 자료로서의 성격을 가지며, 법률 자문을 대체하지 않습니다.\n③ 중대한 법적 사안에 대해서는 반드시 변호사 상담을 권장합니다.\n④ 회사는 서비스 개선, 시스템 점검 등의 사유로 서비스를 일시 중단할 수 있으며, 사전 공지합니다.",
  },
  {
    id: "data-handling",
    title: "제6조 (계약서 데이터 처리)",
    content:
      "① 이용자가 업로드한 계약서 데이터는 분석 목적으로만 사용됩니다.\n② 계약서 데이터는 분석 완료 후 24시간 내 완전 삭제됩니다 (이용자 설정에 따라 즉시 삭제 가능).\n③ 계약서 데이터는 AI 모델 학습에 사용되지 않습니다.\n④ 계약서 데이터의 전송 및 저장 시 업계 표준 암호화(TLS 1.3, AES-256)를 적용합니다.",
  },
  {
    id: "payment",
    title: "제7조 (요금 및 결제)",
    content:
      "① 서비스 요금은 회사가 별도로 정한 요금표에 따릅니다.\n② 결제는 월간 또는 연간 단위로 이루어지며, 자동 갱신됩니다.\n③ 이용자는 갱신일 최소 3일 전까지 해지를 요청할 수 있습니다.\n④ 환불은 관련 법령 및 회사 환불 정책에 따릅니다.",
  },
  {
    id: "liability",
    title: "제8조 (책임의 제한)",
    content:
      "① 회사는 서비스 분석 결과의 정확성을 보증하지 않으며, 분석 결과에 기반한 이용자의 의사결정에 대해 책임을 지지 않습니다.\n② 천재지변, 전쟁, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 회사는 책임을 지지 않습니다.\n③ 이용자가 서비스를 통해 얻은 정보로 인해 발생한 손해에 대해 회사는 고의 또는 중과실이 없는 한 책임을 지지 않습니다.",
  },
  {
    id: "termination",
    title: "제9조 (계약 해지)",
    content:
      "① 이용자는 언제든지 서비스 내에서 계약 해지를 요청할 수 있습니다.\n② 회사는 이용자가 이 약관을 위반한 경우 서비스 이용을 제한하거나 계약을 해지할 수 있습니다.\n③ 해지 시 이용자의 계약서 데이터는 즉시 삭제됩니다.",
  },
  {
    id: "jurisdiction",
    title: "제10조 (분쟁해결 및 관할법원)",
    content:
      "① 이 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.\n② 서비스 이용과 관련하여 분쟁이 발생한 경우 서울중앙지방법원을 전속관할법원으로 합니다.",
  },
];

const history = [
  { date: "2026.06.01", description: "최초 시행" },
];

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-20">
        <Container>
          <div className="md:grid md:grid-cols-[240px_1fr] md:gap-12">
            {/* Sidebar TOC - sticky */}
            <aside className="hidden md:block">
              <nav className="sticky top-24 space-y-1" aria-label="목차">
                <p className="text-xs font-semibold text-text-quaternary uppercase tracking-wider mb-3">목차</p>
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-text-tertiary hover:text-accent py-1 transition-colors truncate"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <article>
              <header className="mb-12">
                <Badge className="mb-4">법적 고지</Badge>
                <h1 className="text-[2rem] md:text-[2.75rem] font-bold text-text-primary leading-tight mb-4">
                  이용약관
                </h1>
                <p className="text-text-tertiary">
                  시행일: 2026년 6월 1일 | 파이네스트 주식회사
                </p>
              </header>

              <div className="space-y-10">
                {sections.map((section) => (
                  <section key={section.id} id={section.id}>
                    <h2 className="text-lg font-semibold text-text-primary mb-3">
                      {section.title}
                    </h2>
                    <div className="text-sm leading-7 text-text-secondary whitespace-pre-line">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>

              {/* Update history */}
              <div className="mt-16 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-text-primary mb-4">업데이트 이력</h3>
                <table className="text-sm w-full">
                  <thead>
                    <tr className="text-left text-text-quaternary">
                      <th className="pb-2 pr-8 font-medium">날짜</th>
                      <th className="pb-2 font-medium">내용</th>
                    </tr>
                  </thead>
                  <tbody className="text-text-secondary">
                    {history.map((entry) => (
                      <tr key={entry.date}>
                        <td className="py-1.5 pr-8 font-mono text-xs">{entry.date}</td>
                        <td className="py-1.5">{entry.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
