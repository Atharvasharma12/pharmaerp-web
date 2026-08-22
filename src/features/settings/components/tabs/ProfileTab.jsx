import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  ShoppingBag,
  Briefcase,
  GitBranch,
  Check,
  Plus,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { ROUTES } from "@/constants";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";
import useUser from "@/features/user/hooks/useUser";
import {
  UIButton,
  UIInput,
  UIAlert,
  UICard,
  UICardHeader,
  UICardTitle,
  UICardDescription,
  UICardContent,
} from "@/components/ui";

const getWorkspaceFromItem = (item) => {
  return item?.workspace || item || null;
};

const ProfileTab = () => {
  const fileInputRef = useRef(null);

  // Context Hooks
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const { companies, currentCompany, setCurrentCompany, clearCurrentCompany } = useCompany();
  const { branches, currentBranch, setCurrentBranch, clearCurrentBranch } = useBranch();
  const { updateActiveContext } = useUser();

  // Dropdown Open States
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: "Anna",
    surname: "Schulz",
    email: "anna@storeadmin.com",
    phone: "+1 (555) 000-0000",
    role: "Store Admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordError("");
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileData((prev) => ({ ...prev, avatar: url }));
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      setProfileSuccessMsg("Profile information updated successfully!");
      setTimeout(() => setProfileSuccessMsg(""), 3500);
    }, 500);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      setPasswordError("Please enter your current password");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordSuccessMsg("Password changed successfully!");
      setTimeout(() => setPasswordSuccessMsg(""), 3500);
    }, 600);
  };

  // Context Switch Handlers
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
    setWorkspaceMenuOpen(false);
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
    setCompanyMenuOpen(false);
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
    setBranchMenuOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* ── CARD 1: Active Organization & Context ─────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="pb-3 border-b border-border/60 mb-0">
          <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
            Active Organization & Store Context
          </UICardTitle>
          <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
            Switch your active workspace, operating company, and active dispensary branch
          </UICardDescription>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {/* Workspace Selector */}
            <div className="relative">
              <label className="mb-1.5 block text-xs font-semibold text-text">
                Active Workspace
              </label>
              <button
                type="button"
                onClick={() => {
                  setWorkspaceMenuOpen(!workspaceMenuOpen);
                  setCompanyMenuOpen(false);
                  setBranchMenuOpen(false);
                }}
                className="flex w-full items-center justify-between gap-2.5 rounded-[12px] border border-border bg-surface px-3.5 py-2.5 text-left text-xs transition hover:border-border-strong hover:bg-surface-hover cursor-pointer"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-primary-soft text-primary">
                    <ShoppingBag size={15} />
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate font-bold text-text">
                      {currentWorkspace?.name || "Select Workspace"}
                    </span>
                    <span className="block text-[10px] text-text-muted">
                      {currentWorkspace?.type || "Workspace"}
                    </span>
                  </div>
                </div>
                <ChevronDown size={14} className="shrink-0 text-text-muted" />
              </button>

              {workspaceMenuOpen && (
                <div className="absolute left-0 top-[102%] z-30 w-full min-w-[240px] rounded-[12px] border border-border bg-surface p-1.5 shadow-[var(--app-shadow-lg)]">
                  <div className="max-h-[200px] overflow-y-auto space-y-1">
                    {workspaces?.length ? (
                      workspaces.map((item) => {
                        const ws = getWorkspaceFromItem(item);
                        const isSelected = ws?._id === currentWorkspace?._id;
                        return (
                          <button
                            key={ws?._id}
                            type="button"
                            onClick={() => handleWorkspaceSelect(item)}
                            className={`flex w-full items-center justify-between gap-2 rounded-[8px] px-2.5 py-2 text-left text-xs transition cursor-pointer ${
                              isSelected
                                ? "bg-primary-soft text-primary font-semibold"
                                : "text-text hover:bg-surface-hover"
                            }`}
                          >
                            <span className="truncate">{ws?.name || "Untitled Workspace"}</span>
                            {isSelected && <Check size={13} />}
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-2 text-center text-xs text-text-muted">No workspaces available</div>
                    )}
                  </div>
                  <div className="my-1.5 border-t border-border/60" />
                  <Link
                    to={ROUTES.WORKSPACE}
                    onClick={() => setWorkspaceMenuOpen(false)}
                    className="flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary-soft"
                  >
                    <Plus size={13} />
                    <span>Workspace Settings</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Company Selector */}
            <div className="relative">
              <label className="mb-1.5 block text-xs font-semibold text-text">
                Active Company
              </label>
              <button
                type="button"
                onClick={() => {
                  setCompanyMenuOpen(!companyMenuOpen);
                  setWorkspaceMenuOpen(false);
                  setBranchMenuOpen(false);
                }}
                className="flex w-full items-center justify-between gap-2.5 rounded-[12px] border border-border bg-surface px-3.5 py-2.5 text-left text-xs transition hover:border-border-strong hover:bg-surface-hover cursor-pointer"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-primary-soft text-primary">
                    <Briefcase size={15} />
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate font-bold text-text">
                      {currentCompany?.name || "Select Company"}
                    </span>
                    <span className="block text-[10px] text-text-muted">
                      {currentCompany?.gstin || "Company"}
                    </span>
                  </div>
                </div>
                <ChevronDown size={14} className="shrink-0 text-text-muted" />
              </button>

              {companyMenuOpen && (
                <div className="absolute left-0 top-[102%] z-30 w-full min-w-[240px] rounded-[12px] border border-border bg-surface p-1.5 shadow-[var(--app-shadow-lg)]">
                  <div className="max-h-[200px] overflow-y-auto space-y-1">
                    {companies?.length ? (
                      companies.map((comp) => {
                        const isSelected = comp?._id === currentCompany?._id;
                        return (
                          <button
                            key={comp?._id}
                            type="button"
                            onClick={() => handleCompanySelect(comp)}
                            className={`flex w-full items-center justify-between gap-2 rounded-[8px] px-2.5 py-2 text-left text-xs transition cursor-pointer ${
                              isSelected
                                ? "bg-primary-soft text-primary font-semibold"
                                : "text-text hover:bg-surface-hover"
                            }`}
                          >
                            <span className="truncate">{comp?.name || "Untitled Company"}</span>
                            {isSelected && <Check size={13} />}
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-2 text-center text-xs text-text-muted">No companies found</div>
                    )}
                  </div>
                  <div className="my-1.5 border-t border-border/60" />
                  <Link
                    to={ROUTES.COMPANIES}
                    onClick={() => setCompanyMenuOpen(false)}
                    className="flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary-soft"
                  >
                    <Plus size={13} />
                    <span>Manage Companies</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Branch Selector */}
            <div className="relative">
              <label className="mb-1.5 block text-xs font-semibold text-text">
                Active Branch
              </label>
              <button
                type="button"
                onClick={() => {
                  setBranchMenuOpen(!branchMenuOpen);
                  setWorkspaceMenuOpen(false);
                  setCompanyMenuOpen(false);
                }}
                className="flex w-full items-center justify-between gap-2.5 rounded-[12px] border border-border bg-surface px-3.5 py-2.5 text-left text-xs transition hover:border-border-strong hover:bg-surface-hover cursor-pointer"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-primary-soft text-primary">
                    <GitBranch size={15} />
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate font-bold text-text">
                      {currentBranch?.name || "Select Branch"}
                    </span>
                    <span className="block text-[10px] text-text-muted">
                      {currentBranch?.city || "Dispensary"}
                    </span>
                  </div>
                </div>
                <ChevronDown size={14} className="shrink-0 text-text-muted" />
              </button>

              {branchMenuOpen && (
                <div className="absolute left-0 top-[102%] z-30 w-full min-w-[240px] rounded-[12px] border border-border bg-surface p-1.5 shadow-[var(--app-shadow-lg)]">
                  <div className="max-h-[200px] overflow-y-auto space-y-1">
                    {branches?.length ? (
                      branches.map((br) => {
                        const isSelected = br?._id === currentBranch?._id;
                        return (
                          <button
                            key={br?._id}
                            type="button"
                            onClick={() => handleBranchSelect(br)}
                            className={`flex w-full items-center justify-between gap-2 rounded-[8px] px-2.5 py-2 text-left text-xs transition cursor-pointer ${
                              isSelected
                                ? "bg-primary-soft text-primary font-semibold"
                                : "text-text hover:bg-surface-hover"
                            }`}
                          >
                            <span className="truncate">{br?.name || "Untitled Branch"}</span>
                            {isSelected && <Check size={13} />}
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-2 text-center text-xs text-text-muted">No branches found</div>
                    )}
                  </div>
                  <div className="my-1.5 border-t border-border/60" />
                  <Link
                    to={ROUTES.BRANCHES}
                    onClick={() => setBranchMenuOpen(false)}
                    className="flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary-soft"
                  >
                    <Plus size={13} />
                    <span>Manage Branches</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </UICardContent>
      </UICard>

      {/* ── CARD 2: Profile Information ───────────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60 mb-0">
          <div>
            <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
              Profile Information
            </UICardTitle>
            <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
              Update your personal details and store administrator photo
            </UICardDescription>
          </div>
          <div className="shrink-0">
            <UIButton
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSaveProfile}
              isLoading={isSavingProfile}
              loadingText="Saving..."
            >
              Save changes
            </UIButton>
          </div>
        </UICardHeader>

        <UICardContent className="pt-3.5 space-y-0">
          <AnimatePresence>
            {profileSuccessMsg && (
              <UIAlert
                type="success"
                variant="soft"
                className="mb-4 p-3 rounded-[10px] text-xs"
              >
                {profileSuccessMsg}
              </UIAlert>
            )}
          </AnimatePresence>

          {/* User Photo & Info Row */}
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="size-14 rounded-full object-cover ring-2 ring-border transition-transform group-hover:scale-105"
              />
              <div className="absolute -bottom-0.5 -right-0.5 flex size-5.5 items-center justify-center rounded-full bg-primary text-primary-contrast shadow-xs ring-2 ring-surface transition-transform group-hover:scale-110">
                <Camera size={11} />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>

            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-text">
                {profileData.name} {profileData.surname}
              </h3>
              <span className="text-xs text-text-muted">
                {profileData.role}
              </span>
              <button
                type="button"
                onClick={handlePhotoClick}
                className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover hover:underline cursor-pointer"
              >
                <Camera size={12} />
                <span>Change photo</span>
              </button>
            </div>
          </div>

          {/* Inputs Form */}
          <form onSubmit={handleSaveProfile} className="mt-4 space-y-3.5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <UIInput
                id="profile-name"
                name="name"
                label="Name"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="First name"
                required
              />
              <UIInput
                id="profile-surname"
                name="surname"
                label="Surname"
                value={profileData.surname}
                onChange={handleProfileChange}
                placeholder="Last name"
                required
              />
            </div>

            <UIInput
              id="profile-email"
              name="email"
              type="email"
              label="Email address"
              value={profileData.email}
              onChange={handleProfileChange}
              placeholder="name@example.com"
              required
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <UIInput
                id="profile-phone"
                name="phone"
                label="Phone number"
                value={profileData.phone}
                onChange={handleProfileChange}
                placeholder="+1 (555) 000-0000"
              />
              <UIInput
                id="profile-role"
                name="role"
                label="Role"
                value={profileData.role}
                readOnly
                helperText="Assigned by workspace administrator"
              />
            </div>
          </form>
        </UICardContent>
      </UICard>

      {/* ── CARD 3: Change Password ──────────────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="pb-3 border-b border-border/60 mb-0">
          <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
            Change Password
          </UICardTitle>
          <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
            Set a secure new password for your account
          </UICardDescription>
        </UICardHeader>

        <UICardContent className="pt-3.5 space-y-0">
          <AnimatePresence>
            {passwordSuccessMsg && (
              <UIAlert
                type="success"
                variant="soft"
                className="mb-4 p-3 rounded-[10px] text-xs"
              >
                {passwordSuccessMsg}
              </UIAlert>
            )}
            {passwordError && (
              <UIAlert
                type="error"
                variant="soft"
                className="mb-4 p-3 rounded-[10px] text-xs"
              >
                {passwordError}
              </UIAlert>
            )}
          </AnimatePresence>

          <form onSubmit={handleSavePassword} className="space-y-3.5">
            <UIInput
              id="current-password"
              name="currentPassword"
              type="password"
              showPasswordToggle={true}
              label="Current password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
            />

            <UIInput
              id="new-password"
              name="newPassword"
              type="password"
              showPasswordToggle={true}
              label="New password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password (min 8 characters)"
            />

            <UIInput
              id="confirm-password"
              name="confirmPassword"
              type="password"
              showPasswordToggle={true}
              label="Confirm password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
            />

            <div className="flex justify-end pt-1">
              <UIButton
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSavingPassword}
                disabled={!passwordData.newPassword}
                loadingText="Updating..."
              >
                Update password
              </UIButton>
            </div>
          </form>
        </UICardContent>
      </UICard>
    </div>
  );
};

export default ProfileTab;
