// src/features/settings/components/tabs/ProfileTab.jsx

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  ShoppingBag,
  Briefcase,
  GitBranch,
  Check,
  CheckCircle2,
  Lock,
  User as UserIcon,
  Trash2,
  Calendar,
  Clock,
  Shield,
  Key
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useUser from "@/features/user/hooks/useUser";
import useAuth from "@/features/auth/hooks/useAuth";
import {
  UIButton,
  UIInput,
  UIAlert,
  UIBadge,
  UICard,
  UICardHeader,
  UICardTitle,
  UICardDescription,
  UICardContent,
} from "@/components/ui";
import { cn } from "@/lib/utils";

import ChangePasswordModal from "./ChangePasswordModal";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ProfileTab = () => {
  const fileInputRef = useRef(null);

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
  const { currentWorkspace, workspaces, members, getWorkspaceMembers, getMyWorkspaces } = useWorkspace();

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

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Fetch fresh profile from backend on mount
  useEffect(() => {
    fetchProfile?.().catch(() => null);
    fetchActiveContext?.().catch(() => null);
    if (!workspaces || workspaces.length === 0) {
      getMyWorkspaces?.().catch(() => null);
    }
  }, []);

  // Fetch workspace members to accurately determine role
  useEffect(() => {
    if (currentWorkspace?._id && (!members || members.length === 0)) {
      getWorkspaceMembers?.(currentWorkspace._id).catch(() => null);
    }
  }, [currentWorkspace?._id]);

  // Sync state with Redux user object
  useEffect(() => {
    if (user) {
      const fullName = user.fullName || user.name || "";
      const nameParts = fullName.trim().split(" ");
      const firstName = user.firstName || nameParts[0] || "";
      const lastName = user.lastName || nameParts.slice(1).join(" ") || "";
      
      const activeWorkspaceInfo = workspaces?.find(w => String(w._id) === String(currentWorkspace?._id)) || currentWorkspace;
      const currentMember = members?.find(
        (m) => String(m.userId?._id || m.userId || m.user?._id || m.user) === String(user?._id)
      );

      const resolvedRole =
        currentMember?.isOwner ? "Owner" :
        currentMember?.role?.name ||
        currentMember?.roleName ||
        activeWorkspaceInfo?.isOwner ? "Owner" :
        activeWorkspaceInfo?.roleName ||
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
  }, [user, currentWorkspace, workspaces, members]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileErrorMsg("");
    setProfileData((prev) => ({ ...prev, [name]: value }));
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

  const handleSavePassword = async ({ currentPassword, newPassword }) => {
    setIsSavingPassword(true);
    try {
      await changePassword({
        oldPassword: currentPassword,
        newPassword,
      });
      setIsPasswordModalOpen(false);
      setProfileSuccessMsg("Password changed successfully!");
      setTimeout(() => setProfileSuccessMsg(""), 3500);
    } catch (err) {
      throw err;
    } finally {
      setIsSavingPassword(false);
    }
  };

  const displayName = `${profileData.name} ${profileData.surname}`.trim() || user?.email || "User";
  const userCode = user?.userCode || "";
  const emailVerified = Boolean(user?.emailVerified);
  const phoneVerified = Boolean(user?.phoneVerified);
  const status = user?.isActive !== false ? "active" : "suspended";
  const joinedDate = formatDate(user?.createdAt);
  const lastActiveFormatted = formatDateTime(user?.lastLoginAt);
  const passwordChangedAt = formatDateTime(user?.passwordChangedAt);

  return (
    <div className="space-y-5 max-w-[1440px] mx-auto font-sans">
      
      {/* ── ALERTS FOR PROFILE SAVE ───────────────────────── */}
      <AnimatePresence>
        {profileSuccessMsg && (
          <UIAlert
            type="success"
            variant="soft"
            className="p-3 rounded-xl text-xs shadow-xs"
          >
            {profileSuccessMsg}
          </UIAlert>
        )}
        {profileErrorMsg && (
          <UIAlert
            type="error"
            variant="soft"
            className="p-3 rounded-xl text-xs shadow-xs"
          >
            {profileErrorMsg}
          </UIAlert>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Identity Capsule & Active Workspace (~33%) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Card 1: Main Identity Capsule */}
          <div className="bg-surface rounded-2xl p-5 relative flex flex-col items-center text-center space-y-4 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
            
            {/* Top Bar: Status Badge & Security Action */}
            <div className="w-full flex items-center justify-between">
              <UIBadge
                variant="soft"
                color={status === "active" ? "success" : "error"}
              >
                <span className="capitalize">{status}</span>
              </UIBadge>

              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="size-8 rounded-xl bg-surface-alt hover:bg-surface-hover text-text-muted hover:text-text flex items-center justify-center transition-all border border-border/40 cursor-pointer active:scale-95"
                title="Change Password"
                aria-label="Change Password"
              >
                <Key className="size-4" />
              </button>
            </div>

            {/* Avatar */}
            <div className="relative mt-1">
              <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={displayName}
                    className="size-24 rounded-full object-cover border-4 border-surface shadow-sm transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="size-24 rounded-full bg-primary-soft text-primary font-extrabold text-3xl flex items-center justify-center border-4 border-surface shadow-sm select-none transition-transform group-hover:scale-105">
                    {profileData.name?.[0]?.toUpperCase() || <UserIcon size={32} />}
                  </div>
                )}

                <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-contrast shadow-sm ring-4 ring-surface transition-transform group-hover:scale-110">
                  <Camera size={13} />
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
            </div>
            
            <div className="mt-1 flex gap-2 justify-center">
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  disabled={isUploadingAvatar}
                  className="text-[10px] font-semibold text-error hover:underline cursor-pointer"
                >
                  Remove Photo
                </button>
              )}
            </div>

            {/* Name & Role Designation */}
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-text tracking-tight">
                {displayName}
              </h2>
              <p className="text-xs text-text-muted font-medium">
                {user?.email}
              </p>
              <p className="text-xs font-semibold text-primary">
                {profileData.role || "MEMBER"}
              </p>
              {userCode && (
                <div className="pt-0.5">
                  <span className="inline-block font-mono text-[11px] font-semibold tabular-nums text-text-muted bg-surface-alt px-2.5 py-0.5 rounded-full border border-border/40">
                    #USR-{userCode}
                  </span>
                </div>
              )}
            </div>

            <UIButton
              variant="outline"
              size="md"
              className="w-full justify-center shadow-xs py-2.5 font-semibold mt-1"
              startIcon={<Key className="size-4" />}
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </UIButton>
          </div>

          {/* Card 2: Active Workspace Context */}
          <div className="bg-surface rounded-2xl p-4.5 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] space-y-3">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider flex items-center justify-between">
              Active Environment
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                <span className="size-1.5 rounded-full bg-success animate-pulse" />
                Live
              </span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-alt/40 border border-border/50">
                <span className="text-text-muted flex items-center gap-1.5 font-medium">
                  <ShoppingBag className="size-3.5 text-primary" /> Workspace
                </span>
                <span className="font-semibold text-text truncate max-w-[140px]">
                  {currentWorkspace?.name || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-alt/40 border border-border/50">
                <span className="text-text-muted flex items-center gap-1.5 font-medium">
                  <Shield className="size-3.5 text-info" /> Code
                </span>
                <span className="font-mono font-bold text-text">
                  {currentWorkspace?.workspaceCode || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: User Profile Editor & Read-only Meta (~67%) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Card 1: Read-only Account Information */}
          <div className="bg-surface rounded-2xl p-5 sm:p-6 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] space-y-4">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <div className="flex items-center gap-2">
                <UserIcon className="size-4 text-primary" />
                <h2 className="text-sm font-bold text-text tracking-tight">
                  Account Overview
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider block">
                  Email Address
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text truncate">
                    {user?.email || "-"}
                  </span>
                  {emailVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-success font-semibold">
                      <CheckCircle2 className="size-3" /> Verified
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider block">
                  Phone Number
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono tabular-nums font-medium text-text">
                    {user?.phone ? `+91 ${user.phone}` : "-"}
                  </span>
                  {phoneVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-success font-semibold">
                      <CheckCircle2 className="size-3" /> Verified
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider block">
                  Last Login
                </span>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-text-muted" />
                  <span className="font-mono tabular-nums font-medium text-text">
                    {lastActiveFormatted}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider block">
                  Account Created
                </span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-text-muted" />
                  <span className="font-mono tabular-nums font-medium text-text">
                    {joinedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Editable Profile Information */}
          <div className="bg-surface rounded-2xl p-5 sm:p-6 shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.06] space-y-4">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="size-4 text-primary" />
                <h2 className="text-sm font-bold text-text tracking-tight">
                  Personal Details
                </h2>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <UIInput
                  id="profile-phone"
                  name="phone"
                  label="Phone number"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder="10-digit number"
                  helperText="Primary contact number"
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

              <div className="pt-2 flex justify-end">
                <UIButton
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSavingProfile}
                  loadingText="Saving Details..."
                  startIcon={<Check className="size-4" />}
                >
                  Save Profile Details
                </UIButton>
              </div>
            </form>
          </div>

        </div>
      </div>

      <ChangePasswordModal 
        open={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        onConfirm={handleSavePassword}
        isLoading={isSavingPassword}
        userProfile={profileData}
      />
    </div>
  );
};

export default ProfileTab;
