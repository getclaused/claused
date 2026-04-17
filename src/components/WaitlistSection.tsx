"use client";

import { useState, type FormEvent } from "react";

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
    <section id="waitlist" className="px-5 py-20 md:py-28 bg-soft-bg">
      <div className="w-full max-w-[1100px] mx-auto">
        <h2 className="font-serif text-[1.625rem] md:text-[2.25rem] leading-snug font-bold text-foreground mb-4 break-keep">
          7월 런칭, 먼저 경험하세요.
        </h2>

        <p className="text-base md:text-lg leading-relaxed text-foreground/70 max-w-2xl mb-10 md:mb-14 break-keep">
          베타 테스터 300명에게 6개월 50% 할인 +
          <br className="hidden md:block" />
          파운더 직접 1:1 피드백 세션을 제공합니다.
        </p>

        {status === "success" || status === "already_exists" ? (
          <div className="bg-white border border-accent-gold/30 rounded-sm p-8 md:p-10 max-w-lg">
            <p className="font-serif text-xl font-bold text-foreground mb-3">
              {status === "success" ? "신청 감사합니다." : "이미 신청하셨습니다."}
            </p>
            <p className="text-base leading-relaxed text-foreground/70 break-keep">
              {status === "success"
                ? "7월 중 초대장을 보내드립니다. 제품 개발 소식을 먼저 받고 싶으시면 방금 보낸 확인 메일을 열어주세요."
                : "입력하신 이메일로 이미 등록되어 있습니다. 7월 런칭 시 초대장을 보내드리겠습니다."}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-lg"
            noValidate
          >
            <label htmlFor="waitlist-email" className="sr-only">
              이메일 주소
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-13 px-4 bg-white border border-foreground/10 rounded-sm text-base text-foreground placeholder:text-foreground/35 transition-colors hover:border-foreground/20"
              autoComplete="email"
            />

            <label htmlFor="waitlist-occupation" className="sr-only">
              직업 선택
            </label>
            <select
              id="waitlist-occupation"
              required
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="h-13 px-4 bg-white border border-foreground/10 rounded-sm text-base text-foreground appearance-none cursor-pointer transition-colors hover:border-foreground/20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230F1419' opacity='0.4' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
              }}
            >
              {occupationOptions.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={!opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {status === "error" && (
              <p className="text-sm text-accent-red" role="alert">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="h-13 bg-accent-red text-white font-medium text-base rounded-sm hover:bg-accent-red/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {status === "submitting" ? "신청 중..." : "신청하기"}
            </button>

            <p className="text-xs text-foreground/40 mt-1">
              입력하신 이메일은 Claused 런칭 안내 목적으로만 사용됩니다.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
