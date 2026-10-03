// src/features/landing/pages/mobile/LandingMobilePage.jsx

import {
  MobileBenefitsSection,
  MobileCTASection,
  MobileDashboardShowcaseSection,
  MobileFAQSection,
  MobileFeaturesSection,
  MobileHeroSection,
  MobilePricingSection,
  MobileTestimonialsSection,
  MobileWorkflowSection,
} from "../../components/mobile";

const LandingMobilePage = () => {
  return (
    <>
      <MobileHeroSection />

      <MobileFeaturesSection />

      <MobileDashboardShowcaseSection />

      <MobileWorkflowSection />

      <MobileBenefitsSection />

      <MobileTestimonialsSection />

      <MobilePricingSection />

      <MobileFAQSection />

      <MobileCTASection />
    </>
  );
};

export default LandingMobilePage;
