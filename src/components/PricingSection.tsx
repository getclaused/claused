"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type PricingTab = "one-time" | "pack" | "subscription";

const tabs: { id: PricingTab; label: string }[] = [
  { id: "one-time", label: "1회권" },
  { id: "pack", label: "5-Pack" },
  { id: "subscription", label: "구독" },
];

const tabDescriptions: Record<PricingTab, string> = {
  "one-time": "지금 이 계약서 하나만, 변호사 상담료의 1/20 가격으로.",
  pack: "여러 건을 한꺼번에. 3개월 내 언제든 사용하세요.",
  subscription:
    "변호사 상담 1시간 최소 ₩200,000. Claused는 그 비용으로 1년간 무제한 계약서 검토를 제공합니다.",
};

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState<PricingTab>("subscription");
  const [annual, setAnnual] = useState(true);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-20 md:py-28 border-t border-[#1E293B]">
      <Container>
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-[1.75rem] md:text-[2.5rem] leading-tight font-bold text-white mb-4 break-keep">
            변호사 상담 한 번 = Claused 1년.
          </h2>

          {/* Segmented control */}
          <div className="inline-flex items-center bg-[#0A1628] border border-[#1E293B] rounded-full p-1 mt-6 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#3B82F6] text-white shadow-sm"
                    : "text-[#94A3B8] hover:text-[#F5F7FA]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="text-[#94A3B8] text-base max-w-xl mx-auto break-keep">
            {tabDescriptions[activeTab]}
          </p>
        </div>

        {/* One-time card */}
        {activeTab === "one-time" && (
          <div className="max-w-md mx-auto">
            <Card highlight>
              <Badge variant="gold" className="mb-4">EARLY BIRD</Badge>
              <h3 className="text-xl font-bold text-white mb-1">스팟 검토</h3>
              <p className="text-sm text-[#94A3B8] mb-6">계약서 1건 검토</p>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-mono text-4xl font-bold text-white">₩7,450</span>
                <span className="text-[#94A3B8] text-sm">/ 건</span>
              </div>
              <p className="text-sm text-[#94A3B8] mb-8">
                <span className="line-through">₩14,900</span>
                <span className="ml-2 font-semibold text-[#3B82F6]">50% OFF</span>
              </p>

              <button
                onClick={() => scrollTo("waitlist")}
                className="w-full h-12 bg-[#3B82F6] text-white font-semibold text-base rounded-lg hover:bg-[#2563EB] transition-colors cursor-pointer"
              >
                베타 신청하기
              </button>

              <ul className="mt-6 space-y-2.5 text-sm text-[#C0C7D1]">
                <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 계약서 1건 전체 분석</li>
                <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 독소조항 탐지 + 리스크 산출</li>
                <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 대안 문구 + 이메일 초안</li>
                <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 24시간 자동 삭제</li>
              </ul>
            </Card>
          </div>
        )}

        {/* 5-Pack card */}
        {activeTab === "pack" && (
          <div className="max-w-md mx-auto">
            <Card highlight>
              <Badge variant="gold" className="mb-4">EARLY BIRD</Badge>
              <h3 className="text-xl font-bold text-white mb-1">5-Pack</h3>
              <p className="text-sm text-[#94A3B8] mb-6">계약서 5건 패키지 · 건당 ₩5,990</p>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-mono text-4xl font-bold text-white">₩29,950</span>
                <span className="text-[#94A3B8] text-sm">/ 5건</span>
              </div>
              <p className="text-sm text-[#94A3B8] mb-8">
                <span className="line-through">₩59,900</span>
                <span className="ml-2 font-semibold text-[#3B82F6]">50% OFF</span>
              </p>

              <button
                onClick={() => scrollTo("waitlist")}
                className="w-full h-12 bg-[#3B82F6] text-white font-semibold text-base rounded-lg hover:bg-[#2563EB] transition-colors cursor-pointer"
              >
                베타 신청하기
              </button>

              <ul className="mt-6 space-y-2.5 text-sm text-[#C0C7D1]">
                <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 계약서 5건 검토 (건당 ₩5,990)</li>
                <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 1회권 대비 60% 절약</li>
                <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 독소조항 + 대안 문구 무제한</li>
                <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 3개월 내 소진</li>
              </ul>
            </Card>
          </div>
        )}

        {/* Subscription cards */}
        {activeTab === "subscription" && (
          <>
            {/* Toggle */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <span className={`text-sm ${!annual ? "text-white font-medium" : "text-[#94A3B8]"}`}>월간</span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${annual ? "bg-[#3B82F6]" : "bg-[#1E293B]"}`}
                aria-label="결제 주기 전환"
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${annual ? "left-[26px]" : "left-0.5"}`} />
              </button>
              <span className={`text-sm ${annual ? "text-white font-medium" : "text-[#94A3B8]"}`}>연간</span>
              <Badge variant="success">2개월 무료</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Early Bird */}
              <Card highlight>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Badge variant="gold" className="mb-2">EARLY BIRD</Badge>
                    <h3 className="text-xl font-bold text-white">베타 테스터</h3>
                    <p className="text-sm text-[#94A3B8] mt-1">런칭 후 6개월간 적용</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-mono text-4xl font-bold text-white">
                    ₩{annual ? "99,000" : "9,900"}
                  </span>
                  <span className="text-[#94A3B8] text-sm">
                    / {annual ? "년" : "월"}
                  </span>
                </div>
                <p className="text-sm text-[#94A3B8] mb-6">
                  <span className="line-through">₩{annual ? "199,000" : "19,900"}</span>
                  <span className="ml-2 font-semibold text-[#3B82F6]">50% OFF</span>
                </p>
                <button
                  onClick={() => scrollTo("waitlist")}
                  className="w-full h-12 bg-[#3B82F6] text-white font-semibold text-base rounded-lg hover:bg-[#2563EB] transition-colors cursor-pointer"
                >
                  베타 신청하기
                </button>
                <ul className="mt-6 space-y-2.5 text-sm text-[#C0C7D1]">
                  <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 무제한 계약서 검토</li>
                  <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 수정안 자동 생성</li>
                  <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 파운더 1:1 피드백 세션</li>
                  <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 향후 모든 기능 우선 접근</li>
                </ul>
              </Card>

              {/* Standard */}
              <Card>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Standard</h3>
                  <p className="text-sm text-[#94A3B8] mt-1">정식 런칭 후 정가</p>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-mono text-4xl font-bold text-white">
                    ₩{annual ? "199,000" : "19,900"}
                  </span>
                  <span className="text-[#94A3B8] text-sm">
                    / {annual ? "년" : "월"}
                  </span>
                </div>
                <p className="text-sm text-[#94A3B8] mb-6">
                  {annual ? "월 ₩16,583 (연 결제 할인)" : "연 결제 시 2개월 무료"}
                </p>
                <button
                  onClick={() => scrollTo("waitlist")}
                  className="w-full h-12 bg-transparent text-white font-semibold text-base rounded-lg border border-[#1E293B] hover:border-[#3B82F6]/50 transition-colors cursor-pointer"
                >
                  런칭 알림 받기
                </button>
                <ul className="mt-6 space-y-2.5 text-sm text-[#C0C7D1]">
                  <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 무제한 계약서 검토</li>
                  <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 수정안 자동 생성</li>
                  <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 표준 계약서 템플릿 50+</li>
                  <li className="flex gap-2"><span className="text-[#22C55E]">✓</span> 이메일 초안 생성</li>
                </ul>
              </Card>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
