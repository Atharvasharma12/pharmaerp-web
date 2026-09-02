// src/features/setup/pages/SetupCenterPage.jsx

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";

import { getWorkspaceSetupStatus } from "@/features/workspace/store/workspaceThunk";
import {
  selectWorkspaceSetupStatus,
  selectWorkspaceSetupStatusVersion,
} from "@/features/workspace/store/workspaceSelector";
import { uiToast } from "@/components/ui";

import SetupCenterDesktopPage from "./desktop/SetupCenterDesktopPage";
import SetupCenterMobilePage from "./mobile/SetupCenterMobilePage";

// 2 core active setup steps
const setupStepsConfig = [
  {
    id: "company",
    title: "Create Company",
    description: "Add your pharmaceutical business details, GSTIN, PAN, and drug licenses.",
    actionText: "Create Company",
    route: ROUTES.CREATE_COMPANY,
    completedRoute: ROUTES.COMPANIES,
    requiredFields: [],
    colorVariant: "primary",
  },
  {
    id: "branch",
    title: "Create Branch",
    description: "Add your first pharmacy branch, store location, and POS billing counter.",
    actionText: "Create Branch",
    route: ROUTES.CREATE_BRANCH,
    completedRoute: ROUTES.BRANCHES,
    requiredFields: ["company"],
    colorVariant: "info",
  },
];

const SetupCenterPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentWorkspace, activeWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?._id || activeWorkspace?._id;

  // Single source of truth for setup status
  const setupStatus = useSelector(selectWorkspaceSetupStatus);
  const setupVersion = useSelector(selectWorkspaceSetupStatusVersion);

  const [selectedStepId, setSelectedStepId] = useState("company");
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [isTestingStep, setIsTestingStep] = useState(false);

  useEffect(() => {
    if (!workspaceId) return;
    dispatch(getWorkspaceSetupStatus(workspaceId));
  }, [workspaceId, setupVersion, dispatch]);

  // Map API response flags to a flat completion lookup
  const setupState = useMemo(
    () => ({
      company: setupStatus?.steps?.company?.completed ?? false,
      branch: setupStatus?.steps?.branch?.completed ?? false,
    }),
    [setupStatus],
  );

  const mappedSetupSteps = useMemo(
    () =>
      setupStepsConfig.map((step) => {
        const locked = step.requiredFields.some((field) => !setupState[field]);
        const completed = Boolean(setupState[step.id]);
        const targetRoute = completed
          ? step.completedRoute || step.route
          : step.route;

        return {
          ...step,
          completed,
          locked,
          disabled: locked,
          onClick: () => {
            if (!locked && targetRoute) {
              navigate(targetRoute);
            }
          },
        };
      }),
    [navigate, setupState],
  );

  const completedStepsCount = mappedSetupSteps.filter(
    (step) => step.completed,
  ).length;

  const progress =
    setupStatus?.progress?.percentage ??
    (mappedSetupSteps.length
      ? Math.round((completedStepsCount / mappedSetupSteps.length) * 100)
      : 0);

  const nextStep = mappedSetupSteps.find(
    (step) => !step.completed && !step.locked,
  );

  const canGoLive = completedStepsCount === mappedSetupSteps.length && mappedSetupSteps.length > 0;

  // Auto-focus the next actionable step
  useEffect(() => {
    if (nextStep) {
      setSelectedStepId(nextStep.id);
    } else if (mappedSetupSteps.length > 0) {
      setSelectedStepId(mappedSetupSteps[0].id);
    }
  }, [nextStep?.id]);

  const selectedStep = mappedSetupSteps.find((s) => s.id === selectedStepId) || mappedSetupSteps[0] || null;

  const handleRunDiagnostics = () => {
    setIsRunningDiagnostics(true);
    setTimeout(() => {
      setIsRunningDiagnostics(false);
      if (canGoLive) {
        uiToast.success("All systems operational. Ready to Go Live!");
      } else {
        uiToast.info(`Setup in progress: ${completedStepsCount} of ${mappedSetupSteps.length} steps completed.`);
      }
    }, 750);
  };

  const handleTestStep = (step) => {
    setIsTestingStep(true);
    setTimeout(() => {
      setIsTestingStep(false);
      if (step.completed) {
        uiToast.success(`Step verified: ${step.title} is active & configured.`);
      } else if (step.locked) {
        uiToast.warning(`Prerequisites missing: Complete previous steps before ${step.title}.`);
      } else {
        uiToast.info(`Step ready for configuration: ${step.title}.`);
      }
    }, 600);
  };

  const handleGoLive = () => {
    if (canGoLive) {
      uiToast.success("🚀 Congratulations! PharmaERP is live and ready for billing & inventory operations.");
      navigate("/dashboard");
    } else {
      uiToast.warning("Please complete all setup steps before going live.");
    }
  };

  const pageProps = {
    mappedSetupSteps,
    selectedStep,
    onSelectStep: (step) => setSelectedStepId(step.id),
    completedStepsCount,
    progress,
    nextStep,
    canGoLive,
    isLiveMode,
    onToggleLiveMode: () => setIsLiveMode((v) => !v),
    onRunDiagnostics: handleRunDiagnostics,
    isRunningDiagnostics,
    onTestStep: handleTestStep,
    isTestingStep,
    onGoLive: handleGoLive,
  };

  return isMobile ? (
    <SetupCenterMobilePage {...pageProps} />
  ) : (
    <SetupCenterDesktopPage {...pageProps} />
  );
};

export default SetupCenterPage;
