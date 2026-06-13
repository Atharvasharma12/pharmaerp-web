// src/layouts/app/mobile/AppMobileHeader.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiMenu, FiChevronDown } from "react-icons/fi";

import { AppAvatar, AppIconButton } from "@/components";
import { ROUTES } from "@/constants";

import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";
import AppMobileContextSheet from "./AppMobileContextSheet";

const AppMobileHeader = ({ onMenuClick }) => {
  const [contextSheetOpen, setContextSheetOpen] = useState(false);

  const { currentWorkspace } = useWorkspace();
  const { currentCompany } = useCompany();
  const { currentBranch } = useBranch();

  // Compute clean text descriptions for context indicators
  const currentWorkspaceName = currentWorkspace?.name || "Select Workspace";
  const currentCompanyName = currentCompany?.name || "Select Company";
  const currentBranchName = currentBranch?.name || "Select Branch";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-divider bg-bg/95 backdrop-blur-md">
        <div className="px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            {/* Sidebar Toggle */}
            <AppIconButton
              icon={<FiMenu className="text-[22px]" />}
              onClick={onMenuClick}
              variant="text"
              colorVariant="dark"
              rounded="lg"
              aria-label="Open menu"
              sx={{
                width: 36,
                height: 36,
                minWidth: 36,
              }}
            />

            {/* Middle Module: Interactive Multi-Context Trigger Selector */}
            <button
              type="button"
              onClick={() => setContextSheetOpen(true)}
              className="flex min-w-0 flex-1 items-center justify-between gap-1.5 rounded-xl border border-divider bg-surface px-2.5 py-1 text-left shadow-xs transition active:bg-surface-hover"
            >
              <div className="min-w-0 flex-1">
                {/* Primary App Context Tier Name */}
                <div className="truncate text-xs font-bold text-text leading-tight">
                  {currentCompanyName !== "Select Company"
                    ? currentCompanyName
                    : currentWorkspaceName}
                </div>

                {/* Context Breadcrumbs Detail Row */}
                <div className="mt-0.5 flex items-center gap-1.5 truncate text-[9px] font-medium text-text-muted leading-none">
                  <span className="truncate max-w-[70px]">
                    {currentWorkspaceName}
                  </span>
                  {currentCompanyName !== "Select Company" && (
                    <>
                      <span className="text-divider">•</span>
                      <span className="truncate max-w-[75px] text-primary">
                        {currentBranchName}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <FiChevronDown className="shrink-0 text-xs text-text-muted" />
            </button>

            {/* Global Utility Controls Actions Segment */}
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl text-text-muted transition active:bg-surface-hover active:text-primary"
              >
                <FiBell className="text-[20px]" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>

              <Link to={ROUTES.PROFILE} className="shrink-0 pl-0.5">
                <AppAvatar name="Admin" initials="AD" size="small" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Sheet Dropdown Overlay Dialog */}
      <AppMobileContextSheet
        isOpen={contextSheetOpen}
        onClose={() => setContextSheetOpen(false)}
      />
    </>
  );
};

export default AppMobileHeader;
