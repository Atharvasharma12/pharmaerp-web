// src/features/dashboard/pages/mobile/DashboardMobilePage.jsx

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { dashboardStats, quickGuides, setupSteps } from "../../constants";

import WelcomeDashboardMobilePage from "./WelcomeDashboardMobilePage";
import MainDashboardMobilePage from "./MainDashboardMobilePage";

const DashboardMobilePage = () => {
  const navigate = useNavigate();

  const completedStepsCount = useMemo(
    () => setupSteps.filter((step) => step.completed).length,
    [],
  );

  const progress = useMemo(() => {
    if (!setupSteps.length) return 0;

    return Math.round((completedStepsCount / setupSteps.length) * 100);
  }, [completedStepsCount]);

  const isSetupCompleted = progress >= 100;

  const mappedSetupSteps = useMemo(
    () =>
      setupSteps.map((step) => ({
        ...step,
        onClick: () => {
          if (!step.disabled && step.route) {
            navigate(step.route);
          }
        },
      })),
    [navigate],
  );

  const mappedQuickGuides = useMemo(
    () =>
      quickGuides.map((guide) => ({
        ...guide,
        onClick: () => {
          if (guide.route) {
            navigate(guide.route);
          }
        },
      })),
    [navigate],
  );

  const pageProps = {
    stats: dashboardStats,
    setupSteps: mappedSetupSteps,
    quickGuides: mappedQuickGuides,
    progress,
    completedStepsCount,
    totalStepsCount: setupSteps.length,
    handleExploreFeatures: () => navigate("/help-center"),
    handleContactSupport: () => navigate("/help-center"),
  };

  return isSetupCompleted ? (
    <MainDashboardMobilePage {...pageProps} />
  ) : (
    <WelcomeDashboardMobilePage {...pageProps} />
  );
};

export default DashboardMobilePage;
