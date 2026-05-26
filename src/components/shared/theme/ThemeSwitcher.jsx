// src/components/shared/theme/ThemeSwitcher.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiMoon, FiSun } from "react-icons/fi";

import { useTheme } from "@/contexts";
import { colorThemeOptions } from "@/theme/tokens";
import { AppIconButton } from "@/components";
import useIsMobile from "@/hooks/useIsMobile";

const modeOptions = [
  { value: "light", label: "Light", icon: <FiSun /> },
  { value: "dark", label: "Dark", icon: <FiMoon /> },
];

const ThemeSwitcher = ({
  size = "medium",
  showLabel = true,
  align = "right",
  compact = false,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const isMobile = useIsMobile();

  const {
    mode,
    theme,
    colorTheme,
    setMode,
    setColorTheme,
    toggleTheme,
    isDark,
  } = useTheme();

  const currentMode = mode || theme || "light";

  const activeTheme = useMemo(
    () =>
      colorThemeOptions.find((item) => item.value === colorTheme) ||
      colorThemeOptions[0],
    [colorTheme],
  );

  const activeMode = useMemo(
    () =>
      modeOptions.find((item) => item.value === currentMode) || modeOptions[0],
    [currentMode],
  );

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const iconSize = size === "small" ? 34 : 40;
  const dropdownAlignClass = align === "left" ? "left-0" : "right-0";

  if (compact && !isMobile) {
    return (
      <AppIconButton
        icon={isDark ? <FiSun /> : <FiMoon />}
        onClick={toggleTheme}
        variant="outlined"
        colorVariant="dark"
        rounded="md"
        tooltip="Toggle theme"
        aria-label="Toggle theme"
        sx={{
          width: iconSize,
          height: iconSize,
          borderColor: "var(--app-color-border-strong)",
          color: "var(--app-color-text)",
        }}
      />
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Open theme switcher"
        className={`flex items-center rounded-xl border border-border-strong bg-surface text-text shadow-sm transition hover:border-primary hover:bg-primary-soft ${
          isMobile ? "h-9 w-9 justify-center" : "h-9 gap-1.5 px-2.5"
        }`}
      >
        <span className="flex h-5 w-5 items-center justify-center text-primary">
          {activeMode.icon}
        </span>

        {!isMobile && showLabel && (
          <span className="text-[12px] font-semibold">{activeMode.label}</span>
        )}

        {!isMobile && (
          <FiChevronDown
            className={`text-[14px] text-text-muted transition ${
              open ? "rotate-180 text-primary" : ""
            }`}
          />
        )}
      </button>

      {open && (
        <div
          className={
            isMobile
              ? "fixed right-3 top-16 z-50 w-[210px] rounded-2xl border border-border bg-surface p-2 shadow-xl"
              : `absolute ${dropdownAlignClass} top-full z-50 mt-2 w-[220px] rounded-2xl border border-border bg-surface p-2 shadow-xl`
          }
        >
          <div className="grid grid-cols-2 gap-1.5">
            {modeOptions.map((item) => {
              const active = currentMode === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setMode(item.value);

                    if (isMobile) setOpen(false);
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[12px] font-semibold transition ${
                    active
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-surface-alt text-text-muted hover:border-primary hover:text-primary"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-1.5 space-y-1">
            {colorThemeOptions.map((item) => {
              const active = colorTheme === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setColorTheme(item.value);

                    if (isMobile) setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition ${
                    active
                      ? "bg-primary-soft text-primary"
                      : "text-text hover:bg-surface-alt hover:text-primary"
                  }`}
                >
                  <span className="truncate text-[12px] font-semibold">
                    {item.label}
                  </span>

                  {active && <FiCheck className="shrink-0 text-[14px]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
