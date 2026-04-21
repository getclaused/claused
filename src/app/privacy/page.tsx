import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "Claused 개인정보처리방침",
};

const collectionItems = [
  { category: "필수", items: "이메일 주소", purpose: "서비스 계정, 안내 발송", retention: "회원 탈퇴 시 즉시 파기" },
  { category: "필수", items: "비밀번호 (해시)", purpose: "본인 인증", retention: "회원 탈퇴 시 즉시 파기" },
  { category: "선택", items: "직업, 업종", purpose: "서비스 개선, 맞춤 분석", retention: "수집 후 1년 또는 탈퇴 시" },
  { category: "자동수집", items: "IP 주소, User-Agent", purpose: "보안, 부정이용 방지", retention: "수집 후 6개월" },
  { category: "자동수집", items: "서비스 이용 기록", purpose: "서비스 개선, 통계", retention: "수집 후 1년" },
  { category: "업로드", items: "계약서 파일", purpose: "AI 분석 수행", retention: "분석 완료 후 24시간 내 삭제" },
];

const sections = [
  {
    id: "overview",
    title: "제1조 (개인정보 처리 목적)",
    content:
      "파이네스트 주식회사(이하 \"회사\")는 다음 목적으로 개인정보를 처리합니다:\n\n① 서비스 제공 및 회원 관리: 본인 확인, 서비스 이용, 이용 기록 관리\n② 요금 결제 및 환불: 결제 처리, 영수증 발급\n③ 서비스 개선: 이용 통계, 서비스 품질 향상\n④ 안전 관리: 부정이용 방지, 보안 위협 탐지",
  },
  {
    id: "rights",
    title: "제3조 (이용자의 권리)",
    content:
      "이용자는 다음 권리를 행사할 수 있습니다:\n\n① 개인정보 열람 요구\n② 개인정보 정정·삭제 요구\n③ 개인정보 처리 정지 요구\n④ 동의 철회 (회원 탈퇴)\n\n권리 행사는 서비스 내 설정 또는 hi@claused.kr로 요청할 수 있으며, 회사는 지체 없이 조치합니다.",
  },
  {
    id: "security",
    title: "제4조 (개인정보 보호 조치)",
    content:
      "회사는 다음 보호 조치를 실시합니다:\n\n① 기술적 조치: 데이터 암호화(TLS 1.3, AES-256), 접근통제, 침입탐지\n② 관리적 조치: 개인정보 취급 직원 최소화, 정기 교육\n③ 물리적 조치: 클라우드 인프라 보안 인증(SOC 2) 환경 운용",
  },
  {
    id: "destruction",
    title: "제5조 (개인정보 파기)",
    content:
      "회사는 보유기간 경과 또는 처리 목적 달성 시 지체 없이 파기합니다:\n\n① 전자적 파일: 복원 불가능한 방법으로 영구 삭제\n② 계약서 데이터: 분석 완료 후 24시간 내 자동 삭제 (설정에 따라 즉시 삭제 가능)\n③ 기록물: 분쇄 또는 소각",
  },
  {
    id: "contact",
    title: "제6조 (개인정보 보호 책임자)",
    content:
      "성명: 이동현\n직위: 대표이사 (CPO/CISO)\n연락처: hi@claused.kr\n\n이용자는 서비스 이용 과정에서 발생하는 모든 개인정보 보호 관련 문의, 불만, 피해구제를 위 담당자에게 신고할 수 있습니다.",
  },
];

const thirdParties = [
  { provider: "Supabase Inc.", purpose: "데이터베이스 호스팅", items: "이메일, 이용기록", country: "미국 (AWS Oregon)" },
  { provider: "Vercel Inc.", purpose: "웹 호스팅·CDN", items: "IP 주소, 접속 기록", country: "미국 (Global Edge)" },
  { provider: "Resend Inc.", purpose: "이메일 발송", items: "이메일 주소", country: "미국" },
  { provider: "OpenAI / Anthropic", purpose: "AI 분석 처리", items: "계약서 텍스트 (비식별)", country: "미국" },
];

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-20">
        <Container>
          <div className="md:grid md:grid-cols-[240px_1fr] md:gap-12">
            {/* Sidebar TOC */}
            <aside className="hidden md:block">
              <nav className="sticky top-24 space-y-1" aria-label="목차">
                <p className="text-xs font-semibold text-text-quaternary uppercase tracking-wider mb-3">목차</p>
                <a href="#collection" className="block text-sm text-text-tertiary hover:text-accent py-1 transition-colors">수집 항목</a>
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="block text-sm text-text-tertiary hover:text-accent py-1 transition-colors truncate">
                    {s.title}
                  </a>
                ))}
                <a href="#third-party" className="block text-sm text-text-tertiary hover:text-accent py-1 transition-colors">제3자 제공·국외 이전</a>
              </nav>
            </aside>

            {/* Content */}
            <article>
              <header className="mb-12">
                <Badge className="mb-4">법적 고지</Badge>
                <h1 className="text-[2rem] md:text-[2.75rem] font-bold text-text-primary leading-tight mb-4">
                  개인정보처리방침
                </h1>
                <p className="text-text-tertiary">
                  시행일: 2026년 6월 1일 | 파이네스트 주식회사
                </p>
              </header>

              {/* Collection table */}
              <section id="collection" className="mb-12">
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  제2조 (수집하는 개인정보 항목)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-3 pr-4 font-medium text-text-quaternary">구분</th>
                        <th className="py-3 pr-4 font-medium text-text-quaternary">항목</th>
                        <th className="py-3 pr-4 font-medium text-text-quaternary">목적</th>
                        <th className="py-3 font-medium text-text-quaternary">보유기간</th>
                      </tr>
                    </thead>
                    <tbody className="text-text-secondary">
                      {collectionItems.map((item, i) => (
                        <tr key={i} className="border-b border-border-light">
                          <td className="py-3 pr-4">
                            <Badge variant={item.category === "필수" ? "info" : item.category === "업로드" ? "danger" : "default"}>
                              {item.category}
                            </Badge>
                          </td>
                          <td className="py-3 pr-4 font-mono text-xs">{item.items}</td>
                          <td className="py-3 pr-4">{item.purpose}</td>
                          <td className="py-3 text-text-tertiary">{item.retention}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Main sections */}
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

              {/* Third party / overseas transfer */}
              <section id="third-party" className="mt-12">
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  제7조 (제3자 제공 및 국외 이전)
                </h2>
                <p className="text-sm text-text-secondary mb-6 leading-7">
                  회사는 서비스 운영을 위해 다음 제3자에게 개인정보 처리를 위탁하며,
                  이 과정에서 국외 이전이 발생합니다. 모든 위탁업체는 업계 표준 보안 인증을 보유하고 있습니다.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {thirdParties.map((tp) => (
                    <Card key={tp.provider} className="!p-5">
                      <p className="font-semibold text-text-primary text-sm mb-2">{tp.provider}</p>
                      <dl className="text-xs space-y-1 text-text-tertiary">
                        <div className="flex gap-2">
                          <dt className="font-medium text-text-quaternary w-12">목적</dt>
                          <dd>{tp.purpose}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="font-medium text-text-quaternary w-12">항목</dt>
                          <dd>{tp.items}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="font-medium text-text-quaternary w-12">소재지</dt>
                          <dd>{tp.country}</dd>
                        </div>
                      </dl>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Update history */}
              <div className="mt-16 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-text-primary mb-4">업데이트 이력</h3>
                <table className="text-sm">
                  <tbody className="text-text-secondary">
                    <tr>
                      <td className="py-1.5 pr-8 font-mono text-xs">2026.06.01</td>
                      <td className="py-1.5">최초 시행</td>
                    </tr>
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
