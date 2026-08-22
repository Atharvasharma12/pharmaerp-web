import { useState } from "react";
import { Laptop, Smartphone, Monitor, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  UIButton,
  UIConfirmDialog,
  UICard,
  UICardHeader,
  UICardTitle,
  UICardDescription,
  UICardContent,
  UISwitch,
} from "@/components/ui";

const INITIAL_SESSIONS = [
  {
    id: "session-1",
    device: "MacBook Pro",
    type: "laptop",
    location: "Berlin, Germany",
    time: "Active now",
    isCurrent: true,
  },
  {
    id: "session-2",
    device: "iPhone 15",
    type: "smartphone",
    location: "Berlin, Germany",
    time: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "session-3",
    device: "Chrome on Windows",
    type: "desktop",
    location: "Munich, Germany",
    time: "Yesterday",
    isCurrent: false,
  },
];

const SecurityTab = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRevokeSession = (sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }, 800);
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case "laptop":
        return <Laptop size={16} className="text-text-muted" />;
      case "smartphone":
        return <Smartphone size={16} className="text-text-muted" />;
      default:
        return <Monitor size={16} className="text-text-muted" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* ── CARD 1: Two-Factor Authentication ─────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60 mb-0">
          <div>
            <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
              Two-factor authentication
            </UICardTitle>
            <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
              Add an extra layer of security to your account by requiring a verification code alongside your password.
            </UICardDescription>
          </div>
          <div className="shrink-0">
            <UISwitch
              id="two-factor-toggle"
              checked={twoFactorEnabled}
              onChange={setTwoFactorEnabled}
            />
          </div>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div className="flex items-center gap-3">
            {twoFactorEnabled ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success">
                <span className="size-1.5 rounded-full bg-success" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-alt px-2.5 py-0.5 text-xs font-medium text-text-muted">
                <span className="size-1.5 rounded-full bg-text-muted" />
                Disabled
              </span>
            )}
            <span className="text-xs text-text-muted">
              {twoFactorEnabled
                ? "Authenticator app configured"
                : "Enable 2FA to protect your account"}
            </span>
          </div>
        </UICardContent>
      </UICard>

      {/* ── CARD 2: Active Sessions ──────────────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="pb-3 border-b border-border/60 mb-0">
          <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
            Active sessions
          </UICardTitle>
          <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
            Devices that are currently signed in to your store account
          </UICardDescription>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div className="divide-y divide-border/60">
            <AnimatePresence>
              {sessions.map((session) => (
                <motion.div
                  key={session.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-[8px] bg-surface-alt border border-border">
                      {getDeviceIcon(session.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text">
                          {session.device}
                        </span>
                        {session.isCurrent && (
                          <span className="rounded-full bg-primary-soft px-2 py-0.2 text-[10px] font-semibold text-primary">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-text-muted">
                        {session.location} · {session.time}
                      </p>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(session.id)}
                      className="text-xs font-semibold text-text-muted transition-colors hover:text-error active:scale-[0.97] cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {sessions.length === 0 && (
              <p className="py-3 text-center text-xs text-text-muted">
                No other active sessions.
              </p>
            )}
          </div>
        </UICardContent>
      </UICard>

      {/* ── CARD 3: Danger Zone ──────────────────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)] border-error/30">
        <UICardContent className="p-0 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-text">
              Delete account
            </h3>
            <p className="text-[11px] text-text-muted">
              Permanently remove your account and all associated store preferences
            </p>
          </div>

          <UIButton
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            startIcon={<Trash2 size={13} />}
          >
            Delete
          </UIButton>
        </UICardContent>
      </UICard>

      {/* ── Delete Account Confirmation Dialog ────────────────── */}
      <UIConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="This action is permanent and cannot be undone. All your store preferences, activity history, and workspace links will be immediately deleted."
        intent="danger"
        confirmText="Permanently Delete"
        cancelText="Cancel"
        requireInput={true}
        confirmPhrase="DELETE"
        inputPlaceholder="Type DELETE to confirm"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default SecurityTab;
