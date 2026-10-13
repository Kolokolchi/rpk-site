import type { SiteContent } from "../../shared/content-schema";
import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";
import ClientsSection from "./ClientsSection";
import IntroSection from "./IntroSection";
import AdvantagesSection from "./AdvantagesSection";
import ProductionSection from "./ProductionSection";
import TestimonialsSection from "./TestimonialsSection";
import EcosystemSection from "./EcosystemSection";
import FaqSection from "./FaqSection";
import ContactSection from "./ContactSection";
import ProjectPortfolio from "./ProjectPortfolio";

export default function HomePage({ content }: { content: SiteContent }) {
  return (
    <>
      <HeroSection content={content} />
      <ServicesSection content={content} />
      <ProjectPortfolio
        portfolio={content.portfolio}
        title={content.portfolioTitle}
      />
      <ClientsSection content={content} />
      <IntroSection content={content} />
      <AdvantagesSection content={content} />
      <ProductionSection content={content} />
      <TestimonialsSection content={content} />
      <EcosystemSection content={content} />
      <FaqSection />
      <ContactSection content={content} />
    </>
  );
}
