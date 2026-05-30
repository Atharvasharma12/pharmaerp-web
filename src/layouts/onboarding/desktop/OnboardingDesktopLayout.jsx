import { Outlet } from "react-router-dom";

import OnboardingDesktopHeader from "./OnboardingDesktopHeader";

const OnboardingDesktopLayout = () => {
  return (
    <div className="min-h-screen bg-bg text-text">
      <OnboardingDesktopHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default OnboardingDesktopLayout;
