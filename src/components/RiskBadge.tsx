import type { RiskLevel } from "@/lib/supabase/database.types";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md";
}

const labels: Record<RiskLevel, string> = {
  high: "위험 높음",
  medium: "주의 필요",
  low: "양호",
};

const styles: Record<RiskLevel, string> = {
  high: "bg-[#DC2626] text-white",
  medium: "bg-[#F59E0B] text-white",
  low: "bg-[#10B981] text-white",
};

export default function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span
      className={`inline-flex items-center font-medium rounded-md ${styles[level]} ${sizeClass}`}
    >
      {labels[level]}
    </span>
  );
}
