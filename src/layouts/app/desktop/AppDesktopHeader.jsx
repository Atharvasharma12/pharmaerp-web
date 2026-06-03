// src/layouts/app/desktop/AppDesktopHeader.jsx

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiBell,
  FiBriefcase,
  FiCheck,
  FiChevronDown,
  FiGitBranch,
  FiHelpCircle,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiPlus,
  FiSearch,
  FiSettings,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import { AppAvatar, AppIconButton, AppSearchInput } from "@/components";
import ThemeSwitcher from "@/components/shared/theme/ThemeSwitcher";
import { ROUTES } from "@/constants";

import useAuth from "@/features/auth/hooks/useAuth";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";
import useUser from "@/features/user/hooks/useUser";

const SIDEBAR_WIDTH = 230;

const getWorkspaceFromItem = (item) => {
  return item?.workspace || item || null;
};

const AppDesktopHeader = ({ sidebarOpen, onMenuClick }) => {
  const navigate = useNavigate();

  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const workspaceRef = useRef(null);
  const companyRef = useRef(null);
  const branchRef = useRef(null);
  const profileRef = useRef(null);

  const { user, logout, clearCredentials } = useAuth();

  const { updateActiveContext } = useUser();

  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();

  const { companies, currentCompany, setCurrentCompany, clearCurrentCompany } =
    useCompany();

  const { branches, currentBranch, setCurrentBranch, clearCurrentBranch } =
    useBranch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;

      if (!workspaceRef.current?.contains(target)) {
        setWorkspaceOpen(false);
      }

      if (!companyRef.current?.contains(target)) {
        setCompanyOpen(false);
      }

      if (!branchRef.current?.contains(target)) {
        setBranchOpen(false);
      }

      if (!profileRef.current?.contains(target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleWorkspaceSelect = async (workspaceItem) => {
    const workspace = getWorkspaceFromItem(workspaceItem);

    if (!workspace?._id) return;

    setCurrentWorkspace(workspace);
    clearCurrentCompany();
    clearCurrentBranch();

    try {
      await updateActiveContext({
        workspaceId: workspace._id,
        companyId: null,
        branchId: null,
      });
    } catch (error) {
      console.error("Failed to update active workspace context:", error);
    }

    setWorkspaceOpen(false);
    setCompanyOpen(false);
    setBranchOpen(false);
  };

  const handleCompanySelect = async (company) => {
    if (!company?._id || !currentWorkspace?._id) return;

    setCurrentCompany(company);
    clearCurrentBranch();

    try {
      await updateActiveContext({
        workspaceId: currentWorkspace._id,
        companyId: company._id,
        branchId: null,
      });
    } catch (error) {
      console.error("Failed to update active company context:", error);
    }

    setCompanyOpen(false);
    setBranchOpen(false);
  };

  const handleBranchSelect = async (branch) => {
    if (!branch?._id || !currentWorkspace?._id || !currentCompany?._id) return;

    setCurrentBranch(branch);

    try {
      await updateActiveContext({
        workspaceId: currentWorkspace._id,
        companyId: currentCompany._id,
        branchId: branch._id,
      });
    } catch (error) {
      console.error("Failed to update active branch context:", error);
    }

    setBranchOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearCredentials();
      setProfileOpen(false);
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  const currentWorkspaceName = currentWorkspace?.name || "Select Workspace";
  const currentCompanyName = currentCompany?.name || "Select Company";
  const currentBranchName = currentBranch?.name || "Select Branch";

  const userName = user?.name || user?.fullName || "Admin";
  const userRole = user?.role || "Owner";
  const userInitials = userName
    ?.split(" ")
    ?.map((word) => word?.[0])
    ?.join("")
    ?.slice(0, 2)
    ?.toUpperCase();

  return (
    <header
      className="fixed top-0 z-40 h-[58px] border-b border-divider bg-surface/90 backdrop-blur-md transition-all duration-300"
      style={{
        left: sidebarOpen ? SIDEBAR_WIDTH : 0,
        right: 0,
      }}
    >
      <div className="flex h-[58px] w-full items-center justify-between px-5 lg:px-6">
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <AppIconButton
              icon={<FiMenu className="text-[22px]" />}
              onClick={onMenuClick}
              variant="text"
              colorVariant="dark"
              size="medium"
              rounded="lg"
              tooltip="Open Sidebar"
            />
          )}

          <div ref={workspaceRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setWorkspaceOpen((prev) => !prev);
                setCompanyOpen(false);
                setBranchOpen(false);
                setProfileOpen(false);
              }}
              className="flex min-w-[190px] items-center justify-between gap-3 rounded-xl bg-primary-soft/70 px-3 py-2 transition hover:bg-primary-soft"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-[17px] text-primary shadow-sm">
                  <FiShoppingBag />
                </span>

                <span className="min-w-0 text-left">
                  <span className="block truncate text-[13px] font-semibold leading-none text-text">
                    {currentWorkspaceName}
                  </span>

                  <span className="mt-1 block text-[11px] font-normal leading-none text-text-muted">
                    Workspace
                  </span>
                </span>
              </span>

              <FiChevronDown
                className={[
                  "shrink-0 text-[15px] text-text-muted transition-transform duration-200",
                  workspaceOpen ? "rotate-180" : "rotate-0",
                ].join(" ")}
              />
            </button>

            {workspaceOpen && (
              <div className="absolute left-0 top-[46px] z-50 w-[280px] rounded-xl border border-divider bg-surface p-2 shadow-lg">
                <div className="max-h-[260px] overflow-y-auto">
                  {workspaces?.length ? (
                    workspaces.map((item) => {
                      const workspace = getWorkspaceFromItem(item);
                      const isActive =
                        workspace?._id &&
                        workspace._id === currentWorkspace?._id;

                      return (
                        <button
                          key={workspace?._id}
                          type="button"
                          onClick={() => handleWorkspaceSelect(item)}
                          className={[
                            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition",
                            isActive
                              ? "bg-primary-soft text-primary"
                              : "hover:bg-surface-hover",
                          ].join(" ")}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                              <FiShoppingBag />
                            </span>

                            <span className="min-w-0">
                              <span className="block truncate text-[13px] font-semibold text-text">
                                {workspace?.name || "Untitled Workspace"}
                              </span>

                              <span className="mt-0.5 block truncate text-[11px] text-text-muted">
                                {isActive
                                  ? "Current workspace"
                                  : workspace?.type || "Workspace"}
                              </span>
                            </span>
                          </span>

                          {isActive && <FiCheck className="shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-3 text-[12px] text-text-muted">
                      No workspaces found
                    </div>
                  )}
                </div>

                <div className="my-2 h-px bg-divider" />

                <Link
                  to={ROUTES.COMPANIES}
                  onClick={() => setWorkspaceOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text-muted transition hover:bg-surface-hover hover:text-text"
                >
                  <FiBriefcase className="text-[16px]" />
                  Manage Companies
                </Link>

                <Link
                  to={ROUTES.BRANCHES}
                  onClick={() => setWorkspaceOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text-muted transition hover:bg-surface-hover hover:text-text"
                >
                  <FiSettings className="text-[16px]" />
                  Workspace Settings
                </Link>
              </div>
            )}
          </div>

          <div ref={companyRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setCompanyOpen((prev) => !prev);
                setWorkspaceOpen(false);
                setBranchOpen(false);
                setProfileOpen(false);
              }}
              className="flex min-w-[180px] items-center justify-between gap-3 rounded-xl border border-divider bg-bg px-3 py-2 transition hover:bg-surface-hover"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-[17px] text-primary shadow-sm">
                  <FiBriefcase />
                </span>

                <span className="min-w-0 text-left">
                  <span className="block truncate text-[13px] font-semibold leading-none text-text">
                    {currentCompanyName}
                  </span>

                  <span className="mt-1 block text-[11px] font-normal leading-none text-text-muted">
                    Company
                  </span>
                </span>
              </span>

              <FiChevronDown
                className={[
                  "shrink-0 text-[15px] text-text-muted transition-transform duration-200",
                  companyOpen ? "rotate-180" : "rotate-0",
                ].join(" ")}
              />
            </button>

            {companyOpen && (
              <div className="absolute left-0 top-[46px] z-50 w-[280px] rounded-xl border border-divider bg-surface p-2 shadow-lg">
                <div className="max-h-[260px] overflow-y-auto">
                  {companies?.length ? (
                    companies.map((company) => {
                      const isActive =
                        company?._id && company._id === currentCompany?._id;

                      return (
                        <button
                          key={company?._id}
                          type="button"
                          onClick={() => handleCompanySelect(company)}
                          className={[
                            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition",
                            isActive
                              ? "bg-primary-soft text-primary"
                              : "hover:bg-surface-hover",
                          ].join(" ")}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                              <FiBriefcase />
                            </span>

                            <span className="min-w-0">
                              <span className="block truncate text-[13px] font-semibold text-text">
                                {company?.name || "Untitled Company"}
                              </span>

                              <span className="mt-0.5 block truncate text-[11px] text-text-muted">
                                {isActive
                                  ? "Current company"
                                  : company?.gstin ||
                                    company?.type ||
                                    "Company"}
                              </span>
                            </span>
                          </span>

                          {isActive && <FiCheck className="shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-3 text-[12px] text-text-muted">
                      No companies found
                    </div>
                  )}
                </div>

                <div className="my-2 h-px bg-divider" />

                <Link
                  to={ROUTES.CREATE_COMPANY}
                  onClick={() => setCompanyOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-primary transition hover:bg-primary-soft"
                >
                  <FiPlus className="text-[16px]" />
                  Create Company
                </Link>
              </div>
            )}
          </div>

          <div ref={branchRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setBranchOpen((prev) => !prev);
                setWorkspaceOpen(false);
                setCompanyOpen(false);
                setProfileOpen(false);
              }}
              className="flex min-w-[170px] items-center justify-between gap-3 rounded-xl border border-divider bg-bg px-3 py-2 transition hover:bg-surface-hover"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-[17px] text-primary shadow-sm">
                  <FiMapPin />
                </span>

                <span className="min-w-0 text-left">
                  <span className="block truncate text-[13px] font-semibold leading-none text-text">
                    {currentBranchName}
                  </span>

                  <span className="mt-1 block text-[11px] font-normal leading-none text-text-muted">
                    Branch
                  </span>
                </span>
              </span>

              <FiChevronDown
                className={[
                  "shrink-0 text-[15px] text-text-muted transition-transform duration-200",
                  branchOpen ? "rotate-180" : "rotate-0",
                ].join(" ")}
              />
            </button>

            {branchOpen && (
              <div className="absolute left-0 top-[46px] z-50 w-[280px] rounded-xl border border-divider bg-surface p-2 shadow-lg">
                <div className="max-h-[260px] overflow-y-auto">
                  {branches?.length ? (
                    branches.map((branch) => {
                      const isActive =
                        branch?._id && branch._id === currentBranch?._id;

                      return (
                        <button
                          key={branch?._id}
                          type="button"
                          onClick={() => handleBranchSelect(branch)}
                          className={[
                            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition",
                            isActive
                              ? "bg-primary-soft text-primary"
                              : "hover:bg-surface-hover",
                          ].join(" ")}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                              <FiGitBranch />
                            </span>

                            <span className="min-w-0">
                              <span className="block truncate text-[13px] font-semibold text-text">
                                {branch?.name || "Untitled Branch"}
                              </span>

                              <span className="mt-0.5 block truncate text-[11px] text-text-muted">
                                {isActive
                                  ? "Current branch"
                                  : branch?.type || branch?.city || "Branch"}
                              </span>
                            </span>
                          </span>

                          {isActive && <FiCheck className="shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-3 text-[12px] text-text-muted">
                      No branches found
                    </div>
                  )}
                </div>

                <div className="my-2 h-px bg-divider" />

                <Link
                  to={ROUTES.CREATE_BRANCH}
                  onClick={() => setBranchOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-primary transition hover:bg-primary-soft"
                >
                  <FiPlus className="text-[16px]" />
                  Create Branch
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mx-6 flex flex-1 justify-center">
          <AppSearchInput
            placeholder="Search anything... (Ctrl + K)"
            size="small"
            variant="soft"
            rounded="lg"
            startIcon={<FiSearch />}
            sx={{
              width: "100%",
              maxWidth: 440,
            }}
            inputSx={{
              height: 36,
              fontSize: 12,
              borderRadius: "12px",
              backgroundColor: "var(--app-color-bg)",
              boxShadow: "var(--app-shadow-xs)",
            }}
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <AppIconButton
            icon={<FiBell />}
            variant="text"
            colorVariant="dark"
            size="small"
            rounded="lg"
            tooltip="Notifications"
          />

          <Link
            to="/help-center"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium text-text-muted transition hover:bg-surface-hover hover:text-primary"
          >
            <FiHelpCircle className="text-[15px]" />
            <span>Help</span>
          </Link>

          <ThemeSwitcher size="small" />

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((prev) => !prev);
                setWorkspaceOpen(false);
                setCompanyOpen(false);
                setBranchOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-surface-hover"
            >
              <AppAvatar name={userName} initials={userInitials} size="small" />

              <span className="hidden text-left xl:block">
                <span className="block text-[12px] font-semibold leading-none text-text">
                  {userName}
                </span>

                <span className="mt-1 block text-[11px] font-normal leading-none text-text-muted">
                  {userRole}
                </span>
              </span>

              <FiChevronDown
                className={[
                  "hidden text-[15px] text-text-muted transition-transform duration-200 xl:block",
                  profileOpen ? "rotate-180" : "rotate-0",
                ].join(" ")}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[46px] z-50 w-[230px] rounded-xl border border-divider bg-surface p-2 shadow-lg">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                  <AppAvatar
                    name={userName}
                    initials={userInitials}
                    size="medium"
                  />

                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-text">
                      {userName}
                    </div>

                    <div className="mt-0.5 truncate text-[11px] text-text-muted">
                      {userRole}
                    </div>
                  </div>
                </div>

                <div className="my-2 h-px bg-divider" />

                <Link
                  to={ROUTES.PROFILE}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text-muted transition hover:bg-surface-hover hover:text-text"
                >
                  <FiUser className="text-[16px]" />
                  My Profile
                </Link>

                <Link
                  to={ROUTES.SETTINGS}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text-muted transition hover:bg-surface-hover hover:text-text"
                >
                  <FiSettings className="text-[16px]" />
                  Account Settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-error transition hover:bg-error-soft"
                >
                  <FiLogOut className="text-[16px]" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppDesktopHeader;
