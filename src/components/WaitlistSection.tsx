"use client";

import { useState, type FormEvent } from "react";
import Container from "@/components/ui/Container";

type FormStatus = "idle" | "submitting" | "success" | "already_exists" | "error";

const occupationOptions = [
  { value: "", label: "직업을 선택해주세요" },
  { value: "freelancer", label: "프리랜서" },
  { value: "startup", label: "스타트업 대표" },
  { value: "smb", label: "소상공인" },
  { value: "inhouse", label: "인하우스 (사내)" },
  { value: "other", label: "기타" },
];

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !occupation) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, occupation }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setStatus("error");
          setErrorMessage("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
          return;
        }
        setStatus("error");
        setErrorMessage(data.error || "오류가 발생했습니다. 다시 시도해주세요.");
        return;
      }

      if (data.already_exists) {
        setStatus("already_exists");
      } else {
        setStatus("success");
      }
    } catch {
      setStatus("error");
      setErrorMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <section id="waitlist" className="py-20 md:py-28 bg-[#0F1D2E] border-t border-[#1E293B]">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-[1.75rem] md:text-[2.5rem] leading-tight font-bold text-white mb-4 break-keep">
            6월 런칭, 먼저 경험하세요.
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-[#94A3B8] mb-10 break-keep">
            베타 테스터 300명에게 6개월 50% 할인 +
            파운더 직접 1:1 피드백 세션을 제공합니다.
          </p>

          {status === "success" || status === "already_exists" ? (
            <div className="bg-[#0A1628] border border-[#1E293B] rounded-xl p-8">
              <div className="w-12 h-12 rounded-full bg-success-bg text-success-text flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-white mb-2">
                {status === "success" ? "신청 감사합니다!" : "이미 신청하셨습니다."}
              </p>
              <p className="text-sm text-[#94A3B8] break-keep">
                {status === "success"
                  ? "6월 중 초대장을 보내드립니다. 확인 메일을 확인해주세요."
                  : "입력하신 이메일로 이미 등록되어 있습니다. 6월 런칭 시 초대장을 보내드리겠습니다."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              <label htmlFor="waitlist-email" className="sr-only">이메일 주소</label>
              <input
                id="waitlist-email"
                type="email"
                required
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-[#0A1628] border border-[#1E293B] rounded-lg text-white placeholder:text-[#7C8BA0] text-base transition-colors hover:border-[#334155] focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
                autoComplete="email"
              />

              <label htmlFor="waitlist-occupation" className="sr-only">직업 선택</label>
              <select
                id="waitlist-occupation"
                required
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full h-12 px-4 bg-[#0A1628] border border-[#1E293B] rounded-lg text-white text-base appearance-none cursor-pointer transition-colors hover:border-[#334155] focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                }}
              >
                {occupationOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={!opt.value}
                    className="text-white bg-[#0A1628]"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>

              {status === "error" && (
                <p className="text-sm text-red-400" role="alert">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full h-13 bg-[#3B82F6] text-white font-semibold text-base rounded-lg hover:bg-[#2563EB] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? "신청 중..." : "베타 테스터 신청하기"}
              </button>

              <p className="text-xs text-[#7C8BA0] mt-3">
                입력하신 이메일은 Claused 런칭 안내 목적으로만 사용됩니다.
              </p>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
