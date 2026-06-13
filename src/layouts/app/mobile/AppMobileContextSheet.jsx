// src/layouts/app/mobile/AppMobileContextSheet.jsx
import React, { useEffect, useState } from "react";
import {
  FiX,
  FiShoppingBag,
  FiBriefcase,
  FiMapPin,
  FiCheck,
  FiPlus,
  FiChevronRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants";

import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";
import useUser from "@/features/user/hooks/useUser";

const getWorkspaceFromItem = (item) => {
  return item?.workspace || item || null;
};

const AppMobileContextSheet = ({ isOpen, onClose }) => {
  const { updateActiveContext } = useUser();
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();
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

  // Active sub-view tab within the mobile sheet: 'workspace' | 'company' | 'branch'
  const [activeTab, setActiveTab] = useState("company");

  // Keep tab in sync with current level of selection depth when opening
  useEffect(() => {
    if (isOpen) {
      if (!currentWorkspace?._id) setActiveTab("workspace");
      else if (!currentCompany?._id) setActiveTab("company");
      else setActiveTab("branch");
    }
  }, [isOpen, currentWorkspace, currentCompany]);

  if (!isOpen) return null;

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

      // Fetch underlying companies for this brand new workspace context
      await getWorkspaceCompanies();
      setActiveTab("company"); // Advance user sequentially
    } catch (error) {
      console.error("Failed to update mobile workspace context:", error);
    }
  };

  const handleCompanySelect = async (company) => {
    if (!company?._id || !currentWorkspace?._id) return;

    setCurrentCompany(company);
    clearCurrentBranch(); // Reset stale branch from the previous company

    try {
      await updateActiveContext({
        workspaceId: currentWorkspace._id,
        companyId: company._id,
        branchId: null,
      });

      // CRITICAL FIX: Fetch branches specifically mapped to this newly selected company
      await getCompanyBranches();
      setActiveTab("branch"); // Focus forward on branch choices next
    } catch (error) {
      console.error("Failed to transition mobile company context:", error);
    }
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
      onClose(); // Chain-selection complete! Close bottom layout
    } catch (error) {
      console.error("Failed to finalize mobile branch context:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/50 backdrop-blur-xs">
      <div
        className="absolute inset-0 -z-10 animate-fade-in"
        onClick={onClose}
      />

      <div className="flex max-h-[80vh] w-full flex-col rounded-t-2xl bg-surface text-text shadow-2xl transition-transform duration-300">
        {/* Top Header Control Area */}
        <div className="relative border-b border-divider px-4 pt-3 pb-3">
          <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-divider/80" />
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-tight">
              Account Context
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-bg text-text-muted active:scale-95 transition"
            >
              <FiX className="text-sm" />
            </button>
          </div>
        </div>

        {/* Segmented Navigation Tabs */}
        <div className="grid grid-cols-3 border-b border-divider bg-bg/50 p-1 mx-4 mt-3 rounded-lg text-center">
          <button
            type="button"
            onClick={() => setActiveTab("workspace")}
            className={`rounded-md py-1.5 text-[11px] font-semibold transition ${
              activeTab === "workspace"
                ? "bg-surface text-primary shadow-xs"
                : "text-text-muted"
            }`}
          >
            Workspace
          </button>
          <button
            type="button"
            onClick={() => currentWorkspace?._id && setActiveTab("company")}
            disabled={!currentWorkspace?._id}
            className={`rounded-md py-1.5 text-[11px] font-semibold transition ${
              activeTab === "company"
                ? "bg-surface text-primary shadow-xs"
                : "text-text-muted opacity-60"
            }`}
          >
            Company
          </button>
          <button
            type="button"
            onClick={() => currentCompany?._id && setActiveTab("branch")}
            disabled={!currentCompany?._id}
            className={`rounded-md py-1.5 text-[11px] font-semibold transition ${
              activeTab === "branch"
                ? "bg-surface text-primary shadow-xs"
                : "text-text-muted opacity-60"
            }`}
          >
            Branch
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-8">
          {/* TAB 1: WORKSPACES */}
          {activeTab === "workspace" && (
            <div className="space-y-2 animate-fade-in">
              {workspaces?.map((item) => {
                const ws = getWorkspaceFromItem(item);
                const isActive = ws?._id === currentWorkspace?._id;
                return (
                  <button
                    key={ws?._id}
                    type="button"
                    onClick={() => handleWorkspaceSelect(item)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition active:scale-[0.99] ${
                      isActive
                        ? "border-primary bg-primary-soft/30"
                        : "border-divider bg-bg"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-primary text-white" : "bg-surface border border-divider text-text-muted"}`}
                      >
                        <FiShoppingBag className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-bold truncate ${isActive ? "text-primary" : "text-text"}`}
                        >
                          {ws?.name}
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5">
                          {ws?.type || "Workspace Container"}
                        </div>
                      </div>
                    </div>
                    {isActive ? (
                      <FiCheck className="text-primary text-sm shrink-0" />
                    ) : (
                      <FiChevronRight className="text-divider text-sm" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 2: COMPANIES */}
          {activeTab === "company" && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex justify-end mb-1">
                <Link
                  to={ROUTES.CREATE_COMPANY}
                  onClick={onClose}
                  className="text-[11px] font-bold text-primary flex items-center gap-1 bg-primary-soft/50 px-2.5 py-1 rounded-md"
                >
                  <FiPlus /> Add Company
                </Link>
              </div>
              {companies?.length ? (
                companies.map((comp) => {
                  const isActive = comp?._id === currentCompany?._id;
                  return (
                    <button
                      key={comp?._id}
                      type="button"
                      onClick={() => handleCompanySelect(comp)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition active:scale-[0.99] ${
                        isActive
                          ? "border-primary bg-primary-soft/30"
                          : "border-divider bg-bg"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-primary text-white" : "bg-surface border border-divider text-text-muted"}`}
                        >
                          <FiBriefcase className="text-sm" />
                        </div>
                        <div className="min-w-0">
                          <div
                            className={`text-xs font-bold truncate ${isActive ? "text-primary" : "text-text"}`}
                          >
                            {comp?.name}
                          </div>
                          <div className="text-[10px] text-text-muted mt-0.5">
                            {comp?.gstin
                              ? `GSTIN: ${comp.gstin}`
                              : "No Tax ID Assigned"}
                          </div>
                        </div>
                      </div>
                      {isActive ? (
                        <FiCheck className="text-primary text-sm shrink-0" />
                      ) : (
                        <FiChevronRight className="text-divider text-sm" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-text-muted italic">
                  No structural companies found under this workspace context.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BRANCHES */}
          {activeTab === "branch" && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex justify-end mb-1">
                <Link
                  to={ROUTES.CREATE_BRANCH}
                  onClick={onClose}
                  className="text-[11px] font-bold text-primary flex items-center gap-1 bg-primary-soft/50 px-2.5 py-1 rounded-md"
                >
                  <FiPlus /> Add Branch
                </Link>
              </div>
              {branches?.length ? (
                branches.map((br) => {
                  const isActive = br?._id === currentBranch?._id;
                  return (
                    <button
                      key={br?._id}
                      type="button"
                      onClick={() => handleBranchSelect(br)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition active:scale-[0.99] ${
                        isActive
                          ? "border-primary bg-primary-soft/30"
                          : "border-divider bg-bg"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-primary text-white" : "bg-surface border border-divider text-text-muted"}`}
                        >
                          <FiMapPin className="text-sm" />
                        </div>
                        <div className="min-w-0">
                          <div
                            className={`text-xs font-bold truncate ${isActive ? "text-primary" : "text-text"}`}
                          >
                            {br?.name}
                          </div>
                          <div className="text-[10px] text-text-muted mt-0.5">
                            {br?.city || "Standard Location Area"}
                          </div>
                        </div>
                      </div>
                      {isActive && (
                        <FiCheck className="text-primary text-sm shrink-0" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-text-muted italic">
                  No distribution branches registered under this operational
                  company.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppMobileContextSheet;
