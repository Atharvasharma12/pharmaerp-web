// src/layouts/app/AppLayout.jsx

import { useEffect, useRef } from "react";

import { useIsMobile } from "@/hooks";
import { storage } from "@/utils";

import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useCompany from "@/features/company/hooks/useCompany";

import AppDesktopLayout from "./desktop/AppDesktopLayout";
import AppMobileLayout from "./mobile/AppMobileLayout";

const WORKSPACE_STORAGE_KEY = "workspaceId";
const COMPANY_STORAGE_KEY = "companyId";

const getWorkspaceFromItem = (item) => {
  return item?.workspace || item || null;
};

const AppLayout = () => {
  const isMobile = useIsMobile();

  const didInitRef = useRef(false);
  const didInitCompanyRef = useRef(false);

  const { workspaces, currentWorkspace, getMyWorkspaces, setCurrentWorkspace } =
    useWorkspace();

  const {
    companies,
    currentCompany,
    getWorkspaceCompanies,
    setCurrentCompany,
    clearCurrentCompany,
  } = useCompany();

  useEffect(() => {
    if (didInitRef.current) return;

    didInitRef.current = true;

    const initWorkspaces = async () => {
      try {
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

    if (didInitCompanyRef.current) return;

    didInitCompanyRef.current = true;

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
          return;
        }

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

  return isMobile ? <AppMobileLayout /> : <AppDesktopLayout />;
};

export default AppLayout;
