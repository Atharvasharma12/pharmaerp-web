# PharmaERP — Design Standards

> **Single source of truth for all visual and interactive decisions.**
> This is a curated, opinionated document synthesized from our design engineering skills (`emil-design-eng`, `design-taste-frontend`, `impeccable`, `ui-ux-pro-max`, `frontend-design`).
> Every developer and AI assistant building or redesigning pages MUST follow these standards so the entire ERP feels like one unified, ultra-polished product.

---

## Operating Mode: Operate

This ERP operates strictly in **Operate Mode** (per design intelligence taxonomy).
- **Users**: Pharmacists, inventory managers, cashiers, administrators.
- **Core Jobs**: High-speed data entry, table scanning, inventory audits, billing, order processing.
- **Philosophy**: **Scanability & Speed over Decoration.**
- **Goal**: When a feature works with frictionless correctness, the user never consciously thinks about the UI. Invisible details compound into effortless speed.

---

## Table of Contents

1. [Typography & Numeric Data](#1-typography--numeric-data)
2. [Spacing & Padding System](#2-spacing--padding-system)
3. [Layout Shell & Measurements](#3-layout-shell--measurements)
4. [Border Radius & Shape Consistency Lock](#4-border-radius--shape-consistency-lock)
5. [Shadows & Elevation Ladder](#5-shadows--elevation-ladder)
6. [Color Tokens & Palette Discipline](#6-color-tokens--palette-discipline)
7. [Iconography Standards](#7-iconography-standards)
8. [Component Sizing & Tap Targets](#8-component-sizing--tap-targets)
9. [Animation, Motion & Perceived Performance](#9-animation-motion--perceived-performance)
10. [Z-Index Layer Hierarchy](#10-z-index-layer-hierarchy)
11. [Component State Cycles](#11-component-state-cycles)
12. [Accessibility & Contrast Floors](#12-accessibility--contrast-floors)
13. [Dual-Layout & Breakpoint Policy](#13-dual-layout--breakpoint-policy)
14. [Pre-Delivery Verification Audit](#14-pre-delivery-verification-audit)

---

## 1. Typography & Numeric Data

### 1.1 Global Font
```css
font-family: "Inter", system-ui, -apple-system, sans-serif;
```
- **Body Font**: Set once globally in `index.css`. Never specify inline `font-family`.
- **Numeric Alignment**: ALWAYS add `tabular-nums` (`font-variant-numeric: tabular-nums`) to columns/elements displaying currency, stock quantities, SKU codes, phone numbers, and timestamps to eliminate layout jitter during live updates.

---

### 1.2 Desktop Type Scale

| Role | Size | Weight | Line Height | Tailwind Classes | Usage Context |
|---|---|---|---|---|---|
| **Page Title** | `28px` | `800` | `1.2` | `text-[28px] font-extrabold leading-tight` | Exactly one `<h1>` per page |
| **Section Title** | `20px` | `700` | `1.3` | `text-xl font-bold` | Section headers (`<h2>`) |
| **Card Title** | `16px` | `700` | `1.35` | `text-base font-bold` | Panel / Card headers (`<h3>`) |
| **Sub-label / Group** | `13px` | `600` | `1.4` | `text-[13px] font-semibold` | Group headers, table section titles |
| **Body (Primary)** | `15px` | `400` | `1.6` | `text-[15px]` | Main descriptive / form body text |
| **Body (Secondary)** | `14px` | `400` | `1.6` | `text-sm` | Meta text, supporting notes |
| **Caption / Helper** | `12px` | `400` | `1.5` | `text-xs` | Input hints, timestamps, footer notes |
| **Status Badge** | `11px` | `600` | `1` | `text-[11px] font-semibold tracking-wide` | Status chips & pills |
| **Table Header** | `12px` | `700` | `1` | `text-xs font-bold uppercase tracking-widest` | Column headers (always uppercase) |
| **Table Cell** | `14px` | `400` | `1.5` | `text-sm tabular-nums` | Standard table row content |
| **Button (sm)** | `13px` | `600` | `1` | `text-[13px] font-semibold` | Compact / inline action buttons |
| **Button (md)** | `14px` | `600` | `1` | `text-sm font-semibold` | Standard buttons (default) |
| **Button (lg)** | `15px` | `700` | `1` | `text-[15px] font-bold` | Primary call-to-action / Hero |
| **Form Label** | `13px` | `500` | `1.4` | `text-[13px] font-medium` | Placed strictly ABOVE input |
| **Form Error** | `12px` | `500` | `1.4` | `text-xs font-medium text-error` | Validation feedback below input |
| **Sidebar Item** | `13px` | `500` | `1` | `text-[13px] font-medium` | Navigation item link |
| **Sidebar (Active)** | `13px` | `700` | `1` | `text-[13px] font-bold` | Currently active route |

---

### 1.3 Mobile Type Scale

| Role | Size | Weight | Line Height | Usage Context |
|---|---|---|---|---|
| **Page Title** | `22px` | `800` | `1.2` | Mobile page header `<h1>` |
| **Section Title** | `16px` | `700` | `1.3` | Mobile card group header |
| **Card Title** | `15px` | `700` | `1.35` | Mobile entity card title |
| **Body (Primary)** | `14px` | `400` | `1.6` | Readable descriptions |
| **Body (Secondary)** | `13px` | `400` | `1.55` | Secondary card details |
| **Caption** | `12px` | `400` | `1.5` | Metadata, subtitle badges |
| **Status Badge** | `11px` | `600` | `1` | Mini status pill |
| **Button** | `14px` | `600` | `1` | All mobile action buttons |
| **Form Label** | `13px` | `500` | `1.4` | Above input field |
| **Bottom Nav** | `10px` | `500` | `1` | Label directly below bottom nav icon |

---

### 1.4 Letter Spacing (Tracking) Rules

- **Standard Body**: `0` (no tracking).
- **Table Headers (ALL CAPS)**: `tracking-widest` (`0.08em`).
- **Section Category Eyebrows**: `tracking-wider` (`0.06em`).
- **Status Pills**: `tracking-wide` (`0.03em`).

---

## 2. Spacing & Padding System

**Base unit = 4px (`0.25rem`).** All spacing, margins, gaps, and padding values must be strict multiples of 4px.

### 2.1 Spacing Ladder

| Token | px | Usage |
|---|---|---|
| `space-1` / `gap-1` | `4px` | Tightest gap: icon + label inside a chip or micro-button |
| `space-2` / `gap-2` | `8px` | Icon + label inside standard buttons; inline tag list |
| `space-3` / `gap-3` | `12px` | Mobile card list gap; mobile input field gap |
| `space-4` / `gap-4` | `16px` | Standard desktop form gap; mobile page horizontal padding |
| `space-5` / `gap-5` | `20px` | Medium section separation |
| `space-6` / `gap-6` | `24px` | Desktop card inner padding; form section gap; desktop outer padding |
| `space-8` / `gap-8` | `32px` | Desktop section vertical rhythm |
| `space-10` / `gap-10` | `40px` | Large page module separation |
| `space-16` | `64px` | Mobile bottom navigation height |
| `space-20` / `pb-20` | `80px` | Mobile page bottom clearance (nav + floating action cushion) |

---

### 2.2 Desktop vs. Mobile Spacing Blueprint

| Layout Zone | Desktop Standard | Mobile Standard |
|---|---|---|
| **Outer Page Horizontal** | `px-6` (`24px`) | `px-4` (`16px`) |
| **Outer Page Top** | `pt-6` (`24px`) | `pt-4` (`16px`) |
| **Outer Page Bottom** | `pb-8` (`32px`) | `pb-20` (`80px` — avoids bottom nav cutoff) |
| **Card Inner Padding** | `p-6` (`24px`) | `p-4` (`16px`) |
| **Section Gap** | `gap-8` or `mb-8` (`32px`) | `gap-4` or `mb-4` (`16px`) |
| **Table Row Vertical** | `py-3.5` (`14px`) | Card list view with `p-4` per item |
| **Table Row Horizontal**| `px-4` (`16px`) | Card list view with `px-4` container |
| **Touch Target Size** | `38px` min height | `44px` strict minimum (width & height) |

---

## 3. Layout Shell & Measurements

### 3.1 Desktop Shell Dimensions
- **Sidebar Width (Expanded)**: `230px` (`w-[230px]`)
- **Sidebar Width (Collapsed)**: `0px` (`w-0 overflow-hidden`)
- **Header Height**: `58px` (`h-[58px] fixed top-0 left-0 right-0`)
- **Main Content Offset**: `ml-[230px] mt-[58px]` (when sidebar expanded)
- **Main Scroll Container**: `h-[calc(100dvh-58px)] overflow-y-auto`
- **Max Content Container Widths**:
  - Standard Management Pages: `max-w-[1200px] mx-auto`
  - High-Density Data Tables: `max-w-[1400px] mx-auto`
  - Focused Forms / Settings: `max-w-[800px] mx-auto`

> **Note**: Never use `h-screen` which triggers viewport jumping on mobile browsers. Use `min-h-[100dvh]` or `h-[calc(100dvh-58px)]`.

---

### 3.2 Mobile Shell Dimensions
- **Header Height**: `56px` (`h-[56px] fixed top-0 left-0 right-0`)
- **Bottom Navigation Height**: `64px` (`h-[64px] fixed bottom-0 left-0 right-0`)
- **Drawer Width**: `w-[85vw] max-w-[320px]`
- **Floating Action Button (FAB)**: `w-14 h-14` (`56px × 56px`), positioned at `fixed bottom-20 right-4` (`80px` from bottom to float neatly above bottom nav).
- **Sticky Bottom Action Bar**: `fixed bottom-16 left-0 right-0 h-16 px-4 py-3 bg-surface border-t border-border flex gap-3`.

---

## 4. Border Radius & Shape Consistency Lock

### Shape Consistency Lock
The border radius defines the visual grammar of the system. Mixing sharp elements with pill elements haphazardly damages visual authority. Every component has an assigned token:

| Component Type | Radius Value | Tailwind Class | Reason |
|---|---|---|---|
| **Buttons (all variants)** | `8px` | `rounded-[8px]` | Clean, responsive modern edge |
| **Form Inputs & Selects** | `12px` | `rounded-[12px]` | Matches MUI OutlinedInput override |
| **Cards & Panels** | `10px` | `rounded-[10px]` | Base token `--radius-lg` (`0.625rem`) |
| **Dropdown Menus & Popovers** | `12px` | `rounded-[12px]` | Smooth floating overlay |
| **Modals & Dialogs** | `16px` | `rounded-[16px]` | High-elevation containment |
| **Mobile Bottom Sheet** | `24px` (top only) | `rounded-t-[24px]` | Tactile bottom-anchored sheet |
| **Status Badges & Pills** | `9999px` | `rounded-full` | Clear status signal |
| **Avatars & FAB** | `9999px` | `rounded-full` | Circular touch/profile anchor |
| **Checkbox** | `4px` | `rounded-[4px]` | Standard checkbox proportion |
| **Table Data Rows** | `0px` | `rounded-none` | Seamless dense tabular grid |
| **Sidebar Active Marker** | `4px` (right side) | `rounded-r-[4px]` | Directional indicator |

---

## 5. Shadows & Elevation Ladder

Shadows must be tinted with the background hue and use CSS variables to adapt automatically to light and dark themes.

### 5.1 Shadow Scale

| Level | CSS Variable | Value (Light) | Component Role |
|---|---|---|---|
| **Level 0** | `none` | `none` | Flat page canvas, standard table rows |
| **Level 1** | `var(--app-shadow-sm)` | `0 2px 8px rgba(15, 23, 42, 0.06)` | **Card resting state**, stats panels |
| **Level 2** | `var(--app-shadow-md)` | `0 8px 20px rgba(15, 23, 42, 0.10)` | **Card hover state**, elevated widgets |
| **Level 3** | `var(--app-shadow-lg)` | `0 18px 45px rgba(15, 23, 42, 0.12)` | **Dropdown menus**, FAB, toast alerts |
| **Level 4** | `var(--app-shadow-xl)` | `0 28px 70px rgba(15, 23, 42, 0.18)` | **Modals**, confirmation dialogs |

### 5.2 Card Hover Elevation Blueprint
```jsx
// Interactive Card Pattern:
<div className="bg-surface border border-border rounded-[10px] p-6 shadow-[var(--app-shadow-sm)] hover:shadow-[var(--app-shadow-md)] transition-shadow duration-200 cursor-pointer">
  {/* Card Content */}
</div>
```

---

## 6. Color Tokens & Palette Discipline

### Color Consistency Lock
- **Never use hardcoded hex or RGB colors** in feature markup.
- **Never use literal Tailwind color classes** (e.g. `bg-green-500`, `text-red-600`, `border-gray-200`).
- **Always use semantic token classes or CSS variables.**

### 6.1 Core Token Reference

| Semantic Token | Tailwind Utility | Semantic Purpose |
|---|---|---|
| `--app-color-bg` | `bg-bg` | Page background canvas |
| `--app-color-surface` | `bg-surface` | Card / Dialog surface |
| `--app-color-surface-alt` | `bg-surface-alt` | Zebra table rows, input backgrounds |
| `--app-color-surface-hover` | `bg-surface-hover` | Table row / List item hover |
| `--app-color-surface-active` | `bg-surface-active` | Selected list row |
| `--app-color-text` | `text-text` | Primary readable text |
| `--app-color-text-muted` | `text-text-muted` | Supporting metadata / label text |
| `--app-color-text-disabled`| `text-text-disabled`| Inactive / disabled content |
| `--app-color-border` | `border-border` | Standard UI boundaries & dividers |
| `--app-color-border-strong`| `border-border-strong`| High-emphasis input & active card borders |
| `--app-color-primary` | `bg-primary` / `text-primary` | Primary brand action |
| `--app-color-primary-soft` | `bg-primary-soft` | Tinted action button or active pill bg |

---

### 6.2 Healthcare / Pharmacy Status Mapping

| Business Status | Text Token | Background Token | Context Example |
|---|---|---|---|
| **Active / Paid / In-Stock** | `text-success` | `bg-success-soft` | Verified branch, paid invoice, item in stock |
| **Pending / Low Stock / Due Soon** | `text-warning` | `bg-warning-soft` | Reorder threshold hit, pending payment |
| **Critical / Expired / Out of Stock / Overdue** | `text-error` | `bg-error-soft` | Drug expired, order cancelled, stock 0 |
| **Draft / In-Review / Queued** | `text-info` | `bg-info-soft` | Draft purchase order, sync queued |
| **Inactive / Archived** | `text-text-muted` | `bg-surface-alt` | Closed branch, archived customer record |

---

## 7. Iconography Standards

**Library: Lucide React v1 ONLY.**
- No emojis (`🗑`, `✅`, `⚠️`) as UI controls.
- No FontAwesome, Material Icons, or raw unstyled SVGs.
- Standardize `strokeWidth={2}` for small/medium icons and `1.75` for large icons.

### Contextual Icon Sizes

| Context | Icon Dimension | Tailwind Class |
|---|---|---|
| **Sidebar Navigation** | `20px` | `size-5` |
| **Small Button / Chip Icon** | `14px` | `size-[14px]` |
| **Standard Button Icon** | `16px` | `size-4` |
| **Large Action / Hero Button**| `18px` | `size-[18px]` |
| **Table Action Icon** | `16px` | `size-4` |
| **Input Prefix / Suffix** | `16px` | `size-4` |
| **Alert / Modal Status Icon** | `20px` | `size-5` |
| **Floating Action Button** | `24px` | `size-6` |
| **Mobile Bottom Nav Icon** | `22px` | `size-[22px]` |
| **Empty State Illustration** | `48px–64px` | `size-12` to `size-16` |

---

## 8. Component Sizing & Tap Targets

### 8.1 Buttons

| Variant | Height | Horizontal Padding | Typography | Border Radius |
|---|---|---|---|---|
| `sm` | `32px` | `px-3` | `text-[13px] font-semibold` | `rounded-[8px]` |
| `md` (default) | `38px` | `px-4` | `text-sm font-semibold` | `rounded-[8px]` |
| `lg` | `46px` | `px-6` | `text-[15px] font-bold` | `rounded-[8px]` |
| `icon-only (md)` | `38px × 38px` | `p-0` | — | `rounded-[8px]` |
| `FAB (mobile)` | `56px × 56px` | `p-0` | — | `rounded-full` |

---

### 8.2 Form Controls & Inputs

| Input Element | Desktop Height | Mobile Height | Padding | Border Radius |
|---|---|---|---|---|
| **Text / Search Input** | `40px` | `48px` | `px-3 py-2` (desk) / `px-4 py-3` (mob) | `rounded-[12px]` |
| **Select / Dropdown Trigger**| `40px` | `48px` | `px-3` (desk) / `px-4` (mob) | `rounded-[12px]` |
| **Textarea** | `min-h-[100px]` | `min-h-[120px]` | `px-3 py-2` | `rounded-[10px]` |
| **Checkbox / Radio** | `18px × 18px` | `20px × 20px` | — | `rounded-[4px]` / `rounded-full` |
| **Toggle Switch** | `24px × 44px` | `24px × 44px` | — | `rounded-full` |

---

### 8.3 Data Tables

| Element | Height | Padding | Typography |
|---|---|---|---|
| **Header Row** | `44px` | `py-3 px-4` | `text-xs font-bold uppercase tracking-widest text-text-muted` |
| **Default Data Row** | `52px` | `py-3.5 px-4` | `text-sm text-text tabular-nums` |
| **Compact Data Row** | `40px` | `py-2.5 px-4` | `text-xs text-text tabular-nums` |
| **Pagination Bar** | `48px` | `px-4 py-2` | `text-sm text-text-muted` |

---

## 9. Animation, Motion & Perceived Performance

> **Motion Philosophy (Emil Kowalski)**:
> 1. **Frequency Rule**: Keyboard actions & high-frequency tools (100+/day) have **ZERO animation**.
> 2. **Speed Rule**: All interactive UI animations must settle in **under 300ms**.
> 3. **Easing Rule**: Never use `ease-in` for entering elements. Use custom `ease-out`.
> 4. **Origin Rule**: Popovers scale from their trigger; modals stay centered.
> 5. **Realism Rule**: Never animate from `scale(0)`; start from `scale(0.95)` with opacity.

---

### 9.1 Custom Easing Curves
```css
/* Snappy entry for dropdowns, modals, toasts */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);

/* Natural screen morphing / layout shifts */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);

/* iOS style drawer slide */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

---

### 9.2 Duration Scale

| Interaction | Duration | Curve | Property |
|---|---|---|---|
| **Button Click / Press** | `120ms` | `ease-out` | `transform: scale(0.97)` |
| **Hover Color Transition** | `150ms` | `ease` | `transition-colors` |
| **Card Shadow Lift** | `200ms` | `ease-out` | `transition-shadow` |
| **Input Focus Ring** | `180ms` | `ease` | `transition-[border-color,box-shadow]` |
| **Dropdown / Popover Open** | `160ms` | `var(--ease-out)` | `opacity, transform` |
| **Modal / Dialog Enter** | `220ms` | `var(--ease-out)` | `opacity: 0->1, scale: 0.96->1` |
| **Desktop Page Entry** | `250ms` | `var(--ease-out)` | `opacity: 0->1, y: 12->0` |
| **Mobile Drawer Slide** | `300ms` | `var(--ease-drawer)`| `transform: translateX` |
| **Toast Enter / Exit** | `200ms` / `150ms` | `ease-out` / `ease-in` | `transform: translateY` |

---

### 9.3 GPU Acceleration Discipline
Always animate `transform` and `opacity` directly.
```jsx
// Correct: Hardware-accelerated GPU transform string
<motion.div
  initial={{ opacity: 0, transform: "translateY(12px) scale(0.98)" }}
  animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
>
  {content}
</motion.div>
```

---

### 9.4 Reduced Motion Fallback (Mandatory)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Z-Index Layer Hierarchy

Never use arbitrary values like `z-[9999]`. Strict layer hierarchy:

| Level | Value | Tailwind | Interface Element |
|---|---|---|---|
| **Canvas** | `0` | `z-0` | Normal document flow & page cards |
| **Sticky Headers** | `10` | `z-10` | Sticky table headers, action bars |
| **Desktop Sidebar**| `20` | `z-20` | Persistent left navigation |
| **Desktop Topbar** | `30` | `z-30` | Persistent top navigation bar |
| **Mobile Topbar** | `30` | `z-30` | Mobile header |
| **FAB** | `40` | `z-40` | Floating Action Button |
| **Drawers / Sheets**| `50` | `z-50` | Mobile navigation drawer, filter sheet |
| **Bottom Navigation**| `50` | `z-50` | Mobile bottom tab bar |
| **Sticky Action Bar**| `50` | `z-50` | Mobile fixed bottom form submit bar |
| **Dropdown Menus** | `50` | `z-50` | Select menus, popovers |
| **Modals / Dialogs**| `60` | `z-[60]` | Modal backdrop & dialog card |
| **Toasts** | `70` | `z-[70]` | Sonner notifications stack |
| **Tooltips** | `80` | `z-[80]` | Instant hover micro-tooltips |

---

## 11. Component State Cycles

Every interactive element must gracefully render all states:

```
[ Default ] ──Hover──> [ Hovered ] ──Focus──> [ Focused (Ring) ]
     │                      │
  Disabled               Pressed (scale 0.97)
     │                      │
[ Disabled (50%) ]      [ Loading (Skeleton / Spinner) ]
                            │
                        [ Error / Empty ]
```

1. **Active Feedback**: All clickable buttons MUST include `active:scale-[0.97] transition-transform`.
2. **Focus-Visible**: Keyboard tab focus must display `focus-visible:ring-2 focus-visible:ring-primary/40 outline-none`.
3. **Touch Hover Guard**: Hover transitions must be gated with `@media (hover: hover)` or Tailwind `hover:` to prevent sticky touch hover on mobile devices.
4. **Empty State Component**: When lists are empty, render a dedicated container with a 48px icon (`text-text-muted`), clear explanation headline, and primary action button.

---

## 12. Accessibility & Contrast Floors

1. **Contrast Standard**:
   - Body & Small Text (< 18px): **4.5:1 minimum contrast ratio**.
   - Large Headings (≥ 18px bold / 24px regular): **3.0:1 minimum**.
   - Input borders against canvas: **3.0:1 minimum**.
2. **Form Label Association**: Every input must have an explicit `<label htmlFor="id">` placed above it. Placeholders cannot substitute labels.
3. **Keyboard Dismissal**: All dialogs, sheets, and popovers MUST listen for and dismiss on `Escape` keypress.
4. **Color Independence**: Color cannot be the only state carrier. Badges must combine color with a clear text label and optional icon.

---

## 13. Dual-Layout & Breakpoint Policy

### The Dual-Layout Architecture
PharmaERP separates desktop and mobile views into dedicated pages to deliver tailored density and interactions:
```
FeaturePage.jsx (Parent Gate: useIsMobile() conditional render ONLY)
├── desktop/FeatureDesktopPage.jsx  (Assumes lg: 1024px+ screen)
└── mobile/FeatureMobilePage.jsx    (Assumes < 768px screen)
```

### Breakpoint Policy
- **Desktop Pages**: Never write `<md:` mobile fallbacks in desktop page files. They are built for wide displays with dense multi-column grids and rich tables.
- **Mobile Pages**: Never write `lg:` desktop overrides in mobile page files. They are built for single-column vertical card flows and bottom-anchored actions.
- **Shared Components**: Allowed to use responsive prefixes (`sm:`, `md:`, `lg:`) for reusable utility components.

---

## 14. Pre-Delivery Verification Audit

Before marking any UI redesign or feature build complete, verify against this checklist:

### Visual & Typography Quality
- [ ] Only one `<h1>` per page (28px desktop / 22px mobile).
- [ ] All table headers are `text-xs font-bold uppercase tracking-widest`.
- [ ] Number, currency, and date columns use `tabular-nums`.
- [ ] Zero emoji icons used (Lucide React SVG icons only).
- [ ] Icon sizes strictly match the contextual specification table.

### Spacing & Layout Integrity
- [ ] All margins, paddings, and gaps are strict multiples of 4px.
- [ ] Desktop page has `px-6 pt-6 pb-8`; Mobile page has `px-4 pt-4 pb-20`.
- [ ] No `h-screen` viewport bugs; uses `min-h-[100dvh]` or `calc(100dvh - 58px)`.
- [ ] Mobile touch targets meet 44px minimum height and width.

### Shape & Color Token Discipline
- [ ] Zero hardcoded hex codes (`#...`) or raw RGB values in JSX/TSX.
- [ ] Shape consistency locked: Buttons `8px`, Inputs `12px`, Cards `10px`, Modals `16px`, Chips `9999px`.
- [ ] All status indicators match the semantic color mapping table.

### Interaction & Motion Polish
- [ ] All pressable elements have `cursor-pointer` and `:active` scale (`scale(0.97)`).
- [ ] No entry animations use `scale(0)` (uses `scale(0.95)` with opacity fade).
- [ ] All interactive animation durations are under 300ms with custom easing curves.
- [ ] `prefers-reduced-motion` is fully respected.

### Parent Page & Performance Verification
- [ ] Parent gate contains zero UI markup — only routes to desktop or mobile child.
- [ ] No missing dependencies in `useEffect` causing render loops.
- [ ] API calls are guarded and memoized — no duplicate fetches per render cycle.
- [ ] Cleanups configured for subscriptions and timers to prevent memory leaks.

---

*PharmaERP Design Standards v2.0*  
*Curated & enforced across the entire ERP ecosystem.*

