import { useIsMobile } from "@/hooks";

import { OnboardingDesktopLayout } from "./desktop";

import { OnboardingMobileLayout } from "./mobile";

const OnboardingLayout = () => {
  const isMobile = useIsMobile();

  return isMobile ? <OnboardingMobileLayout /> : <OnboardingDesktopLayout />;
};

export default OnboardingLayout;
