// src/features/dashboard/hooks/useDashboardData.js

import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import dashboardService from "../services/dashboardService";

export const useDashboardData = () => {
  const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace);
  const currentCompany = useSelector((state) => state.company?.currentCompany);
  const currentBranch = useSelector((state) => state.branch?.currentBranch);

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const workspaceId = currentWorkspace?._id;
  const companyId = currentCompany?._id;
  const branchId = currentBranch?._id;

  const isMounted = useRef(true);

  const fetchDashboard = useCallback(async () => {
    if (!companyId || !workspaceId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const overview = await dashboardService.getDashboardOverview();
      if (isMounted.current) {
        setData(overview);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err?.message || "Failed to load live dashboard data");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [workspaceId, companyId, branchId]);

  useEffect(() => {
    isMounted.current = true;
    fetchDashboard();
    return () => {
      isMounted.current = false;
    };
  }, [fetchDashboard]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchDashboard,
    currentWorkspace,
    currentCompany,
    currentBranch,
  };
};

export default useDashboardData;
