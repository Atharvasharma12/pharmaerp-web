// src/layouts/onboarding/desktop/OnboardingDesktopLayout.jsx

import { Outlet } from "react-router-dom";

import OnboardingDesktopHeader from "./OnboardingDesktopHeader";
import OnboardingDesktopFooter from "./OnboardingDesktopFooter";

const OnboardingDesktopLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <OnboardingDesktopHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-2">
        <Outlet />
      </main>

      <OnboardingDesktopFooter />
    </div>
  );
};

export default OnboardingDesktopLayout;
