# PharmaERP — Universal Design Standards (v3.0)

> **Single Source of Truth for all visual, ergonomic, responsive, and interactive decisions.**
> Synthesized from world-class design engineering standards (`emil-design-eng`, `design-taste-frontend`, `impeccable`, `apple-design`, `ui-ux-pro-max`, `frontend-design`).
> Every developer and AI assistant building or redesigning pages **MUST** follow these standards so the entire ERP feels like one unified, ultra-polished, multi-device enterprise platform.

---

## 1. Operating Mode: Operate

This ERP operates strictly in **Operate Mode**:
- **Users**: Pharmacists, inventory managers, billing cashiers, procurement officers, administrators.
- **Core Jobs**: High-speed data entry, inventory audits, batch-expiry tracking, POS checkout, journal vouchers, report generation.
- **Design Philosophy**: **Scanability, Speed, and Zero Visual Noise over Fluff.**
- **Ergonomic Goal**: Every interaction must feel instantaneous, physical, and effortless across all devices.

---

## 2. Universal Multi-Device & Form-Factor Architecture

The ERP interface is engineered to adapt gracefully across **all 7 device form factors and viewport conditions**:

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

### 2.1 Device-Specific Layout Specifications

#### 1. Compact & Narrow Foldables (`280px` – `360px`)
- **Container**: `w-full px-3.5 pt-4 pb-16`. Never use hardcoded fixed pixel widths (e.g. `w-[390px]`).
- **Typography**: Fluid scale (`text-[20px]` titles, `text-[12.5px]` body, `text-[11px]` labels).
- **Form Layout**: 100% single-column vertical flow with min `44px` touch targets.
- **Input Gaps**: Compact `gap-3` to avoid pushing actions below the fold.

#### 2. Standard Mobile Phones (`360px` – `480px`)
- **Container**: `w-full max-w-[390px] mx-auto p-5 sm:p-6 rounded-[18px] border border-border bg-surface shadow-[var(--app-shadow-lg)]`.
- **Navigation**: Bottom-anchored tab bar (`h-16 pb-[max(1rem,env(safe-area-inset-bottom))]`).
- **Hero/Illustrations**: Compact vector SVGs (`max-h-[120px]`) centered above the title.

#### 3. Unfolded Foldables & Phablets (`480px` – `767px`)
- **Container**: Centered card container (`w-full max-w-[440px] mx-auto p-6 sm:p-7 rounded-[18px]`).
- **Why**: Unfolded foldables have square-like aspect ratios (~4:3). Edge-to-edge inputs look stretched and strain the eye; a centered `440px` card maintains optimal scanability.

#### 4. Tablets in Portrait (`768px` – `1023px`)
- **Container**: Centered desktop card container (`w-full max-w-[480px] lg:max-w-none mx-auto p-8 rounded-[16px] border border-border bg-surface`).
- **Layout**: Renders the **Desktop Page** architecture with the hero card hidden/collapsed, presenting a clean, focused, desktop-grade form with 28px typography.

#### 5. Short Laptops & Landscape Tablets (`1024px` – `1279px`, Height `< 700px`)
- **Container**: Full dual-column split (`lg:grid-cols-12 max-w-[1200px] mx-auto`).
- **Crucial Rule for Short Screens**:
  - **NEVER** use rigid fixed heights (e.g. fixed `h-[700px]` or unscrollable containers).
  - **ALWAYS** use `min-h-[100dvh] flex flex-col justify-center py-6 sm:py-8 lg:py-10` with `my-auto` on the card container.
  - If usable screen height is reduced by browser bookmarks/toolbars to 580px, the card must scroll naturally without clipping action buttons or footers.

#### 6. Standard Desktop & Wide Displays (`1280px` – `1536px`)
- **Container**: `max-w-[1200px] mx-auto min-h-[640px] rounded-[16px] border border-border bg-surface shadow-[var(--app-shadow-lg)]`.
- **Sidebar**: Dual-rail navigation (240px expanded <-> 68px collapsed mini-rail).
- **Hero Card**: Vibrant gradient background with interactive live dashboard mockups.

#### 7. Ultra-wide & 4K Displays (`> 1536px`)
- **Boundary**: Strict max-width boundary (`max-w-[1280px]` or `max-w-7xl mx-auto`).
- **Guards**: Inputs and form fields must never stretch across 1800px+ spans.

---

## 3. Typography & Numeric Scale

### 3.1 Global Typography Configuration
- **Font Family**: `"Inter", system-ui, -apple-system, sans-serif;`
- **Numeric Alignment**: ALWAYS add `tabular-nums` (`font-variant-numeric: tabular-nums`) to columns and components displaying currency, stock quantities, SKU codes, phone numbers, and timestamps.

### 3.2 Desktop & Tablet Type Scale (>= 768px)

| Role | Size | Weight | Line Height | Tailwind Class | Context |
|---|---|---|---|---|---|
| **Page Title** | `28px` | `800` | `1.2` | `text-[28px] font-extrabold leading-tight` | Exactly one `<h1>` per page |
| **Section Title** | `20px` | `700` | `1.3` | `text-xl font-bold` | Section headers (`<h2>`) |
| **Card Title** | `16px` | `700` | `1.35` | `text-base font-bold` | Panel / Card headers (`<h3>`) |
| **Form Label** | `13px` | `500` | `1.4` | `text-[13px] font-medium text-text` | Placed strictly ABOVE input |
| **Body (Primary)** | `15px` | `400` | `1.6` | `text-[15px] text-text` | Main descriptive / content text |
| **Body (Secondary)**| `14px` | `400` | `1.6` | `text-sm text-text-muted` | Meta text, supporting notes |
| **Caption / Helper**| `12px` | `400` | `1.5` | `text-xs text-text-muted` | Input hints, timestamps |
| **Form Error** | `12px` | `500` | `1.4` | `text-xs font-medium text-error` | Validation feedback below input |
| **Button (CTA)** | `15px` | `700` | `1` | `text-[15px] font-bold` | Primary call-to-action |
| **Button (Standard)**| `14px`| `600` | `1` | `text-sm font-semibold` | Secondary actions |
| **Sidebar Item** | `13px` | `500` | `1` | `text-[13px] font-medium` | Navigation item link |

### 3.3 Mobile & Foldable Type Scale (< 768px)

| Role | Size | Weight | Line Height | Tailwind Class | Context |
|---|---|---|---|---|---|
| **Page Title** | `22px` | `800` | `1.2` | `text-[22px] font-extrabold leading-[1.2]` | Mobile screen `<h1>` |
| **Section Title** | `16px` | `700` | `1.3` | `text-base font-bold` | Mobile card group title |
| **Card Title** | `15px` | `700` | `1.35` | `text-[15px] font-bold` | Entity card title |
| **Form Label** | `13px` | `500` | `1.4` | `text-[13px] font-medium` | Above input field |
| **Body (Primary)** | `14px` | `400` | `1.6` | `text-sm text-text` | Readable descriptions |
| **Body (Secondary)**| `13px` | `400` | `1.55` | `text-[13px] text-text-muted` | Secondary card details |
| **Caption** | `11.5px`| `400` | `1.45` | `text-[11.5px] text-text-muted`| Metadata, terms notice |
| **Button** | `14px` | `600` | `1` | `text-sm font-semibold` | All mobile action buttons |

---

## 4. Spacing, Rhythm & Touch Ergonomics

**Base Unit = 4px (`0.25rem`).** All spacing values must be strict multiples of 4px.

### 4.1 Spacing Ladder
- `space-1` (`4px`): Micro badge padding, tight icon gap.
- `space-2` (`8px`): Button internal icon gap, inline chip list.
- `space-3` (`12px`): Mobile input field gap (`gap-3`), compact card lists.
- `space-3.5` (`14px`): Desktop auth input gap (`gap-3.5`).
- `space-4` (`16px`): Standard desktop form gap, mobile horizontal padding.
- `space-5` (`20px`): Section divider gap, social button spacing (`gap-5`).
- `space-6` (`24px`): Card padding, large button separation.
- `space-8` (`32px`): Desktop canvas padding (`p-8`), section rhythm.
- `space-16` (`64px`): Mobile bottom navigation height.
- `space-20` (`80px`): Mobile bottom clearance buffer (`pb-20`).

### 4.2 Touch & Stylus Ergonomics Floor
1. **Minimum Touch Target**: Every interactive element (button, input, select, checkbox, tab, link) must meet a minimum hit area of **`44px × 44px`** on touch viewports.
2. **Touch-Safe Hover States**: Prevent sticky hover bugs on touch devices by using Tailwind `hover:` or `@media (hover: hover)`.
3. **Physical Feedback**: All pressable elements MUST include `active:scale-[0.97] transition-transform` for instant physical confirmation.
4. **Safe Area Insets**: Fixed bottom bars must use `pb-[max(1rem,env(safe-area-inset-bottom))]`.

---

## 5. Shape Consistency & Border Radius Lock

| Element | Radius Spec | Tailwind Class | Reason |
|---|---|---|---|
| **Buttons (All)** | `8px` | `rounded-[8px]` | Modern, crisp enterprise feel |
| **Input Fields** | `12px` | `rounded-[12px]` | Soft, distinct boundary for typing |
| **Badges / Status Pills**| `9999px`| `rounded-full` | Unmistakable pill shape |
| **Inner Cards / Hero** | `14px` | `rounded-[14px]` | Nested card proportional rounding |
| **Desktop Outer Shell** | `16px` | `rounded-[16px]` | Elevated outer container boundary |
| **Mobile Card Container**| `18px` | `rounded-[18px]` | Native iOS/Android sheet curvature |
| **Checkboxes / Mini Icons**| `4px`–`6px`| `rounded-[4px]` | Crisp corner definition |

---

## 6. Color Tokens & Semantic Hierarchy

**Zero Hardcoded Hex Codes.** All styles must strictly reference CSS theme variables or Tailwind semantic tokens.

### 6.1 Core Semantic Token Map
- `bg-bg`: Page canvas background (`var(--app-color-bg)`).
- `bg-surface`: Elevated card / panel background (`var(--app-color-surface)`).
- `bg-surface-alt`: Zebra striping / input background (`var(--app-color-surface-alt)`).
- `bg-surface-hover`: Hover state background (`var(--app-color-surface-hover)`).
- `text-text`: Primary high-contrast text (`var(--app-color-text)`).
- `text-text-muted`: Secondary / placeholder text (`var(--app-color-text-muted)`).
- `border-border`: Standard container border (`var(--app-color-border)`).
- `border-border-strong`: Emphasized focus border (`var(--app-color-border-strong)`).
- `bg-primary`: Primary brand action color (`var(--app-color-primary)`).
- `bg-primary-soft`: Tinted brand background (`var(--app-color-primary-soft)`).
- `text-error` & `bg-error-soft`: Destructive / validation feedback.
- `text-success` & `bg-success-soft`: Positive confirmation / active state.

---

## 7. Motion, Animation & Perceived Speed

Synthesized from **Emil Kowalski Design Engineering** principles:

1. **Duration Budget**: UI animations must never exceed **`300ms`** (`0.25s` – `0.3s` optimal).
2. **Easing Curves**:
   - UI Entry: `cubic-bezier(0.23, 1, 0.32, 1)` (snappy start, natural settle).
   - Drawer / Sheets: `cubic-bezier(0.32, 0.72, 0, 1)` (iOS-like physics).
   - Never use `ease-in` for interactive UI (feels sluggish).
3. **No Scale Zero**: Never animate from `scale(0)`. Always animate from `scale(0.95)` to `scale(1)` with opacity fade.
4. **Reduced Motion**: Always support `prefers-reduced-motion: reduce`.

---

## 8. Zero Legacy Component Policy

> **CRITICAL ENFORCEMENT**:
> Under NO circumstances should any newly designed page or app shell import or use legacy `App*` components (`AppBox`, `AppButton`, `AppCard`, `AppCheckbox`, `AppHeading`, `AppInput`, `AppLink`, `AppPasswordInput`, `AppStack`, `AppText`).
> All components must be built directly using **Tailwind CSS v4 utilities + semantic CSS tokens + Lucide React icons + Framer Motion**.

---

## 9. Pre-Delivery Multi-Device Verification Checklist

Before marking any UI work complete, verify against this strict checklist:

- [ ] **Compact / Folded (< 360px)**: Verified single-column flow, `px-3.5`, zero horizontal overflow.
- [ ] **Standard Mobile (360px – 480px)**: Verified centered `390px` card, touch targets ≥ 44px.
- [ ] **Unfolded Foldable (480px – 767px)**: Verified centered `440px` card, no stretched inputs.
- [ ] **Tablet Portrait (768px – 1023px)**: Verified adaptive single-column desktop card (`max-w-[480px]`).
- [ ] **Short Laptop Screen (Height < 700px)**: Verified `min-h-[100dvh]`, `my-auto`, smooth vertical scroll, zero button clipping.
- [ ] **Standard & Ultra-wide Desktop (1024px – 4K)**: Verified dual-panel split with centered max-width constraint.
- [ ] **Typography Lock**: Exactly one `<h1>` per page (28px desktop / 22px mobile).
- [ ] **Shape Lock**: Buttons `8px`, Inputs `12px`, Desktop Shell `16px`, Mobile Shell `18px`.
- [ ] **Zero Hardcoded Colors**: All classes use semantic tokens (`bg-bg`, `bg-surface`, `text-text`, etc.).
- [ ] **Build Validation**: `npx vite build --mode development` passes with Exit Code 0.

---

*PharmaERP Universal Design Standards v3.0*  
*Curated & enforced across the entire ERP ecosystem.*
