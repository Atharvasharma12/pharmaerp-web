// src/features/landing/pages/desktop/LandingDesktopPage.jsx

import {
  DesktopBenefitsSection,
  DesktopCTASection,
  DesktopDashboardShowcaseSection,
  DesktopFAQSection,
  DesktopFeaturesSection,
  DesktopHeroSection,
  DesktopPricingSection,
  DesktopTestimonialsSection,
  DesktopWorkflowSection,
} from "../../components/desktop";

const LandingDesktopPage = () => {
  return (
    <>
      <DesktopHeroSection />

      <DesktopFeaturesSection />

      <DesktopDashboardShowcaseSection />

      <DesktopWorkflowSection />

      <DesktopBenefitsSection />

      <DesktopTestimonialsSection />

      <DesktopPricingSection />

      <DesktopFAQSection />

      <DesktopCTASection />
    </>
  );
};

export default LandingDesktopPage;
