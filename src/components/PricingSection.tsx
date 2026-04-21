"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-20 md:py-28">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-[1.75rem] md:text-[2.5rem] leading-tight font-bold text-text-primary mb-4 break-keep">
            변호사 상담 한 번 = Claused 1년.
          </h2>
          <p className="text-text-tertiary text-base md:text-lg max-w-xl mx-auto break-keep">
            변호사 상담 1시간 최소 ₩200,000.
            Claused는 그 비용으로 1년간 무제한 계약서 검토를 제공합니다.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm ${!annual ? "text-text-primary font-medium" : "text-text-quaternary"}`}>월간</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${annual ? "bg-accent" : "bg-border"}`}
              aria-label="결제 주기 전환"
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${annual ? "left-[26px]" : "left-0.5"}`} />
            </button>
            <span className={`text-sm ${annual ? "text-text-primary font-medium" : "text-text-quaternary"}`}>연간</span>
            <Badge variant="success">2개월 무료</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Early Bird */}
          <Card highlight>
            <div className="flex items-start justify-between mb-6">
              <div>
                <Badge variant="gold" className="mb-2">EARLY BIRD</Badge>
                <h3 className="text-xl font-bold text-text-primary">베타 테스터</h3>
                <p className="text-sm text-text-tertiary mt-1">런칭 후 6개월간 적용</p>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-mono text-4xl font-bold text-text-primary">
                ₩{annual ? "99,000" : "9,900"}
              </span>
              <span className="text-text-quaternary text-sm">
                / {annual ? "년" : "월"}
              </span>
            </div>
            <p className="text-sm text-text-tertiary mb-6">
              <span className="line-through">₩{annual ? "199,000" : "19,900"}</span>
              <span className="ml-2 font-semibold text-accent">50% OFF</span>
            </p>
            <Button className="w-full" onClick={() => scrollTo("waitlist")}>
              베타 신청하기
            </Button>
            <ul className="mt-6 space-y-2.5 text-sm text-text-secondary">
              <li className="flex gap-2"><span className="text-success-text">✓</span> 무제한 계약서 검토</li>
              <li className="flex gap-2"><span className="text-success-text">✓</span> 수정안 자동 생성</li>
              <li className="flex gap-2"><span className="text-success-text">✓</span> 파운더 1:1 피드백 세션</li>
              <li className="flex gap-2"><span className="text-success-text">✓</span> 향후 모든 기능 우선 접근</li>
            </ul>
          </Card>

          {/* Standard */}
          <Card>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-text-primary">Standard</h3>
              <p className="text-sm text-text-tertiary mt-1">정식 런칭 후 정가</p>
            </div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-mono text-4xl font-bold text-text-primary">
                ₩{annual ? "199,000" : "19,900"}
              </span>
              <span className="text-text-quaternary text-sm">
                / {annual ? "년" : "월"}
              </span>
            </div>
            <p className="text-sm text-text-tertiary mb-6">
              {annual ? "월 ₩16,583 (연 결제 할인)" : "연 결제 시 2개월 무료"}
            </p>
            <Button variant="secondary" className="w-full" onClick={() => scrollTo("waitlist")}>
              런칭 알림 받기
            </Button>
            <ul className="mt-6 space-y-2.5 text-sm text-text-secondary">
              <li className="flex gap-2"><span className="text-success-text">✓</span> 무제한 계약서 검토</li>
              <li className="flex gap-2"><span className="text-success-text">✓</span> 수정안 자동 생성</li>
              <li className="flex gap-2"><span className="text-success-text">✓</span> 표준 계약서 템플릿 50+</li>
              <li className="flex gap-2"><span className="text-success-text">✓</span> 이메일 초안 생성</li>
            </ul>
          </Card>
        </div>
      </Container>
    </section>
  );
}
