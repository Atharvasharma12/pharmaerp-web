// src/features/landing/pages/LandingPage.jsx

import { useIsMobile } from "@/hooks";
import { LandingDesktopPage } from "./desktop";
import { LandingMobilePage } from "./mobile";

const LandingPage = () => {
  const isMobile = useIsMobile();

  return isMobile ? <LandingMobilePage /> : <LandingDesktopPage />;
};

export default LandingPage;
