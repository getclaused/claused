interface CardProps {
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
}

export default function Card({ children, className = "", highlight = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border bg-bg-primary p-6 md:p-8 transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] ${
        highlight
          ? "border-accent/30 shadow-lg shadow-accent/5"
          : "border-border hover:border-text-quaternary hover:shadow-sm"
      } ${className}`}
    >
      {children}
    </div>
  );
}
