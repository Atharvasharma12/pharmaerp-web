// src/layouts/app/AppLayout.jsx

import { useEffect, useRef, useState } from "react";

import { useIsMobile } from "@/hooks";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";
import useUser from "@/features/user/hooks/useUser";
import useAccessControl from "@/features/access-control/hooks/useAccessControl";
import { ScrollToTop } from "@/components";
import { UIToastContainer } from "@/components/ui";
import { AnimatePresence } from "framer-motion";

import AppDesktopLayout from "./desktop/AppDesktopLayout";
import AppMobileLayout from "./mobile/AppMobileLayout";
import PremiumAppLoader from "./components/loader/PremiumAppLoader";

const getWorkspaceFromItem = (item) => {
  return item?.workspace || item || null;
};

const AppLayout = () => {
  const isMobile = useIsMobile();

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
  const { getMyAccess } = useAccessControl();

  // STRATEGY: If Redux is populated, we are routing (skip loading). If empty, we are reloading (show loader).
  const isHardRefresh = !currentWorkspace?._id || !currentCompany?._id;
  const [isSyncComplete, setIsSyncComplete] = useState(!isHardRefresh);

  const initializedRef = useRef(false);

  // ONE SINGLE EFFECT TO HYDRATE CORE CONTEXT IN PERFECT SEQUENTIAL ORDER
  useEffect(() => {
    // If we are navigating or already booted this session, unlock instantly and exit
    if (!isHardRefresh || initializedRef.current) {
      setIsSyncComplete(true);
      return;
    }

    initializedRef.current = true;

    const bootApplicationContext = async () => {
      try {
        // STEP 1: Await source-of-truth active identifiers from database
        const activeContext = await getActiveContext().catch(() => null);

        const targetWorkspaceId =
          activeContext?.workspaceId ||
          user?.activeContext?.workspaceId ||
          null;
        const targetCompanyId =
          activeContext?.companyId || user?.activeContext?.companyId || null;
        const targetBranchId =
          activeContext?.branchId || user?.activeContext?.branchId || null;

        // STEP 2: Resolve Workspace Array
        const workspaceItems = workspaces?.length
          ? workspaces
          : await getMyWorkspaces();
        const selectedWorkspaceItem =
          workspaceItems?.find(
            (item) => getWorkspaceFromItem(item)?._id === targetWorkspaceId,
          ) || workspaceItems?.[0];

        const selectedWorkspace = getWorkspaceFromItem(selectedWorkspaceItem);
        if (selectedWorkspace?._id) {
          setCurrentWorkspace(selectedWorkspace);
        }

        // STEP 3: Resolve Company Array
        if (selectedWorkspace?._id) {
          const companyItems = await getWorkspaceCompanies();
          const selectedCompany =
            companyItems?.find((company) => company?._id === targetCompanyId) ||
            companyItems?.[0] ||
            null;

          if (selectedCompany?._id) {
            setCurrentCompany(selectedCompany);

            // STEP 4: Resolve Branch Array (Only attempts if a valid company exists)
            const branchItems = await getCompanyBranches();
            const selectedBranch =
              branchItems?.find((branch) => branch?._id === targetBranchId) ||
              branchItems?.[0] ||
              null;

            if (selectedBranch?._id) {
              setCurrentBranch(selectedBranch);
            } else {
              clearCurrentBranch();
            }
          } else {
            clearCurrentCompany();
            clearCurrentBranch();
          }
        }

        // UNLOCK GATE: Everything resolved in sequential order safely!
        // Load the current user's permissions (non-blocking — errors fail silently)
        getMyAccess().catch(() => null);

        setIsSyncComplete(true);
      } catch (error) {
        console.error(
          "Critical failure during layout initialization sync:",
          error,
        );
        setIsSyncComplete(true); // Fail-safe to prevent hard UI freezes
      }
    };

    bootApplicationContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHardRefresh]);

  return (
    <>
      <ScrollToTop />
      <UIToastContainer position="bottom-right" />
      <AnimatePresence mode="wait">
        {!isSyncComplete ? (
          <PremiumAppLoader key="loader" />
        ) : (
          isMobile ? <AppMobileLayout key="mobile" /> : <AppDesktopLayout key="desktop" />
        )}
      </AnimatePresence>
    </>
  );
};

export default AppLayout;
