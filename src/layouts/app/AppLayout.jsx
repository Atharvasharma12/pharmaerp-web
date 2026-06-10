// src/layouts/app/AppLayout.jsx

import { useEffect, useRef } from "react";

import { useIsMobile } from "@/hooks";
import { storage } from "@/utils";

import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";
import useUser from "@/features/user/hooks/useUser";

import AppDesktopLayout from "./desktop/AppDesktopLayout";
import AppMobileLayout from "./mobile/AppMobileLayout";

import {
  WORKSPACE_STORAGE_KEY,
  COMPANY_STORAGE_KEY,
  BRANCH_STORAGE_KEY,
} from "@/constants";

const getWorkspaceFromItem = (item) => {
  return item?.workspace || item || null;
};

const AppLayout = () => {
  const isMobile = useIsMobile();

  const initializedWorkspaceRef = useRef(false);
  const initializedCompanyWorkspaceRef = useRef(null);
  const initializedBranchCompanyRef = useRef(null);

  const { user, getActiveContext } = useUser();

  const { workspaces, currentWorkspace, getMyWorkspaces, setCurrentWorkspace } =
    useWorkspace();

  const {
    companies,
    currentCompany,
    getWorkspaceCompanies,
    setCurrentCompany,
    clearCurrentCompany,
  } = useCompany();

  const {
    branches,
    currentBranch,
    getCompanyBranches,
    setCurrentBranch,
    clearCurrentBranch,
  } = useBranch();

  // 1. WORKSPACE INITIALIZATION
  useEffect(() => {
    if (initializedWorkspaceRef.current) return;
    initializedWorkspaceRef.current = true;

    const initWorkspaces = async () => {
      try {
        const activeContext = await getActiveContext().catch(() => null);

        const activeWorkspaceId =
          activeContext?.workspaceId ||
          user?.activeContext?.workspaceId ||
          storage.get(WORKSPACE_STORAGE_KEY);

        const activeCompanyId =
          activeContext?.companyId ||
          user?.activeContext?.companyId ||
          storage.get(COMPANY_STORAGE_KEY);

        const activeBranchId =
          activeContext?.branchId ||
          user?.activeContext?.branchId ||
          storage.get(BRANCH_STORAGE_KEY);

        if (activeWorkspaceId) {
          storage.set(WORKSPACE_STORAGE_KEY, activeWorkspaceId);
        } else {
          storage.remove(WORKSPACE_STORAGE_KEY);
        }

        if (activeCompanyId) {
          storage.set(COMPANY_STORAGE_KEY, activeCompanyId);
        } else {
          storage.remove(COMPANY_STORAGE_KEY);
        }

        if (activeBranchId) {
          storage.set(BRANCH_STORAGE_KEY, activeBranchId);
        } else {
          storage.remove(BRANCH_STORAGE_KEY);
        }

        const workspaceItems = workspaces?.length
          ? workspaces
          : await getMyWorkspaces();

        const savedWorkspaceId = storage.get(WORKSPACE_STORAGE_KEY);

        const selectedWorkspaceItem =
          workspaceItems?.find((item) => {
            const workspace = getWorkspaceFromItem(item);
            return workspace?._id === savedWorkspaceId;
          }) || workspaceItems?.[0];

        const selectedWorkspace = getWorkspaceFromItem(selectedWorkspaceItem);

        if (!selectedWorkspace?._id) return;

        if (currentWorkspace?._id !== selectedWorkspace._id) {
          setCurrentWorkspace(selectedWorkspace);
        }
      } catch (error) {
        console.error("Failed to initialize workspaces:", error);
      }
    };

    initWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. FIXED COMPANY INITIALIZATION
  useEffect(() => {
    const workspaceId = currentWorkspace?._id;
    if (!workspaceId) return;

    if (initializedCompanyWorkspaceRef.current === workspaceId) return;
    initializedCompanyWorkspaceRef.current = workspaceId;

    const initCompanies = async () => {
      try {
        const companyItems = companies?.length
          ? companies
          : await getWorkspaceCompanies();

        const savedCompanyId = storage.get(COMPANY_STORAGE_KEY);

        const selectedCompany =
          companyItems?.find((company) => company?._id === savedCompanyId) ||
          companyItems?.[0] ||
          null;

        if (!selectedCompany?._id) {
          if (currentCompany?._id) clearCurrentCompany();
          if (currentBranch?._id) clearCurrentBranch();
          return;
        }

        // FIXED: Enforce absolute checking across standard string IDs to protect active page operations
        if (currentCompany?._id !== selectedCompany._id) {
          setCurrentCompany(selectedCompany);
        }
      } catch (error) {
        console.error("Failed to initialize companies:", error);
      }
    };

    initCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace?._id]);

  // 3. FIXED BRANCH INITIALIZATION
  useEffect(() => {
    const companyId = currentCompany?._id;
    if (!companyId) return;

    if (initializedBranchCompanyRef.current === companyId) return;
    initializedBranchCompanyRef.current = companyId;

    const initBranches = async () => {
      try {
        const branchItems = branches?.length
          ? branches
          : await getCompanyBranches();

        const savedBranchId = storage.get(BRANCH_STORAGE_KEY);

        const selectedBranch =
          branchItems?.find((branch) => branch?._id === savedBranchId) ||
          branchItems?.[0] ||
          null;

        if (!selectedBranch?._id) {
          if (currentBranch?._id) clearCurrentBranch();
          return;
        }

        // FIXED: Enforce string ID comparison block matching corporate metrics
        if (currentBranch?._id !== selectedBranch._id) {
          setCurrentBranch(selectedBranch);
        }
      } catch (error) {
        console.error("Failed to initialize branches:", error);
      }
    };

    initBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCompany?._id]);

  return isMobile ? <AppMobileLayout /> : <AppDesktopLayout />;
};

export default AppLayout;
