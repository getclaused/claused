import Link from "next/link";
import Container from "@/components/ui/Container";

const footerLinks = {
  product: [
    { label: "기능", href: "/#features" },
    { label: "가격", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ],
  legal: [
    { label: "이용약관", href: "/terms" },
    { label: "개인정보처리방침", href: "/privacy" },
  ],
  company: [
    { label: "K-Saju", href: "https://k-saju.app", external: true },
    { label: "Dalnara", href: "https://dalnara.app", external: true },
    { label: "Contact", href: "mailto:hi@claused.kr" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-mono text-sm font-semibold tracking-[0.08em] text-white mb-3">
              CLAUSED
            </p>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              AI 계약서 검토 서비스.
              <br />
              Pie Nest Inc.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-sm font-semibold text-[#CBD5E1] mb-3">제품</p>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[#94A3B8] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-sm font-semibold text-[#CBD5E1] mb-3">법적 고지</p>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[#94A3B8] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold text-[#CBD5E1] mb-3">Pie Nest</p>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...("external" in link && link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="text-sm text-[#94A3B8] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#7C8BA0]">
            &copy; 2026 Pie Nest Inc. All rights reserved.
          </p>
          <p className="text-xs text-[#7C8BA0]">
            Seoul, South Korea
          </p>
        </div>
      </Container>
    </footer>
  );
}
