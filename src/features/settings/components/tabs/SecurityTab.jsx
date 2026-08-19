import { useState } from "react";
import { Laptop, Smartphone, Monitor, Trash2, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import SettingsCard from "../SettingsCard";
import SettingsToggle from "../SettingsToggle";

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
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleRevokeSession = (sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
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
      <SettingsCard
        title="Two-factor authentication"
        description="Add an extra layer of security to your account by requiring a verification code alongside your password."
        action={
          <SettingsToggle
            id="two-factor-toggle"
            checked={twoFactorEnabled}
            onChange={setTwoFactorEnabled}
          />
        }
      >
        <div className="border-t border-border/60 pt-3">
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
        </div>
      </SettingsCard>

      {/* ── CARD 2: Active Sessions ──────────────────────────── */}
      <SettingsCard
        title="Active sessions"
        description="Devices that are currently signed in to your store account"
      >
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
                    className="text-xs font-semibold text-text-muted transition-colors hover:text-error active:scale-[0.97]"
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
      </SettingsCard>

      {/* ── CARD 3: Danger Zone ──────────────────────────────── */}
      <SettingsCard
        title="Danger zone"
        description="Irreversible account and organization actions"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-text">
              Delete account
            </h3>
            <p className="text-[11px] text-text-muted">
              Permanently remove your account and all associated store preferences
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-border px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:border-error/40 hover:bg-error-soft hover:text-error active:scale-[0.97]"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>
        </div>
      </SettingsCard>

      {/* ── Delete Account Confirmation Modal ────────────────── */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md rounded-[14px] border border-border bg-surface p-5 shadow-[var(--app-shadow-xl)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-9 items-center justify-center rounded-[8px] bg-error-soft text-error">
                  <AlertTriangle size={18} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-[6px] p-1 text-text-muted hover:bg-surface-hover hover:text-text"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-3.5">
                <h3 className="text-sm sm:text-base font-bold text-text">
                  Delete Account
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-text-muted">
                  This action is permanent and cannot be undone. All your store preferences, activity history, and workspace links will be immediately deleted.
                </p>
                <div className="mt-3.5">
                  <label className="text-xs font-semibold text-text">
                    Type <span className="font-bold text-error">DELETE</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="mt-1.5 w-full rounded-[10px] border border-border bg-surface px-3 py-2 text-xs text-text focus:border-error focus:outline-none focus:ring-2 focus:ring-error/20"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-[8px] border border-border px-3.5 py-1.5 text-xs font-semibold text-text hover:bg-surface-hover"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmText !== "DELETE"}
                  onClick={() => {
                    setShowDeleteModal(false);
                  }}
                  className="rounded-[8px] bg-error px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-error/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Permanently Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecurityTab;
