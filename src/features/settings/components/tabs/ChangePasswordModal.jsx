import React, { useState } from "react";
import {
  KeyRound,
  Check,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIInput,
  UIAlert,
} from "@/components/ui";
import { cn } from "@/lib/utils";

const getPasswordStrength = (pwd) => {
  if (!pwd || pwd.length < 6) return { score: 1, label: "Weak", color: "bg-error", text: "text-error" };
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
  const criteria = [hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  if (pwd.length >= 8 && criteria >= 2) {
    return { score: 3, label: "Strong", color: "bg-success", text: "text-success" };
  }
  if (pwd.length >= 6 && criteria >= 1) {
    return { score: 2, label: "Good", color: "bg-warning", text: "text-warning" };
  }
  return { score: 1, label: "Weak", color: "bg-error", text: "text-error" };
};

const ChangePasswordModal = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  userProfile,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setError("");
      await onConfirm({ currentPassword, newPassword });
      // Clear fields on successful submit
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(typeof err === "string" ? err : err?.message || "Failed to update password");
    }
  };

  const handleClose = () => {
    setError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const displayName = userProfile?.name 
    ? `${userProfile.name} ${userProfile.surname}`.trim() 
    : userProfile?.email || "User";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "US";

  const strength = getPasswordStrength(newPassword);

  return (
    <UIModal
      isOpen={open}
      onClose={handleClose}
      size="sm"
      className="max-w-[460px]"
    >
      {/* Header */}
      <UIModalHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <KeyRound className="size-5" />
          </div>
          <div>
            <UIModalTitle className="text-base sm:text-lg">
              Change Password
            </UIModalTitle>
            <UIModalDescription className="text-xs mt-0.5">
              Set a new secure password for your account.
            </UIModalDescription>
          </div>
        </div>
      </UIModalHeader>

      <form onSubmit={handleSubmit}>
        <UIModalBody className="space-y-4 py-4 max-h-[70vh]">
          {/* User Profile Identity Capsule */}
          <div className="p-3.5 rounded-2xl bg-surface-alt/75 border border-border/60 space-y-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-text text-xs sm:text-sm block truncate">
                  {displayName}
                </span>
                <span className="text-[11px] text-text-muted font-mono block truncate">
                  {userProfile?.email || "No email linked"}
                </span>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <UIAlert intent="danger" title="Validation Error" description={error} />
          )}

          {/* Password Input Section */}
          <div className="space-y-3.5">
            
            {/* Current Password */}
            <div className="relative flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-text flex items-center gap-1.5">
                 Current Password
              </label>
              <UIInput
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter current password"
                prefixIcon={<Lock className="size-4 text-text-muted" />}
                required
                size="md"
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>

            {/* New Password */}
            <div className="relative flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-text flex items-center gap-1.5">
                <Lock className="size-3.5 text-primary" /> New Password
              </label>
              <UIInput
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                placeholder="Min 8 characters"
                prefixIcon={<KeyRound className="size-4 text-text-muted" />}
                required
                size="md"
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>

            {/* Confirm New Password */}
            <div className="relative flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-text flex items-center gap-1.5">
                 Confirm New Password
              </label>
              <UIInput
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Confirm new password"
                prefixIcon={<Check className="size-4 text-text-muted" />}
                required
                size="md"
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>

            {/* Password Strength Visual Meter */}
            {newPassword.length > 0 && (
              <div className="pt-1 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-muted font-medium">Strength:</span>
                  <span className={cn("font-bold", strength.text)}>
                    {strength.label}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
                  <div
                    className={cn(
                      "rounded-full transition-colors duration-300",
                      strength.score >= 1 ? strength.color : "bg-border/60"
                    )}
                  />
                  <div
                    className={cn(
                      "rounded-full transition-colors duration-300",
                      strength.score >= 2 ? strength.color : "bg-border/60"
                    )}
                  />
                  <div
                    className={cn(
                      "rounded-full transition-colors duration-300",
                      strength.score >= 3 ? strength.color : "bg-border/60"
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </UIModalBody>

        {/* Footer */}
        <UIModalFooter className="bg-surface-alt/40 border-t border-border/40 py-3.5">
          <UIButton
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </UIButton>

          <UIButton
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            startIcon={<Check className="size-4" />}
          >
            Update Password
          </UIButton>
        </UIModalFooter>
      </form>
    </UIModal>
  );
};

export default ChangePasswordModal;
