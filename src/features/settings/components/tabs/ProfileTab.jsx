// src/features/settings/components/tabs/ProfileTab.jsx

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  ShoppingBag,
  Briefcase,
  GitBranch,
  Check,
  Plus,
  ChevronDown,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { ROUTES } from "@/constants";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";
import useUser from "@/features/user/hooks/useUser";
import useAuth from "@/features/auth/hooks/useAuth";
import { usePermission } from "@/hooks";
import {
  UIButton,
  UIInput,
  UIAlert,
  UICard,
  UICardHeader,
  UICardTitle,
  UICardDescription,
  UICardContent,
  PermissionGate,
} from "@/components/ui";

const getWorkspaceFromItem = (item) => {
  return item?.workspace || item || null;
};

const ProfileTab = () => {
  const fileInputRef = useRef(null);
  const { can } = usePermission();

  // Redux Hooks
  const {
    user: profileUser,
    fetchProfile,
    fetchActiveContext,
    updateProfile,
    updateAvatar,
    deleteAvatar,
  } = useUser();
  const { user: authUser, changePassword } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const user = profileUser || authUser;

  // Profile Form State initialized from real Redux user data
  const [profileData, setProfileData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [profileErrorMsg, setProfileErrorMsg] = useState("");

  // Fetch fresh profile from backend on mount
  useEffect(() => {
    fetchProfile?.().catch(() => null);
    fetchActiveContext?.().catch(() => null);
  }, []);

  // Sync state with Redux user object
  useEffect(() => {
    if (user) {
      const fullName = user.fullName || user.name || "";
      const nameParts = fullName.trim().split(" ");
      const firstName = user.firstName || nameParts[0] || "";
      const lastName = user.lastName || nameParts.slice(1).join(" ") || "";
      const resolvedRole =
        user.roleName ||
        user.role?.name ||
        user.role ||
        (Array.isArray(user.roles) ? user.roles[0]?.name || user.roles[0] : null) ||
        "Member";

      setProfileData({
        name: firstName,
        surname: lastName,
        email: user.email || "",
        phone: user.phone || user.phoneNumber || "",
        role: String(resolvedRole).toUpperCase(),
        avatar: user.avatarUrl || user.avatar || "",
      });
      setAvatarPreview(user.avatarUrl || user.avatar || null);
    }
  }, [user]);

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
    setProfileErrorMsg("");
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Upload to backend via Redux thunk
    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploadingAvatar(true);
    setProfileErrorMsg("");
    try {
      await updateAvatar(formData);
      setProfileSuccessMsg("Profile photo updated successfully!");
      setTimeout(() => setProfileSuccessMsg(""), 3500);
    } catch (err) {
      setProfileErrorMsg(err || "Failed to upload profile photo");
      setAvatarPreview(profileData.avatar || null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleDeletePhoto = async () => {
    setIsUploadingAvatar(true);
    setProfileErrorMsg("");
    try {
      await deleteAvatar();
      setAvatarPreview(null);
      setProfileData((prev) => ({ ...prev, avatar: "" }));
      setProfileSuccessMsg("Profile photo removed successfully!");
      setTimeout(() => setProfileSuccessMsg(""), 3500);
    } catch (err) {
      setProfileErrorMsg(err || "Failed to remove profile photo");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileErrorMsg("");
    setProfileSuccessMsg("");

    const fullName = `${profileData.name} ${profileData.surname}`.trim();
    const payload = {
      fullName,
      phone: profileData.phone,
    };

    try {
      await updateProfile(payload);
      setProfileSuccessMsg("Profile information updated successfully!");
      setTimeout(() => setProfileSuccessMsg(""), 3500);
    } catch (err) {
      setProfileErrorMsg(err || "Failed to update profile information");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccessMsg("");

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
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordSuccessMsg("Password changed successfully!");
      setTimeout(() => setPasswordSuccessMsg(""), 3500);
    } catch (err) {
      setPasswordError(err || "Failed to update password. Please verify current password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const displayName = `${profileData.name} ${profileData.surname}`.trim() || user?.email || "User";

  return (
    <div className="space-y-4">
      {/* ── CARD 1: Active Workspace Info (Non-Selectable Card) ── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="pb-3 border-b border-border/60 mb-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
                Active Workspace
              </UICardTitle>
              <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
                Current organization environment and tenant configuration
              </UICardDescription>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-success/10 border border-success/20 px-3 py-1 text-xs font-semibold text-success">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
              Active Workspace
            </span>
          </div>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface-alt/40 p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary font-bold">
                <ShoppingBag size={18} />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-text-muted">Workspace Name</span>
                <span className="block truncate text-xs font-bold text-text">
                  {currentWorkspace?.name || "Workspace"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface-alt/40 p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-info/10 text-info font-bold font-mono text-xs">
                #
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-text-muted">Workspace Code</span>
                <span className="block truncate text-xs font-mono font-bold text-text">
                  {currentWorkspace?.workspaceCode || "WS-ENTERPRISE"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface-alt/40 p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success font-bold">
                <Check size={16} />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-text-muted">Subscription Tier</span>
                <span className="block truncate text-xs font-bold text-text">
                  Free Tier Active
                </span>
              </div>
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
              Update your personal details and account photo
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
            {profileErrorMsg && (
              <UIAlert
                type="error"
                variant="soft"
                className="mb-4 p-3 rounded-[10px] text-xs"
              >
                {profileErrorMsg}
              </UIAlert>
            )}
          </AnimatePresence>

          {/* User Photo & Info Row */}
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={displayName}
                  className="size-14 rounded-full object-cover ring-2 ring-border transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg ring-2 ring-border transition-transform group-hover:scale-105">
                  {profileData.name?.[0]?.toUpperCase() || <UserIcon size={22} />}
                </div>
              )}

              <div className="absolute -bottom-0.5 -right-0.5 flex size-5.5 items-center justify-center rounded-full bg-primary text-primary-contrast shadow-xs ring-2 ring-surface transition-transform group-hover:scale-110">
                <Camera size={11} />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={isUploadingAvatar}
              />
            </div>

            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-text">
                {displayName}
              </h3>
              <span className="text-xs text-text-muted">
                {profileData.role}
              </span>
              <div className="mt-0.5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  disabled={isUploadingAvatar}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover hover:underline cursor-pointer"
                >
                  <Camera size={12} />
                  <span>{isUploadingAvatar ? "Uploading..." : "Change photo"}</span>
                </button>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    disabled={isUploadingAvatar}
                    className="flex items-center gap-1 text-xs font-semibold text-error hover:underline cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Inputs Form */}
          <form onSubmit={handleSaveProfile} className="mt-4 space-y-3.5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <UIInput
                id="profile-name"
                name="name"
                label="First Name"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="First name"
                required
              />
              <UIInput
                id="profile-surname"
                name="surname"
                label="Last Name"
                value={profileData.surname}
                onChange={handleProfileChange}
                placeholder="Last name"
              />
            </div>

            <UIInput
              id="profile-email"
              name="email"
              type="email"
              label="Email address"
              value={profileData.email}
              readOnly
              helperText="Email is associated with your login credentials"
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
                label="Assigned Role"
                value={profileData.role}
                readOnly
                helperText="Managed by workspace access control"
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
                disabled={!passwordData.currentPassword || !passwordData.newPassword}
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
