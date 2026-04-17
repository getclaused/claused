export default function Footer() {
  return (
    <footer className="px-5 py-10 border-t border-foreground/5">
      <div className="w-full max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/40">
        <p>
          <span className="text-accent-gold mr-1.5" aria-hidden="true">
            ◉
          </span>
          Pie Nest Inc. · 2026
        </p>
        <nav aria-label="Footer navigation" className="flex gap-6">
          <a
            href="https://k-saju.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground/60 transition-colors"
          >
            K-Saju
          </a>
          <a
            href="https://dalnara.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground/60 transition-colors"
          >
            Dalnara
          </a>
          <a
            href="mailto:hi@claused.kr"
            className="hover:text-foreground/60 transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
