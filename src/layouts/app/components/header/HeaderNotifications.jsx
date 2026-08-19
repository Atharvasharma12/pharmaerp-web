// src/layouts/app/components/header/HeaderNotifications.jsx

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronRight } from "lucide-react";

import { ROUTES } from "@/constants";

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: "Stock Alert",
    desc: "Amoxicillin 500mg is below reorder threshold",
    time: "5m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Batch Expiry Warning",
    desc: "Paracetamol 650mg (Batch #B92) expires in 15 days",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    title: "System Update",
    desc: "GST Tax rules version 3.2 applied successfully",
    time: "1d ago",
    unread: false,
  },
];

const HeaderNotifications = ({ className = "" }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  const containerRef = useRef(null);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        type="button"
        onClick={() => setNotificationsOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={notificationsOpen}
        className={`relative flex size-9 cursor-pointer items-center justify-center rounded-full transition-all active:scale-[0.95] ${
          notificationsOpen
            ? "bg-surface-hover text-primary ring-1 ring-border shadow-2xs"
            : "text-text-muted hover:bg-surface-hover hover:text-text"
        }`}
      >
        <Bell className="size-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-surface animate-pulse" />
        )}
      </button>

      {/* Notifications Floating Popover */}
      <AnimatePresence>
        {notificationsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-[46px] z-50 w-[300px] overflow-hidden rounded-[14px] border border-border bg-surface p-2 shadow-[var(--app-shadow-xl)]"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-2.5 py-1.5">
              <span className="text-xs font-bold text-text">Notifications</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="cursor-pointer text-[11px] font-semibold text-primary hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[220px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-1 py-1.5">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-[8px] p-2 transition ${
                    item.unread
                      ? "bg-primary-soft/30"
                      : "hover:bg-surface-hover"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-text-muted leading-tight">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-1 border-t border-border/60 pt-1.5">
              <Link
                to={ROUTES.SETTINGS}
                onClick={() => setNotificationsOpen(false)}
                className="flex w-full items-center justify-center gap-1.5 rounded-[6px] py-1 text-[11.5px] font-medium text-text-muted transition hover:bg-surface-hover hover:text-text"
              >
                <span>Notification Preferences</span>
                <ChevronRight className="size-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderNotifications;
