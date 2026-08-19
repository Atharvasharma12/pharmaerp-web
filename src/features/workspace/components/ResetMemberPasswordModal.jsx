// src/features/workspace/components/ResetMemberPasswordModal.jsx

import { useState, useCallback } from "react";
import {
  FiKey,
  FiLock,
  FiRefreshCcw,
  FiUser,
  FiPhone,
  FiMail,
  FiCheck,
} from "react-icons/fi";

import {
  AppDialog,
  AppButton,
  AppInput,
  AppAlert,
  AppCard,
} from "@/components";

const generateQuickPassword = () => {
  const num = Math.floor(100 + Math.random() * 900);
  return `Staff@${num}`;
};

const ResetMemberPasswordModal = ({
  open,
  onClose,
  onConfirm,
  member,
  isLoading,
}) => {
  const [password, setPassword] = useState(generateQuickPassword());
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleGenerate = () => {
    setPassword(generateQuickPassword());
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");
      await onConfirm(password);
      setSuccessMessage("Password reset successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1500);
    } catch (err) {
      setError(err || "Failed to reset password");
    }
  };

  if (!member) return null;

  const displayName = member.displayName || "Staff Member";
  const loginIdentifier = member.displayPhone || member.displayEmail;

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="Reset Staff Password / PIN"
      maxWidth="xs"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div className="rounded-lg bg-surface-alt/60 border border-border/80 p-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-text-muted flex items-center gap-1">
              <FiUser className="text-primary text-xs" /> Member:
            </span>
            <span className="font-bold text-text">{displayName}</span>
          </div>
          {loginIdentifier && (
            <div className="flex items-center justify-between">
              <span className="text-text-muted flex items-center gap-1">
                <FiPhone className="text-primary text-xs" /> Login ID:
              </span>
              <span className="font-mono text-text">{loginIdentifier}</span>
            </div>
          )}
        </div>

        {error && (
          <AppAlert severity="error" variant="soft" rounded="md">
            {error}
          </AppAlert>
        )}

        {successMessage && (
          <AppAlert severity="success" variant="soft" rounded="md">
            {successMessage}
          </AppAlert>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-text block">
              New Password / Quick PIN
            </label>
            <button
              type="button"
              onClick={handleGenerate}
              className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <FiRefreshCcw className="text-[10px]" /> Auto-Generate
            </button>
          </div>

          <AppInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Min 6 characters"
            fullWidth
            required
            size="small"
            variant="bordered"
            rounded="md"
            startIcon={<FiKey />}
            disabled={isLoading}
            helperText="Hand this new password or PIN directly to the staff member"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            size="small"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </AppButton>

          <AppButton
            type="submit"
            variant="contained"
            colorVariant="primary"
            size="small"
            loading={isLoading}
            startIcon={<FiCheck />}
          >
            Update Password
          </AppButton>
        </div>
      </form>
    </AppDialog>
  );
};

export default ResetMemberPasswordModal;
