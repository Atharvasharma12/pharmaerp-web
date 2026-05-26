// src/components/shared/theme/ThemeSwitcher.jsx

import React, { useMemo, useState } from "react";
import {
  FiCheck,
  FiChevronDown,
  FiMoon,
  FiSun,
  FiMonitor,
} from "react-icons/fi";

import { useTheme } from "@/contexts";
import { colorThemeOptions } from "@/theme/tokens";
import { AppIconButton } from "@/components";

const modeOptions = [
  {
    value: "light",
    label: "Light",
    icon: <FiSun />,
  },
  {
    value: "dark",
    label: "Dark",
    icon: <FiMoon />,
  },
];

const ThemeSwitcher = ({
  size = "medium",
  showLabel = false,
  align = "right",
  compact = false,
}) => {
  const [open, setOpen] = useState(false);

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

  const activeTheme = useMemo(() => {
    return (
      colorThemeOptions.find((item) => item.value === colorTheme) ||
      colorThemeOptions[0]
    );
  }, [colorTheme]);

  const activeMode = useMemo(() => {
    return (
      modeOptions.find((item) => item.value === currentMode) || modeOptions[0]
    );
  }, [currentMode]);

  const iconSize = size === "small" ? 36 : 42;

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
  };

  const handleThemeChange = (nextTheme) => {
    setColorTheme(nextTheme);
  };

  const dropdownAlignClass = align === "left" ? "left-0" : "right-0";

  if (compact) {
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
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border border-border-strong bg-surface px-3 py-2 text-text shadow-sm transition hover:border-primary hover:bg-primary-soft"
        aria-label="Open theme switcher"
      >
        <span className="flex h-5 w-5 items-center justify-center text-primary">
          {activeMode.icon}
        </span>

        {showLabel && (
          <span className="hidden text-[13px] font-semibold sm:inline">
            {activeTheme.label}
          </span>
        )}

        <FiChevronDown
          className={`text-[16px] text-text-muted transition ${
            open ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close theme switcher"
            onClick={() => setOpen(false)}
          />

          <div
            className={`absolute ${dropdownAlignClass} top-full z-50 mt-3 w-[280px] rounded-2xl border border-border bg-surface p-3 shadow-xl`}
          >
            <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <FiMonitor />
              </span>

              <div>
                <p className="text-[14px] font-bold text-text">Appearance</p>
                <p className="text-[12px] text-text-muted">
                  Choose theme and mode
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">
                Mode
              </p>

              <div className="grid grid-cols-2 gap-2">
                {modeOptions.map((item) => {
                  const active = currentMode === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handleModeChange(item.value)}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[13px] font-semibold transition ${
                        active
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border bg-surface-alt text-text-muted hover:border-primary hover:text-primary"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">
                Color Theme
              </p>

              <div className="space-y-1">
                {colorThemeOptions.map((item) => {
                  const active = colorTheme === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handleThemeChange(item.value)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
                        active
                          ? "bg-primary-soft text-primary"
                          : "text-text hover:bg-surface-alt hover:text-primary"
                      }`}
                    >
                      <div>
                        <p className="text-[13px] font-bold">{item.label}</p>
                        <p className="mt-0.5 text-[11px] text-text-muted">
                          {item.description}
                        </p>
                      </div>

                      {active && <FiCheck className="text-[17px]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
