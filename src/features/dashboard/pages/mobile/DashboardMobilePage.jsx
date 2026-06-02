// src/features/dashboard/pages/mobile/DashboardMobilePage.jsx

import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";

import { dashboardStats, quickGuides, setupSteps } from "../../constants";

import WelcomeDashboardMobilePage from "./WelcomeDashboardMobilePage";
import MainDashboardMobilePage from "./MainDashboardMobilePage";

const DashboardMobilePage = () => {
  const navigate = useNavigate();

  const { companies, getWorkspaceCompanies } = useCompany();
  const { branches, getCompanyBranches } = useBranch();

  const hasCompany = companies.length > 0;
  const hasBranch = branches.length > 0;

  useEffect(() => {
    getWorkspaceCompanies().catch(() => {});
    getCompanyBranches().catch(() => {});
  }, []);

  const mappedSetupSteps = useMemo(
    () =>
      setupSteps.map((step) => ({
        ...step,
        completed:
          step.id === "company"
            ? hasCompany
            : step.id === "branch"
              ? hasBranch
              : step.completed,
        onClick: () => {
          if (!step.disabled && step.route) {
            navigate(step.route);
          }
        },
      })),
    [hasCompany, hasBranch, navigate],
  );

  const completedStepsCount = useMemo(
    () => mappedSetupSteps.filter((step) => step.completed).length,
    [mappedSetupSteps],
  );

  const progress = useMemo(() => {
    if (!mappedSetupSteps.length) return 0;

    return Math.round((completedStepsCount / mappedSetupSteps.length) * 100);
  }, [completedStepsCount, mappedSetupSteps.length]);

  const isSetupCompleted = progress >= 100;

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
    totalStepsCount: mappedSetupSteps.length,
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
