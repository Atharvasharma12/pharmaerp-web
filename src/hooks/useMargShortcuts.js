// pharmaerp-web/src/hooks/useMargShortcuts.js
//
// Global keyboard event handler for Marg ERP shortcut navigation.
// Intercepts hotkeys across the app, verifies user permissions and setup status,
// and routes smoothly without browser conflicts.

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { usePermission } from "@/hooks";
import { useSetupStatus } from "@/features/setup/hooks/useSetupStatus";
import { ROUTES } from "@/constants";
import { uiToast } from "@/components/ui";
import { MARG_SHORTCUTS } from "@/config/shortcutsConfig";

export const FOCUS_SEARCH_EVENT = "pharma-erp:focus-desktop-search";

export const useMargShortcuts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { can, canAny, isOwner } = usePermission();
  const { isSetupComplete, companyCompleted } = useSetupStatus();

  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const toggleShortcutsModal = useCallback(() => {
    setIsShortcutsModalOpen((prev) => !prev);
  }, []);

  const openShortcutsModal = useCallback(() => {
    setIsShortcutsModalOpen(true);
  }, []);

  const closeShortcutsModal = useCallback(() => {
    setIsShortcutsModalOpen(false);
  }, []);

  // Check if a specific shortcut is permitted for the current user
  const isShortcutAccessible = useCallback(
    (shortcut) => {
      if (shortcut.requireOwner && !isOwner) return false;
      if (shortcut.permissions?.length) {
        return typeof canAny === "function"
          ? canAny(shortcut.permissions)
          : shortcut.permissions.some((p) => can(p));
      }
      if (shortcut.permission) {
        return typeof can === "function" ? can(shortcut.permission) : true;
      }
      return true;
    },
    [can, canAny, isOwner]
  );

  // Check if target path is locked behind onboarding / setup
  const isShortcutLockedBySetup = useCallback(
    (shortcut) => {
      if (isSetupComplete) return false;

      const path = shortcut.path || "";
      if (
        path === ROUTES.SETUP_CENTER ||
        path === ROUTES.SETTINGS ||
        path === ROUTES.HELP_CENTER ||
        path.startsWith("/companies")
      ) {
        return false;
      }
      if (path.startsWith("/branches")) {
        return !companyCompleted;
      }
      return true;
    },
    [isSetupComplete, companyCompleted]
  );

  // Execute a shortcut command
  const executeShortcut = useCallback(
    (shortcut) => {
      if (shortcut.path === "ACTION_SEARCH") {
        // Dispatch focus event to HeaderSearchBar
        window.dispatchEvent(new CustomEvent(FOCUS_SEARCH_EVENT));
        return;
      }

      if (shortcut.path === "ACTION_SHORTCUTS_MODAL") {
        toggleShortcutsModal();
        return;
      }

      // Check permissions
      if (!isShortcutAccessible(shortcut)) {
        uiToast.error(
          "Access Restricted",
          `You don't have permission to access ${shortcut.label}`
        );
        return;
      }

      // Check setup status
      if (isShortcutLockedBySetup(shortcut)) {
        uiToast.info(
          "Setup Required",
          `Please complete workspace setup to unlock ${shortcut.label}`
        );
        navigate(ROUTES.SETUP_CENTER);
        return;
      }

      // Navigate to target route if not already there
      if (shortcut.path && location.pathname !== shortcut.path) {
        navigate(shortcut.path);
        if (isShortcutsModalOpen) {
          setIsShortcutsModalOpen(false);
        }
      }
    },
    [
      isShortcutAccessible,
      isShortcutLockedBySetup,
      location.pathname,
      navigate,
      toggleShortcutsModal,
      isShortcutsModalOpen,
    ]
  );

  // Global keydown event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if user is actively typing in a form input or text area
      const activeEl = document.activeElement;
      const isTyping =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable ||
          activeEl.getAttribute("role") === "textbox");

      // 1. Escape key: Close modal if open
      if (e.key === "Escape") {
        if (isShortcutsModalOpen) {
          e.preventDefault();
          setIsShortcutsModalOpen(false);
          return;
        }
      }

      // 2. Question mark '?': Open cheatsheet (only when not typing in an input)
      if (!isTyping && e.key === "?" && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleShortcutsModal();
        return;
      }

      // 3. Search Bar Shortcuts:
      // - Ctrl + K / Cmd + K
      // - Alt + /
      const isSearchCombo =
        ((e.ctrlKey || e.metaKey) && (e.code === "KeyK" || e.key.toLowerCase() === "k")) ||
        (e.altKey && (e.code === "Slash" || e.key === "/"));

      if (isSearchCombo) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(FOCUS_SEARCH_EVENT));
        return;
      }

      // 4. Alt + F1: Marg ERP built-in shortcut help
      if (e.altKey && (e.key === "F1" || e.code === "F1")) {
        e.preventDefault();
        toggleShortcutsModal();
        return;
      }

      // 5. Check Alt-based navigation shortcuts
      // Note: Alt shortcuts are allowed even while typing in an input,
      // because Marg power users frequently navigate while in fields.
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const keyChar = e.key ? e.key.toLowerCase() : "";
        const codeChar = e.code ? e.code.replace("Key", "").toLowerCase() : "";
        const isShift = e.shiftKey;

        // Match against registered shortcuts
        const matched = MARG_SHORTCUTS.find((s) => {
          if (s.path === "ACTION_SEARCH" || s.path === "ACTION_SHORTCUTS_MODAL") {
            return false;
          }

          // Parse shortcut keyCombo
          const parts = s.keyCombo.split("+");
          const hasAlt = parts.includes("Alt");
          const hasShift = parts.includes("Shift");
          const keyPart = parts[parts.length - 1]; // e.g. "KeyN", "KeyP", "Comma"

          if (!hasAlt) return false;
          if (hasShift !== isShift) return false;

          if (keyPart.startsWith("Key")) {
            const letter = keyPart.replace("Key", "").toLowerCase();
            return letter === keyChar || letter === codeChar;
          }

          if (keyPart === "Comma") {
            return keyChar === "," || e.code === "Comma";
          }

          return false;
        });

        if (matched) {
          e.preventDefault();
          executeShortcut(matched);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isShortcutsModalOpen, toggleShortcutsModal, executeShortcut]);

  return {
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    openShortcutsModal,
    closeShortcutsModal,
    toggleShortcutsModal,
    executeShortcut,
    shortcuts: MARG_SHORTCUTS,
  };
};

export default useMargShortcuts;
