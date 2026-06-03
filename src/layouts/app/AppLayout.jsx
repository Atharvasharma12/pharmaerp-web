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

  const didInitWorkspaceRef = useRef(false);
  const didInitCompanyRef = useRef(false);
  const didInitBranchRef = useRef(false);

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

  useEffect(() => {
    if (didInitWorkspaceRef.current) return;

    didInitWorkspaceRef.current = true;

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

  useEffect(() => {
    const workspaceId = currentWorkspace?._id;

    if (!workspaceId) return;

    didInitCompanyRef.current = false;
    didInitBranchRef.current = false;

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
          clearCurrentCompany();
          clearCurrentBranch();
          return;
        }

        if (currentCompany?._id !== selectedCompany._id) {
          setCurrentCompany(selectedCompany);
        }
      } catch (error) {
        console.error("Failed to initialize companies:", error);
      }
    };

    if (!didInitCompanyRef.current) {
      didInitCompanyRef.current = true;
      initCompanies();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace?._id]);

  useEffect(() => {
    const companyId = currentCompany?._id;

    if (!companyId) return;

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
          clearCurrentBranch();
          return;
        }

        if (currentBranch?._id !== selectedBranch._id) {
          setCurrentBranch(selectedBranch);
        }
      } catch (error) {
        console.error("Failed to initialize branches:", error);
      }
    };

    if (!didInitBranchRef.current) {
      didInitBranchRef.current = true;
      initBranches();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCompany?._id]);

  return isMobile ? <AppMobileLayout /> : <AppDesktopLayout />;
};

export default AppLayout;
