// src/features/workspace/components/MemberAccessModal.jsx

import React, { useState, useMemo, useCallback } from "react";
import {
  Building2,
  GitBranch,
  Search,
  Check,
  ShieldCheck,
  Store,
  Layers,
  Sparkles,
  CheckCheck,
  XCircle,
  MapPin,
} from "lucide-react";

import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UISwitch,
  UIBadge,
  UISearchInput,
  UISkeleton,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export default function MemberAccessModal({
  isOpen,
  onClose,
  onSave,
  displayName,
  companies = [],
  branches = [],
  accessFormData = {
    accessAllCompanies: false,
    accessAllBranches: false,
    companyIds: [],
    branchIds: [],
  },
  setAccessFormData,
  isLoadingAccess = false,
  isLoading = false,
}) {
  const [companySearch, setCompanySearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");

  const getBranchCompanyId = useCallback((b) => {
    if (!b) return "";
    const raw =
      b.companyId?._id ||
      b.companyId ||
      b.company?._id ||
      b.company ||
      b.company_id ||
      "";
    return String(raw).trim();
  }, []);

  const getBranchCompanyName = useCallback(
    (b) => {
      const compId = getBranchCompanyId(b);
      const comp = companies.find((c) => String(c._id).trim() === compId);
      return comp?.name || b.companyName || b.company?.name || "Store";
    },
    [companies, getBranchCompanyId]
  );

  // Set of selected company IDs (clean strings)
  const selectedCompanyIdSet = useMemo(() => {
    return new Set(
      (accessFormData.companyIds || []).map((id) =>
        String(id?._id || id).trim()
      )
    );
  }, [accessFormData.companyIds]);

  // Instant reactive available branches based on ALL selected companies (or all workspace branches if accessAllCompanies)
  const availableBranches = useMemo(() => {
    const allBranches = branches || [];
    if (accessFormData.accessAllCompanies) {
      return allBranches;
    }
    if (selectedCompanyIdSet.size === 0) {
      return [];
    }
    return allBranches.filter((b) => {
      const compId = getBranchCompanyId(b);
      // Show branch if its parent company is among ANY selected company
      return selectedCompanyIdSet.has(compId);
    });
  }, [branches, accessFormData.accessAllCompanies, selectedCompanyIdSet, getBranchCompanyId]);

  // Filtered companies based on search
  const filteredCompanies = useMemo(() => {
    const q = companySearch.trim().toLowerCase();
    if (!q) return companies || [];
    return (companies || []).filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.code?.toLowerCase().includes(q) ||
        c.taxNumber?.toLowerCase().includes(q)
    );
  }, [companies, companySearch]);

  // Filtered branches based on search
  const filteredBranches = useMemo(() => {
    const q = branchSearch.trim().toLowerCase();
    if (!q) return availableBranches;
    return availableBranches.filter(
      (b) =>
        b.name?.toLowerCase().includes(q) ||
        b.code?.toLowerCase().includes(q) ||
        b.branchType?.toLowerCase().includes(q) ||
        getBranchCompanyName(b).toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q) ||
        b.state?.toLowerCase().includes(q)
    );
  }, [availableBranches, branchSearch, getBranchCompanyName]);

  // Handler: Toggle All Companies
  const handleToggleAllCompanies = (isChecked) => {
    setAccessFormData((prev) => ({
      ...prev,
      accessAllCompanies: isChecked,
      companyIds: isChecked ? (companies || []).map((c) => String(c._id).trim()) : [],
      accessAllBranches: isChecked ? prev.accessAllBranches : false,
      branchIds: isChecked ? prev.branchIds : [],
    }));
  };

  // Handler: Toggle Individual Company (Instant Branch Update & Auto-Prune)
  const handleToggleCompany = (companyId, isChecked) => {
    const strCompanyId = String(companyId?._id || companyId).trim();
    setAccessFormData((prev) => {
      const currentCompanyIds = (prev.companyIds || []).map((id) =>
        String(id?._id || id).trim()
      );
      let updatedCompanyIds;

      if (isChecked) {
        updatedCompanyIds = currentCompanyIds.includes(strCompanyId)
          ? currentCompanyIds
          : [...currentCompanyIds, strCompanyId];
      } else {
        updatedCompanyIds = currentCompanyIds.filter(
          (id) => id !== strCompanyId
        );
      }

      // If deselected, immediately prune branches belonging to that deselected company
      const hasAnyCompany = updatedCompanyIds.length > 0;
      const updatedBranchIds = !hasAnyCompany
        ? []
        : isChecked
        ? prev.branchIds || []
        : (prev.branchIds || []).filter((bId) => {
            const rawBId = String(bId?._id || bId).trim();
            const branchObj = (branches || []).find(
              (b) => String(b._id).trim() === rawBId
            );
            if (!branchObj) return true;
            return getBranchCompanyId(branchObj) !== strCompanyId;
          });

      return {
        ...prev,
        companyIds: updatedCompanyIds,
        branchIds: updatedBranchIds,
        accessAllBranches: hasAnyCompany ? prev.accessAllBranches : false,
      };
    });
  };


  // Handler: Toggle All Branches
  const handleToggleAllBranches = (isChecked) => {
    setAccessFormData((prev) => ({
      ...prev,
      accessAllBranches: isChecked,
      branchIds: isChecked ? availableBranches.map((b) => String(b._id).trim()) : [],
    }));
  };

  // Handler: Toggle Individual Branch
  const handleToggleBranch = (branchId, isChecked) => {
    const rawBranchId = String(branchId?._id || branchId).trim();
    setAccessFormData((prev) => {
      const currentBranchIds = (prev.branchIds || []).map((id) =>
        String(id?._id || id).trim()
      );
      return {
        ...prev,
        branchIds: isChecked
          ? currentBranchIds.includes(rawBranchId)
            ? currentBranchIds
            : [...currentBranchIds, rawBranchId]
          : currentBranchIds.filter((id) => id !== rawBranchId),
      };
    });
  };

  // Select all currently visible branches
  const handleSelectAllVisibleBranches = () => {
    const visibleIds = filteredBranches.map((b) => String(b._id).trim());
    setAccessFormData((prev) => {
      const currentIds = (prev.branchIds || []).map((id) => String(id?._id || id).trim());
      return {
        ...prev,
        branchIds: Array.from(new Set([...currentIds, ...visibleIds])),
      };
    });
  };

  // Clear all selected branches
  const handleClearAllBranches = () => {
    setAccessFormData((prev) => ({
      ...prev,
      branchIds: [],
    }));
  };

  const selectedCompaniesCount = accessFormData.accessAllCompanies
    ? companies.length
    : accessFormData.companyIds?.length || 0;

  const selectedBranchesCount = accessFormData.accessAllBranches
    ? availableBranches.length
    : accessFormData.branchIds?.length || 0;

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="max-w-[620px]"
    >
      {/* Modal Header */}
      <UIModalHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-2xs">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <UIModalTitle className="text-base sm:text-lg">
              Manage Member Store Access
            </UIModalTitle>
            <UIModalDescription className="text-xs mt-0.5">
              Authorize company clearances and physical branch operations for{" "}
              <strong className="text-text font-semibold">{displayName}</strong>.
            </UIModalDescription>
          </div>
        </div>
      </UIModalHeader>

      {/* Modal Body with Scrollable Clearance Cards */}
      <UIModalBody className="space-y-4 py-4 max-h-[64vh] overflow-y-auto">
        {isLoadingAccess ? (
          <div className="space-y-4 py-1">
            {/* Section 1 Skeleton */}
            <div className="bg-surface-alt/70 rounded-2xl p-3.5 sm:p-4 border border-border/60 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-border/40">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <UISkeleton className="h-4 w-32 rounded" />
                    <UISkeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <UISkeleton className="h-3 w-48 rounded" />
                </div>
                <UISkeleton className="h-6 w-12 rounded-full shrink-0" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-border/60 bg-surface flex items-center justify-between gap-2"
                  >
                    <div className="space-y-1.5 flex-1">
                      <UISkeleton className="h-3.5 w-24 rounded" />
                      <UISkeleton className="h-2.5 w-16 rounded" />
                    </div>
                    <UISkeleton className="h-5 w-9 rounded-full shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2 Skeleton */}
            <div className="bg-surface-alt/70 rounded-2xl p-3.5 sm:p-4 border border-border/60 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-border/40">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <UISkeleton className="h-4 w-36 rounded" />
                    <UISkeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <UISkeleton className="h-3 w-52 rounded" />
                </div>
                <UISkeleton className="h-6 w-12 rounded-full shrink-0" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-border/60 bg-surface flex items-center justify-between gap-2"
                  >
                    <div className="space-y-1.5 flex-1">
                      <UISkeleton className="h-3.5 w-28 rounded" />
                      <UISkeleton className="h-2.5 w-20 rounded" />
                    </div>
                    <UISkeleton className="h-5 w-9 rounded-full shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* SECTION 1: Company Clearance */}
            <div className="bg-surface-alt/70 rounded-2xl p-3.5 sm:p-4 border border-border/60 space-y-3.5 shadow-2xs">
              {/* Master Company Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-border/40">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-primary shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-text">
                      Company Clearance
                    </span>
                    <UIBadge
                      variant="soft"
                      color={selectedCompaniesCount > 0 ? "primary" : "neutral"}
                      size="xs"
                    >
                      {accessFormData.accessAllCompanies
                        ? "All Authorized"
                        : `${selectedCompaniesCount} / ${companies.length} Selected`}
                    </UIBadge>
                  </div>
                  <p className="text-[11.5px] text-text-muted">
                    Authorize access across all corporate entities or pick specific companies.
                  </p>
                </div>

                <div className="shrink-0">
                  <UISwitch
                    checked={accessFormData.accessAllCompanies}
                    onChange={handleToggleAllCompanies}
                    label={accessFormData.accessAllCompanies ? "All Companies" : "Custom Scopes"}
                    size="sm"
                  />
                </div>
              </div>

              {/* Individual Companies Grid */}
              {!accessFormData.accessAllCompanies && (
                <div className="space-y-2.5 pt-0.5">
                  {companies.length > 3 && (
                    <UISearchInput
                      placeholder="Search company name, code or tax ID..."
                      value={companySearch}
                      onChange={(e) => setCompanySearch(e.target.value)}
                      onClear={() => setCompanySearch("")}
                      size="sm"
                    />
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {filteredCompanies.map((comp) => {
                      const isChecked = selectedCompanyIdSet.has(String(comp._id).trim());
                      return (
                        <div
                          key={comp._id}
                          onClick={() => handleToggleCompany(comp._id, !isChecked)}
                          className={cn(
                            "p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer select-none",
                            isChecked
                              ? "bg-surface border-primary/50 ring-1 ring-primary/25 shadow-xs"
                              : "bg-surface/75 border-border/60 hover:bg-surface hover:border-border"
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-text truncate block">
                              {comp.name}
                            </span>
                            <span className="text-[10.5px] text-text-muted font-mono truncate block mt-0.5">
                              {comp.taxNumber || comp.code || "Active Pharmacy Entity"}
                            </span>
                          </div>

                          <div onClick={(e) => e.stopPropagation()}>
                            <UISwitch
                              checked={isChecked}
                              onChange={(checked) => handleToggleCompany(comp._id, checked)}
                              size="sm"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: Dynamic Branch Clearance */}
            <div className="bg-surface-alt/70 rounded-2xl p-3.5 sm:p-4 border border-border/60 space-y-3.5 shadow-2xs">
              {/* Master Branch Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-border/40">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <GitBranch className="size-4 text-primary shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-text">
                      Dispensary & Branch Operations
                    </span>
                    <UIBadge
                      variant="soft"
                      color={availableBranches.length > 0 ? "success" : "neutral"}
                      size="xs"
                    >
                      {accessFormData.accessAllBranches
                        ? "All Authorized"
                        : `${selectedBranchesCount} / ${availableBranches.length} Selected`}
                    </UIBadge>
                  </div>
                  <p className="text-[11.5px] text-text-muted">
                    Assign point-of-sale and prescription fulfillment counters.
                  </p>
                </div>

                <div className="shrink-0">
                  <UISwitch
                    checked={accessFormData.accessAllBranches}
                    onChange={handleToggleAllBranches}
                    label={accessFormData.accessAllBranches ? "All Branches" : "Custom Selection"}
                    size="sm"
                    disabled={availableBranches.length === 0}
                  />
                </div>
              </div>

              {/* Branch List / Empty State */}
              {!accessFormData.accessAllBranches && (
                <div className="space-y-2.5 pt-0.5">
                  {availableBranches.length === 0 ? (
                    <div className="py-7 px-4 text-center bg-surface/75 rounded-xl border border-dashed border-border/80">
                      <Store className="size-7 text-text-muted/60 mx-auto mb-2" />
                      <span className="text-xs font-semibold text-text block">
                        No Company Selected
                      </span>
                      <span className="text-[11px] text-text-muted block mt-0.5 max-w-sm mx-auto">
                        Switch on at least one pharmacy company in the section above to view and assign its operational branches.
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Search and Quick Action Toolbar */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {availableBranches.length > 3 && (
                            <UISearchInput
                              placeholder="Search branch name, code, dispensary..."
                              value={branchSearch}
                              onChange={(e) => setBranchSearch(e.target.value)}
                              onClear={() => setBranchSearch("")}
                              size="sm"
                            />
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
                          <button
                            type="button"
                            onClick={handleSelectAllVisibleBranches}
                            className="px-2 py-1 rounded-md text-primary hover:bg-primary/10 font-semibold transition-colors cursor-pointer select-none"
                          >
                            Select All
                          </button>
                          <span className="text-border">|</span>
                          <button
                            type="button"
                            onClick={handleClearAllBranches}
                            className="px-2 py-1 rounded-md text-text-muted hover:text-text hover:bg-surface-hover font-semibold transition-colors cursor-pointer select-none"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      {/* Branch Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                        {filteredBranches.map((branch) => {
                          const isChecked = (accessFormData.branchIds || []).some(
                            (id) => String(id?._id || id).trim() === String(branch._id).trim()
                          );
                          const compName = getBranchCompanyName(branch);

                          return (
                            <div
                              key={branch._id}
                              onClick={() => handleToggleBranch(branch._id, !isChecked)}
                              className={cn(
                                "p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer select-none",
                                isChecked
                                  ? "bg-surface border-primary/50 ring-1 ring-primary/25 shadow-xs"
                                  : "bg-surface/75 border-border/60 hover:bg-surface hover:border-border"
                              )}
                            >
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-bold text-text truncate block">
                                  {branch.name}
                                </span>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                                    {compName}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-alt font-medium text-text-muted">
                                    {branch.branchType || "Dispensary"}
                                  </span>
                                </div>
                              </div>

                              <div onClick={(e) => e.stopPropagation()}>
                                <UISwitch
                                  checked={isChecked}
                                  onChange={(checked) => handleToggleBranch(branch._id, checked)}
                                  size="sm"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </UIModalBody>

      {/* Sticky Modal Footer */}
      <UIModalFooter className="bg-surface-alt/40 border-t border-border/40 py-3.5 flex items-center justify-between">
        <div className="text-[11.5px] text-text-muted font-medium hidden sm:block">
          <span className="text-text font-bold">{selectedCompaniesCount}</span> companies,{" "}
          <span className="text-text font-bold">{selectedBranchesCount}</span> branches assigned
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <UIButton
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </UIButton>

          <UIButton
            type="button"
            variant="primary"
            size="sm"
            onClick={onSave}
            isLoading={isLoading}
            startIcon={<Check className="size-4" />}
          >
            Save Permissions
          </UIButton>
        </div>
      </UIModalFooter>
    </UIModal>
  );
}
