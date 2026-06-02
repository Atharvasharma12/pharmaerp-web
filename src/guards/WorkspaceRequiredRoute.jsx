// src/guards/WorkspaceRequiredRoute.jsx

import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";

const WorkspaceRequiredRoute = ({ children }) => {
  const location = useLocation();

  const {
    workspaces,
    currentWorkspace,
    getMyWorkspacesStatus,
    getMyWorkspaces,
  } = useWorkspace();

  const isLoading = getMyWorkspacesStatus === API_STATUS.LOADING;
  const hasFetched = getMyWorkspacesStatus === API_STATUS.SUCCESS;
  const hasWorkspace =
    Boolean(currentWorkspace) || Boolean(workspaces && workspaces.length > 0);

  useEffect(() => {
    if (
      getMyWorkspacesStatus === API_STATUS.IDLE ||
      getMyWorkspacesStatus === API_STATUS.ERROR
    ) {
      getMyWorkspaces();
    }
  }, [getMyWorkspacesStatus, getMyWorkspaces]);

  if (isLoading || !hasFetched) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-sm font-medium text-text-muted">
          Loading workspace...
        </div>
      </div>
    );
  }

  if (!hasWorkspace) {
    return (
      <Navigate
        to={ROUTES.CREATE_WORKSPACE}
        replace
        state={{ from: location }}
      />
    );
  }

  return children || <Outlet />;
};

export default WorkspaceRequiredRoute;
