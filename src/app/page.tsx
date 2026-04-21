import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import DemoSection from "@/components/DemoSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import PricingSection from "@/components/PricingSection";
import TrustSection from "@/components/TrustSection";
import FAQSection from "@/components/FAQSection";
import WaitlistSection from "@/components/WaitlistSection";
import Footer from "@/components/Footer";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Claused",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "AI가 계약서의 독소조항을 찾아내고, 당신에게 유리한 대안 문구를 제시합니다.",
    url: "https://claused.kr",
    author: {
      "@type": "Organization",
      name: "Pie Nest Inc.",
      url: "https://claused.kr",
    },
    offers: {
      "@type": "Offer",
      price: "19900",
      priceCurrency: "KRW",
      description: "Standard 월간 플랜",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <main>
        <HeroSection />
        <DemoSection />
        <ProblemSection />
        <SolutionSection />
        <PricingSection />
        <TrustSection />
        <FAQSection />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  );
}
