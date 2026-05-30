import { Outlet } from "react-router-dom";

import OnboardingMobileHeader from "./OnboardingMobileHeader";

const OnboardingMobileLayout = () => {
  return (
    <div className="min-h-screen bg-bg text-text">
      <OnboardingMobileHeader />

      <main className="px-4 py-5">
        <Outlet />
      </main>
    </div>
  );
};

export default OnboardingMobileLayout;
