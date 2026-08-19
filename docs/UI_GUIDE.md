# PharmaERP — Universal UI Guide (v3.0)

> **Architectural and Implementation Guide for building frontend surfaces across PharmaERP.**
> This guide outlines the stack, the Universal Dual-Layout Architecture, multi-device routing contracts, component creation patterns, and pre-delivery checks.
> For pixel-exact type scales, shape consistency locks, and motion curves, reference **[DESIGN_STANDARDS.md](./DESIGN_STANDARDS.md)**.

---

## 1. CRITICAL POLICY: Zero Legacy `App*` Components

> **NEVER use legacy `App*` components when building fresh UI.**
>
> Do NOT import or reference: `AppButton`, `AppInput`, `AppCard`, `AppHeading`, `AppText`,
> `AppTable`, `AppForm`, `AppFormField`, `AppFormSection`, `AppAlert`, `AppSkeleton`, `AppModal`,
> `AppBox`, or any other legacy component from `src/components/`.
>
> **The mandatory two-phase workflow:**
>
> **Phase 1 — Build primitives first**
> Build all reusable base components from scratch using only:
> - Tailwind CSS v4 utility classes + semantic CSS tokens (`var(--app-color-*)`)
> - shadcn/ui Radix primitives (raw — for interactive accessibility)
> - Lucide React icons
> - Framer Motion (for animations under 300ms)
> - Universal Multi-Device touch targets (min 44px × 44px)
>
> **Phase 2 — Build feature pages**
> Assemble desktop and mobile pages using ONLY the fresh primitives created in Phase 1.

---

## 2. Universal Dual-Layout Architecture

PharmaERP uses a **Two-Tier Universal Adaptive Layout System**:

```
FeaturePage.jsx (Parent Gate: useIsMobile() conditional render ONLY)
├── desktop/FeatureDesktopPage.jsx  (Covers Tablets ≥ 768px & Desktops up to 4K)
└── mobile/FeatureMobilePage.jsx    (Covers Foldables < 360px up to Phablets < 768px)
```

### 2.1 The Universal Device Selection Contract

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               UNIVERSAL DEVICE SELECTION MATRIX                                        │
├──────────────────────┬───────────────────────┬───────────────────────────┬─────────────────────────────┤
│ Category             │ Viewport Width        │ Target Hardware           │ Applied Architecture        │
├──────────────────────┼───────────────────────┼───────────────────────────┼─────────────────────────────┤
│ 1. Compact / Folded  │ 280px – 360px         │ Galaxy Z Fold (Cover), SE │ Fluid Single-Col Mobile     │
│ 2. Standard Mobile   │ 360px – 480px         │ iPhone 15/16, Galaxy S24  │ Centered Mobile Flow (390px)│
│ 3. Unfolded Foldable │ 480px – 767px         │ Galaxy Fold Open, Phablet │ Centered Mobile Card (440px)│
│ 4. Tablet Portrait   │ 768px – 1023px        │ iPad 10.2", iPad Air      │ Single-Col Desktop Card     │
│ 5. Short Laptop / Tab│ 1024px – 1279px       │ 1366x768, iPad Landscape  │ Split Desktop (Scrollable)  │
│ 6. Standard Desktop  │ 1280px – 1536px       │ 1080p Monitors, MacBooks  │ Dual-Rail Split Workspace   │
│ 7. Ultra-wide / 4K   │ > 1536px              │ 1440p, 4K, 21:9 Displays  │ Centered Boundary (max-w-7xl)│
└──────────────────────┴───────────────────────┴───────────────────────────┴─────────────────────────────┘
```

### 2.2 Short Laptop Screen & Landscape Viewport Handling

Many enterprise workstations operate on **1366x768 or 1280x720 screens** where browser tabs, toolbars, and OS taskbars reduce the usable vertical height to **< 640px**.

#### Mandatory Rules:
1. **Never Lock Fixed Canvas Heights**:
   - ❌ FORBIDDEN: `h-screen`, fixed `min-h-[720px]` without scrollable canvas.
   - ✅ REQUIRED: `min-h-[100dvh] flex flex-col justify-center py-6 sm:py-8 lg:py-10` with `my-auto` on the card container.
2. **Smooth Natural Vertical Scrolling**:
   - If screen height is tight, the entire card must scroll naturally within the canvas without clipping action buttons or footers.

---

## 3. Technology Stack & Design Tokens

| Layer | Technology | Standard Usage |
|---|---|---|
| Framework | React 19 | Hooks, Functional Components, Strict Mode |
| Styling | Tailwind CSS v4 | Semantic tokens (`bg-bg`, `bg-surface`, `text-text`, `border-border`) |
| Primitives | shadcn/ui (Radix) | Raw accessible headless primitives |
| Icons | Lucide React | Standardized icons only; zero emojis as icons |
| Animation | Framer Motion | Custom easing `[0.23, 1, 0.32, 1]`, durations < 300ms |
| Typography | Inter / Geist | `tabular-nums` on all numbers/currencies |

### 3.1 CSS Semantic Tokens Map
```css
--app-color-bg: Page Canvas
--app-color-surface: Elevated Cards & Modals
--app-color-surface-alt: Inputs & Table Zebra Rows
--app-color-surface-hover: Interactive Hover Background
--app-color-text: Primary High-Contrast Text
--app-color-text-muted: Secondary Text & Placeholders
--app-color-border: 1px Standard Border
--app-color-primary: Emerald Brand Accent (#00994a)
--app-color-primary-soft: Tinted Accent Fill
--app-color-error: Destructive Feedback
```

---

## 4. Responsive Implementation Patterns

### 4.1 Desktop & Tablet Template Pattern
```jsx
const FeatureDesktopPage = () => {
  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center bg-bg px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <motion.div
        initial={{ opacity: 0, transform: "translateY(12px) scale(0.98)" }}
        animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 my-auto grid w-full max-w-[1200px] overflow-hidden rounded-[16px] border border-border bg-surface shadow-[var(--app-shadow-lg)] lg:grid-cols-12"
      >
        {/* Left Form: Adaptive max-w-[440px] on Tablet (<lg), full column on Desktop (lg+) */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-8 xl:p-10 lg:col-span-6 xl:col-span-5">
          <div className="my-auto mx-auto w-full max-w-[420px] py-4 lg:mx-0">
            {/* Form Fields */}
          </div>
        </div>

        {/* Right Hero: Hidden on Tablet (<lg), Visible on Desktop (lg+) */}
        <div className="relative hidden p-4 lg:col-span-6 xl:col-span-7 lg:flex">
          {/* Hero Content */}
        </div>
      </motion.div>
    </section>
  );
};
```

### 4.2 Mobile & Foldable Template Pattern
```jsx
const FeatureMobilePage = () => {
  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-x-hidden bg-bg px-3.5 sm:px-4 pt-4 pb-16 sm:pb-20">
      <motion.div
        initial={{ opacity: 0, transform: "translateY(20px) scale(0.98)" }}
        animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 my-auto w-full max-w-[390px] overflow-hidden rounded-[18px] border border-border bg-surface p-5 sm:p-6 shadow-[var(--app-shadow-lg)]"
      >
        {/* Mobile Vector Header & Form */}
      </motion.div>
    </section>
  );
};
```

---

## 5. Pre-Delivery Checklist

Before marking any UI build or redesign complete:
- [ ] No `App*` components imported or used.
- [ ] Tested across all 7 device form factors (Foldable, Mobile, Tablet Portrait, Laptop, Desktop).
- [ ] Verified on short screen viewports (< 700px height) with `my-auto` and `min-h-[100dvh]`.
- [ ] Touch targets meet `44px` minimum.
- [ ] Build passes with `npx vite build --mode development` (Exit Code 0).

---

*PharmaERP Universal UI Guide v3.0*
