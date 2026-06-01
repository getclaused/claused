import type { NegotiationOutcome } from "@/lib/supabase/database.types";

interface OutcomeBadgeProps {
  outcome: NegotiationOutcome;
  size?: "sm" | "md";
}

const labels: Record<NegotiationOutcome, string> = {
  favorable: "유리함",
  neutral: "변화 없음",
  unfavorable: "불리함",
};

const styles: Record<NegotiationOutcome, string> = {
  favorable: "bg-[#10B981] text-white",
  neutral: "bg-[#F59E0B] text-white",
  unfavorable: "bg-[#DC2626] text-white",
};

export default function OutcomeBadge({ outcome, size = "md" }: OutcomeBadgeProps) {
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span
      className={`inline-flex items-center font-medium rounded-md ${styles[outcome]} ${sizeClass}`}
    >
      {labels[outcome]}
    </span>
  );
}
