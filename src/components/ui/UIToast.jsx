import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * UIToast System (#37)
 *
 * Ephemeral feedback notification system with auto-dismiss countdown,
 * stack management, and imperative triggers (`uiToast.success()`, etc.).
 */

// Global toast state listener subscribers
let toastListeners = [];
let toastIdCounter = 0;

export const uiToast = {
  notify: (options) => {
    const id = options.id || ++toastIdCounter;
    const newToast = {
      id,
      type: options.type || "info",
      title: options.title,
      description: options.description,
      duration: options.duration !== undefined ? options.duration : 4000,
      action: options.action,
      icon: options.icon,
      onDismiss: options.onDismiss,
    };
    toastListeners.forEach((listener) => listener((prev) => [...prev, newToast]));
    return id;
  },
  success: (title, description, options = {}) =>
    uiToast.notify({ type: "success", title, description, ...options }),
  error: (title, description, options = {}) =>
    uiToast.notify({ type: "error", title, description, ...options }),
  warning: (title, description, options = {}) =>
    uiToast.notify({ type: "warning", title, description, ...options }),
  info: (title, description, options = {}) =>
    uiToast.notify({ type: "info", title, description, ...options }),
  promise: async (promise, { loading, success, error }) => {
    const id = uiToast.notify({
      type: "loading",
      title: loading?.title || "Processing...",
      description: loading?.description,
      duration: 0, // no auto dismiss while loading
    });
    try {
      const result = await promise;
      uiToast.dismiss(id);
      uiToast.success(
        typeof success?.title === "function" ? success.title(result) : success?.title || "Completed successfully",
        typeof success?.description === "function" ? success.description(result) : success?.description
      );
      return result;
    } catch (err) {
      uiToast.dismiss(id);
      uiToast.error(
        typeof error?.title === "function" ? error.title(err) : error?.title || "Operation failed",
        typeof error?.description === "function" ? error.description(err) : error?.description || err?.message
      );
      throw err;
    }
  },
  dismiss: (id) => {
    toastListeners.forEach((listener) =>
      listener((prev) => prev.filter((t) => t.id !== id))
    );
  },
  clearAll: () => {
    toastListeners.forEach((listener) => listener([]));
  },
};

/**
 * Toast Item Component
 */
const ToastCard = ({ toast, onDismiss }) => {
  const { id, type, title, description, duration, action, icon } = toast;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const typeConfig = {
    success: {
      icon: <CheckCircle2 className="size-4.5 text-success" />,
      border: "border-success/30",
      bg: "bg-surface",
      badge: "text-success",
    },
    error: {
      icon: <AlertCircle className="size-4.5 text-error" />,
      border: "border-error/30",
      bg: "bg-surface",
      badge: "text-error",
    },
    warning: {
      icon: <AlertTriangle className="size-4.5 text-warning" />,
      border: "border-warning/30",
      bg: "bg-surface",
      badge: "text-warning",
    },
    info: {
      icon: <Info className="size-4.5 text-info" />,
      border: "border-info/30",
      bg: "bg-surface",
      badge: "text-info",
    },
    loading: {
      icon: <Loader2 className="size-4.5 text-primary animate-spin" />,
      border: "border-primary/30",
      bg: "bg-surface",
      badge: "text-primary",
    },
  };

  const cur = typeConfig[type] || typeConfig.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      role="status"
      aria-live="polite"
      className={cn(
        "relative w-full max-w-sm p-4 rounded-2xl border shadow-xl flex items-start gap-3 select-none pointer-events-auto font-sans bg-surface",
        cur.border
      )}
    >
      {/* Icon */}
      <div className="shrink-0 mt-0.5">{icon || cur.icon}</div>

      {/* Text Info */}
      <div className="flex-1 min-w-0 pr-4">
        {title && (
          <div className="text-sm font-bold text-text leading-snug break-words">
            {title}
          </div>
        )}
        {description && (
          <div className="text-xs text-text-muted mt-0.5 leading-relaxed break-words">
            {description}
          </div>
        )}
        {action && (
          <div className="mt-2.5">
            {typeof action === "function" ? action({ dismiss: () => onDismiss(id) }) : action}
          </div>
        )}
      </div>

      {/* Close ✕ Button */}
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss toast"
        className="size-6 rounded-lg hover:bg-surface-hover flex items-center justify-center text-text-muted hover:text-text transition-colors cursor-pointer shrink-0"
      >
        <X className="size-3.5" />
      </button>

      {/* Progress countdown bar */}
      {duration > 0 && (
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className={cn(
            "absolute bottom-0 left-0 h-0.5 rounded-b-full opacity-60",
            type === "success"
              ? "bg-success"
              : type === "error"
              ? "bg-error"
              : type === "warning"
              ? "bg-warning"
              : "bg-primary"
          )}
        />
      )}
    </motion.div>
  );
};

/**
 * UIToastContainer - Global viewport container for toasts
 */
export const UIToastContainer = ({
  position = "bottom-right", // "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
}) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToasts);
    };
  }, []);

  const positionClasses = {
    "top-right": "top-4 right-4 items-end",
    "top-left": "top-4 left-4 items-start",
    "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
    "bottom-right": "bottom-4 right-4 items-end",
    "bottom-left": "bottom-4 left-4 items-start",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  };

  return (
    <div
      aria-label="Notifications"
      className={cn(
        "fixed z-50 flex flex-col gap-2.5 max-w-full w-auto pointer-events-none p-2",
        positionClasses[position] || positionClasses["bottom-right"]
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={uiToast.dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default UIToastContainer;
