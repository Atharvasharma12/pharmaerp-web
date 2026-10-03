// src/features/setup/hooks/useSetupStatus.js

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import { getWorkspaceSetupStatus } from "@/features/workspace/store/workspaceThunk";
import {
  selectWorkspaceSetupStatus,
  selectWorkspaceSetupStatusVersion,
  selectWorkspaceSetupStatusLoading,
} from "@/features/workspace/store/workspaceSelector";

/**
 * Universal hook to access the workspace Setup Center state across the entire application.
 * Used by SetupCenterGuard, AppDesktopSidebar, AppMobileSidebar, AppDesktopHeader, and page layouts.
 */
export const useSetupStatus = () => {
  const dispatch = useDispatch();
  const { currentWorkspace, activeWorkspace } = useWorkspace();
  const workspace = currentWorkspace || activeWorkspace || null;
  const workspaceId = workspace?._id || workspace?.id;

  const setupStatus = useSelector(selectWorkspaceSetupStatus);
  const setupVersion = useSelector(selectWorkspaceSetupStatusVersion);
  const isLoading = useSelector(selectWorkspaceSetupStatusLoading);

  useEffect(() => {
    if (workspaceId && !setupStatus) {
      dispatch(getWorkspaceSetupStatus(workspaceId));
    }
  }, [workspaceId, setupStatus, setupVersion, dispatch]);

  const companyCompleted = Boolean(setupStatus?.steps?.company?.completed);
  const branchCompleted = Boolean(setupStatus?.steps?.branch?.completed);

  // Both steps (Company & Branch) must be completed for full activation
  const isSetupComplete = Boolean(
    (companyCompleted && branchCompleted) ||
    (setupStatus?.progress?.percentage === 100)
  );

  const completedCount = (companyCompleted ? 1 : 0) + (branchCompleted ? 1 : 0);
  const progressPercentage =
    setupStatus?.progress?.percentage ?? Math.round((completedCount / 2) * 100);

  const refetch = () => {
    if (workspaceId) {
      return dispatch(getWorkspaceSetupStatus(workspaceId));
    }
  };

  return {
    workspace,
    workspaceId,
    setupStatus,
    companyCompleted,
    branchCompleted,
    isSetupComplete,
    progressPercentage,
    completedCount,
    totalSteps: 2,
    isLoading,
    refetch,
  };
};

export default useSetupStatus;
