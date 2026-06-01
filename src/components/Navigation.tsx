"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] ${
        scrolled
          ? "bg-bg-primary/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-[1120px] px-5 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-mono text-sm font-semibold tracking-[0.08em] text-text-primary">
            CLAUSED
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo("demo")}
            className="text-sm text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
          >
            데모
          </button>
          <Link
            href="/compare"
            className="text-sm text-text-tertiary hover:text-text-primary transition-colors"
          >
            비교
          </Link>
          <Link
            href="/history"
            className="text-sm text-text-tertiary hover:text-text-primary transition-colors"
          >
            내 분석 이력
          </Link>
          <button
            onClick={() => scrollTo("features")}
            className="text-sm text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
          >
            기능
          </button>
          <button
            onClick={() => scrollTo("pricing")}
            className="text-sm text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
          >
            가격
          </button>
          <Link
            href="/terms"
            className="text-sm text-text-tertiary hover:text-text-primary transition-colors"
          >
            약관
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <Button size="sm" onClick={() => scrollTo("waitlist")}>
            베타 신청
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-text-secondary cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {menuOpen ? (
              <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <>
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-bg-primary border-b border-border px-5 pb-5 space-y-3">
          <button onClick={() => scrollTo("demo")} className="block w-full text-left text-sm py-2 text-text-secondary cursor-pointer">데모</button>
          <Link href="/compare" className="block text-sm py-2 text-text-secondary" onClick={() => setMenuOpen(false)}>비교</Link>
          <Link href="/history" className="block text-sm py-2 text-text-secondary" onClick={() => setMenuOpen(false)}>내 분석 이력</Link>
          <button onClick={() => scrollTo("features")} className="block w-full text-left text-sm py-2 text-text-secondary cursor-pointer">기능</button>
          <button onClick={() => scrollTo("pricing")} className="block w-full text-left text-sm py-2 text-text-secondary cursor-pointer">가격</button>
          <Link href="/terms" className="block text-sm py-2 text-text-secondary" onClick={() => setMenuOpen(false)}>약관</Link>
          <Button size="sm" className="w-full mt-2" onClick={() => scrollTo("waitlist")}>
            베타 신청
          </Button>
        </div>
      )}
    </header>
  );
}
