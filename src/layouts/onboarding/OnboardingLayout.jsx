import { useIsMobile } from "@/hooks";
import { ScrollToTop } from "@/components";

import { OnboardingDesktopLayout } from "./desktop";

import { OnboardingMobileLayout } from "./mobile";

const OnboardingLayout = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <ScrollToTop />
      {isMobile ? <OnboardingMobileLayout /> : <OnboardingDesktopLayout />}
    </>
  );
};

export default OnboardingLayout;
