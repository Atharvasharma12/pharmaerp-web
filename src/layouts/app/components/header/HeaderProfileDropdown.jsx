// src/layouts/app/components/header/HeaderProfileDropdown.jsx

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut } from "lucide-react";

import { ROUTES } from "@/constants";
import useAuth from "@/features/auth/hooks/useAuth";

const HeaderProfileDropdown = ({ className = "" }) => {
  const navigate = useNavigate();
  const { user, logout, clearCredentials } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const containerRef = useRef(null);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const userName = user?.name || user?.fullName || "Admin User";
  const userRole = user?.role || "Store Manager";
  const userInitials =
    userName
      ?.split(" ")
      ?.map((w) => w?.[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() || "AU";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* User Profile Avatar Button */}
      <button
        type="button"
        onClick={() => setProfileOpen((prev) => !prev)}
        aria-label="User profile menu"
        aria-expanded={profileOpen}
        className={`flex size-9 cursor-pointer items-center justify-center rounded-full ring-2 transition-all active:scale-[0.95] ${
          profileOpen
            ? "ring-primary shadow-xs"
            : "ring-border/80 hover:ring-primary/40"
        }`}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={userName}
            className="size-full rounded-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-full bg-primary-soft text-primary font-bold text-xs shadow-2xs">
            {userInitials}
          </div>
        )}
      </button>

      {/* Profile Popover Menu */}
      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-[46px] z-50 w-[230px] overflow-hidden rounded-[14px] border border-border bg-surface p-2 shadow-[var(--app-shadow-xl)]"
          >
            {/* User Profile Card */}
            <div className="flex items-center gap-2.5 rounded-[8px] bg-surface-alt/40 p-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                {userInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold text-text">
                  {userName}
                </div>
                <div className="truncate text-[10.5px] text-text-muted">
                  {userRole}
                </div>
              </div>
            </div>

            <div className="my-1.5 border-t border-border/70" />

            {/* Actions List */}
            <div className="space-y-0.5">
              <Link
                to={ROUTES.SETTINGS}
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-xs font-medium text-text transition hover:bg-surface-hover"
              >
                <User className="size-3.5 text-text-muted" />
                <span>My Profile</span>
              </Link>

              <Link
                to={ROUTES.SETTINGS}
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-xs font-medium text-text transition hover:bg-surface-hover"
              >
                <Settings className="size-3.5 text-text-muted" />
                <span>Account Settings</span>
              </Link>

              <div className="my-1 border-t border-border/70" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-xs font-semibold text-error transition hover:bg-error-soft active:scale-[0.98]"
              >
                <LogOut className="size-3.5" />
                <span>Log out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderProfileDropdown;
