type Variant = "default" | "danger" | "success" | "info" | "gold";

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  default: "bg-bg-tertiary text-text-secondary",
  danger: "bg-danger-bg text-danger-text border border-danger-border",
  success: "bg-success-bg text-success-text border border-success-border",
  info: "bg-info-bg text-info-text border border-info-border",
  gold: "bg-gold-light text-gold",
};

export default function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
