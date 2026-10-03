import { Sun, Moon, Check } from "lucide-react";

import { useTheme } from "@/contexts/ThemeContext";
import { THEME_NAMES, colorThemeOptions } from "@/theme/tokens";
import { THEME_MODES } from "@/theme/getThemeTokens";
import {
  UICard,
  UICardHeader,
  UICardTitle,
  UICardDescription,
  UICardContent,
  UISwitch,
} from "@/components/ui";

const THEME_ACCENT_COLORS = {
  [THEME_NAMES.EMERALD]: {
    color: "#00994a",
    gradient: "from-[#00994a] to-[#006631]",
  },
  [THEME_NAMES.CLASSIC_BLUE]: {
    color: "#1e40af",
    gradient: "from-[#1e40af] to-[#1e3a8a]",
  },
  [THEME_NAMES.INDIGO]: {
    color: "#4f46e5",
    gradient: "from-[#4f46e5] to-[#3730a3]",
  },
  [THEME_NAMES.SLATE]: {
    color: "#334155",
    gradient: "from-[#334155] to-[#1e293b]",
  },
  [THEME_NAMES.WARM]: {
    color: "#d97706",
    gradient: "from-[#d97706] to-[#b45309]",
  },
};

const AppearanceTab = () => {
  const { mode, setMode, colorTheme, setColorTheme } = useTheme();

  return (
    <div className="space-y-4">
      {/* ── CARD 1: Interface Mode ───────────────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="pb-3 border-b border-border/60 mb-0">
          <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
            Interface Mode
          </UICardTitle>
          <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
            Select your preferred display theme for PharmaERP
          </UICardDescription>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Light Mode Option */}
            <div
              onClick={() => setMode(THEME_MODES.LIGHT)}
              className={`group relative cursor-pointer rounded-[12px] border p-3 sm:p-3.5 transition-all active:scale-[0.99] select-none ${
                mode === THEME_MODES.LIGHT
                  ? "border-primary bg-primary-soft/30 ring-2 ring-primary/20 shadow-xs"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-hover"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-[6px] border border-amber-300 bg-amber-50 text-amber-600 shadow-2xs">
                    <Sun size={15} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-text">Light Mode</h3>
                    <p className="text-[11px] text-text-muted">Crisp white & soft contrast</p>
                  </div>
                </div>

                {mode === THEME_MODES.LIGHT && (
                  <div className="flex size-4.5 items-center justify-center rounded-full bg-primary text-primary-contrast shadow-2xs">
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Mini UI Preview */}
              <div className="mt-3 overflow-hidden rounded-[8px] border border-slate-200 bg-[#F8FFFB] p-2 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                  <div className="h-1.5 w-10 rounded-full bg-slate-300" />
                  <div className="h-1.5 w-3.5 rounded-full bg-primary/60" />
                </div>
                <div className="mt-2 flex gap-1.5">
                  <div className="h-7 w-6 shrink-0 rounded-[4px] bg-slate-200" />
                  <div className="w-full space-y-1">
                    <div className="h-1.5 w-3/4 rounded-full bg-slate-300" />
                    <div className="h-1.5 w-1/2 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Mode Option */}
            <div
              onClick={() => setMode(THEME_MODES.DARK)}
              className={`group relative cursor-pointer rounded-[12px] border p-3 sm:p-3.5 transition-all active:scale-[0.99] select-none ${
                mode === THEME_MODES.DARK
                  ? "border-primary bg-primary-soft/30 ring-2 ring-primary/20 shadow-xs"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-hover"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-[6px] border border-indigo-900/60 bg-indigo-950/50 text-indigo-400 shadow-2xs">
                    <Moon size={15} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-text">Dark Mode</h3>
                    <p className="text-[11px] text-text-muted">High-focus dark theme</p>
                  </div>
                </div>

                {mode === THEME_MODES.DARK && (
                  <div className="flex size-4.5 items-center justify-center rounded-full bg-primary text-primary-contrast shadow-2xs">
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Mini UI Preview */}
              <div className="mt-3 overflow-hidden rounded-[8px] border border-slate-700 bg-slate-900 p-2 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <div className="h-1.5 w-10 rounded-full bg-slate-700" />
                  <div className="h-1.5 w-3.5 rounded-full bg-primary/80" />
                </div>
                <div className="mt-2 flex gap-1.5">
                  <div className="h-7 w-6 shrink-0 rounded-[4px] bg-slate-800" />
                  <div className="w-full space-y-1">
                    <div className="h-1.5 w-3/4 rounded-full bg-slate-700" />
                    <div className="h-1.5 w-1/2 rounded-full bg-slate-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UICardContent>
      </UICard>

      {/* ── CARD 2: Brand Accent Color ──────────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="pb-3 border-b border-border/60 mb-0">
          <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
            Brand Accent Palette
          </UICardTitle>
          <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
            Choose the primary brand accent color used for buttons, interactive highlights, and active indicators
          </UICardDescription>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {colorThemeOptions.map((themeOption) => {
              const isSelected = colorTheme === themeOption.value;
              const accentConfig = THEME_ACCENT_COLORS[themeOption.value] || {
                color: "#00994a",
                gradient: "from-emerald-600 to-emerald-800",
              };

              return (
                <div
                  key={themeOption.value}
                  onClick={() => setColorTheme(themeOption.value)}
                  className={`group relative flex cursor-pointer flex-col justify-between rounded-[12px] border p-3 transition-all active:scale-[0.99] select-none ${
                    isSelected
                      ? "border-primary bg-primary-soft/30 ring-2 ring-primary/20 shadow-xs"
                      : "border-border bg-surface hover:border-border-strong hover:bg-surface-hover"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-4.5 rounded-full shadow-xs ring-2 ring-surface shrink-0"
                          style={{ backgroundColor: accentConfig.color }}
                        />
                        <h4 className="text-xs sm:text-sm font-bold text-text">
                          {themeOption.label}
                        </h4>
                      </div>

                      {isSelected && (
                        <div className="flex size-4.5 items-center justify-center rounded-full bg-primary text-primary-contrast shadow-2xs">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <p className="mt-1.5 text-[11px] leading-relaxed text-text-muted">
                      {themeOption.description}
                    </p>
                  </div>

                  {/* Visual Swatch Strip */}
                  <div
                    className={`mt-3 h-1.5 w-full rounded-full bg-gradient-to-r ${accentConfig.gradient}`}
                  />
                </div>
              );
            })}
          </div>
        </UICardContent>
      </UICard>

      {/* ── CARD 3: Display & Density Preferences ────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="pb-3 border-b border-border/60 mb-0">
          <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
            Display & Typography Preferences
          </UICardTitle>
          <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
            Configure data density, numeric alignment, and accessibility motion
          </UICardDescription>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div className="divide-y divide-border/60">
            <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <div className="flex flex-col pr-2 min-w-0">
                <label htmlFor="opt-tabular-nums" className="text-[13px] font-medium text-text cursor-pointer select-none">
                  Tabular Numerics
                </label>
                <span className="text-xs text-text-muted leading-[1.5]">
                  Ensure numbers and currency columns align perfectly across tables
                </span>
              </div>
              <UISwitch
                id="opt-tabular-nums"
                checked={true}
                onChange={() => {}}
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <div className="flex flex-col pr-2 min-w-0">
                <label htmlFor="opt-fluid-animations" className="text-[13px] font-medium text-text cursor-pointer select-none">
                  Fluid Spring Animations
                </label>
                <span className="text-xs text-text-muted leading-[1.5]">
                  Enable 60fps spring transitions on dialogs, tabs, and interactive states
                </span>
              </div>
              <UISwitch
                id="opt-fluid-animations"
                checked={true}
                onChange={() => {}}
              />
            </div>
          </div>
        </UICardContent>
      </UICard>
    </div>
  );
};

export default AppearanceTab;
