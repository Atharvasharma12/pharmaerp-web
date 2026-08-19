# PharmaERP — UI Design Guide

> **Read this before writing any UI code.**
> This guide covers the technology stack, design philosophy, dual-layout architecture, design tokens, component library usage, desktop vs. mobile principles, shadcn/ui integration, and pre-delivery checklist.
> For pixel-exact measurements, type scales, shape consistency rules, and motion curves, see the **[DESIGN_STANDARDS.md](file:///c:/Users/Intel/Desktop/erp/erp-frontend/docs/DESIGN_STANDARDS.md)** specification.

---

## CRITICAL RULE — Fresh UI Build Policy

> **NEVER use existing `App*` components when building fresh UI.**
>
> Do NOT import or reference: `AppButton`, `AppInput`, `AppCard`, `AppHeading`, `AppText`,
> `AppTable`, `AppForm`, `AppFormField`, `AppFormSection`, `AppFormActions`, `AppAlert`,
> `AppSkeleton`, `AppModal`, `AppBox`, `AppIconButton`, `AppLoadingButton`, or any other
> component from `src/components/` — because these are legacy MUI-wrapped components
> that carry the old design system styles.
>
> **The mandatory workflow for every new UI build:**
>
> **Phase 1 — Build primitives first**
> Build all reusable base components from scratch using only:
> - Tailwind CSS v4 utility classes + semantic color tokens
> - shadcn/ui Radix primitives (raw — for interactive behavior)
> - Lucide React icons
> - Framer Motion (for animation)
> - CSS custom properties (`var(--app-color-*)`)
>
> **Phase 2 — Build feature pages**
> Build desktop and mobile pages using ONLY the components you created in Phase 1.
> Do NOT mix old `App*` components with new primitives.
>
> This ensures the UI is fresh, intentional, and fully consistent with the new design system.

---

## CRITICAL RULE — Logic & Optimization Policy

> **UI tasks: touch only the visual layer.**
> When asked to redesign, restyle, or build a page's UI, **do NOT change business logic** — do not touch:
> - Redux slices, actions, or reducers
> - API service files (`*Service.js`, `*Api.js`, `axiosInstance`)
> - Feature hooks that contain data-fetching or mutation logic
> - Route definitions or access-control guards
> - Any shared utility that alters data transformation

> **Exception — Parent page optimization is MANDATORY.**
> You **MUST** fix parent-page logic whenever you find any of these problems while doing UI work:
>
> | Problem | What to fix |
> |---|---|
> | Infinite re-render / effect loop | Fix `useEffect` deps array; memoize callbacks with `useCallback` |
> | Memory leak (unmounted component updates state) | Add cleanup function or `AbortController` in `useEffect` |
> | Redundant / duplicate API calls on every render | Stabilise selector references; add `enabled` guard; use `useMemo` |
> | Prop drilling explosion across 4+ levels | Lift to context or feature hook — do not silently leave it |
> | Missing loading / error state that causes blank screen | Add loading guard and error fallback in parent |
> | Stale closure capturing old state | Refactor with `useRef` or move computation outside effect |
>
> **In summary:** UI = UI only. But if the parent page is broken or wasteful, fix it — the ERP must be fast and correct.

---

## Table of Contents

1. [Stack Overview](#1-stack-overview)
2. [Design Philosophy](#2-design-philosophy)
3. [Dual-Layout Architecture](#3-dual-layout-architecture)
4. [File and Folder Structure](#4-file-and-folder-structure)
5. [Design Tokens and CSS Variables](#5-design-tokens-and-css-variables)
6. [Tailwind CSS v4 Usage](#6-tailwind-css-v4-usage)
7. [shadcn/ui Integration](#7-shadcnui-integration)
8. [Component Library](#8-component-library)
9. [Desktop UI Principles](#9-desktop-ui-principles)
10. [Mobile UI Principles](#10-mobile-ui-principles)
11. [Theme System](#11-theme-system)
12. [Typography](#12-typography)
13. [Animation and Motion](#13-animation-and-motion)
14. [Icon Usage Rules](#14-icon-usage-rules)
15. [Pre-Delivery Checklist](#15-pre-delivery-checklist)

---

## 1. Stack Overview

| Layer | Technology | Notes |
|---|---|---|
| Framework | React 19 | Functional components + hooks only |
| Build Tool | Vite 8 | `npm run dev` for local dev |
| Routing | React Router DOM v7 | Feature-based routing |
| State | Redux Toolkit | `useSelector` / `useDispatch` via feature hooks |
| HTTP | Axios | Centralised service layer per feature |
| Styling | Tailwind CSS v4 | Utility classes; no inline style objects for layout |
| Component Primitives | shadcn/ui (radix-nova) | Installed in `src/components/ui/` |
| UI Framework | MUI v9 | Wrapped into App* components |
| Charts | MUI X Charts | Wrapped in `src/components/charts/` |
| Animation | Framer Motion v12 | Page transitions and micro-animations |
| Icons | Lucide React v1 | Primary icon set — no emojis as icons |
| Date Handling | Day.js | |
| Font | Geist Variable | `@fontsource-variable/geist` |

---

## 2. Design Philosophy

This ERP serves enterprise users (pharmacists, branch managers, admins) who work with it all day. The design must be:

### 2.1 Enterprise-First Principles

- **Scanability over Beauty** — Users scan tables, not admire them. Dense data with clear hierarchy beats decorative fluff.
- **Speed** — Every interaction must feel instant. No janky transitions on data tables.
- **Consistency** — Same component, same behavior everywhere. No one-off custom components.
- **Context Awareness** — Every page reflects the current Workspace → Company → Branch hierarchy.

### 2.2 Visual Identity

| Attribute | Value |
|---|---|
| Primary Brand Color | Emerald Green `#00994a` (default theme) |
| Typography | Geist Variable — clean, modern, enterprise |
| Corner Radius | `0.625rem` base (via `--radius`) |
| Shadow Philosophy | Subtle, layered. No harsh drop-shadows |
| Dark Mode | Full support via `.dark` class toggle |
| Themes | 5 themes: Emerald, Classic Blue, Slate, Warm, Indigo |

### 2.3 Color Rules

- **NEVER** use hardcoded hex colors in page/feature markup.
- **ALWAYS** use CSS variables: `var(--app-color-primary)`, `var(--app-color-text)`, etc.
- **OR** use Tailwind semantic tokens: `bg-primary`, `text-text`, `bg-surface`, `border-border`.
- Semantic states: `bg-success-soft`, `text-error`, `bg-warning-soft` etc.

---

## 3. Dual-Layout Architecture

This is the **most important architectural pattern** in the project.

### 3.1 The Three-Layer Pattern

Every feature page follows exactly this structure:

```
FeaturePage.jsx              <- PARENT: isMobile gate only (zero UI)
|-- desktop/
|   `-- FeatureDesktopPage.jsx   <- CHILD: Desktop-only UI
`-- mobile/
    `-- FeatureMobilePage.jsx    <- CHILD: Mobile-only UI
```

### 3.2 The Parent Page (Gate Component)

The parent page is always thin — it only decides which child to render:

```jsx
// src/features/branch/pages/BranchesPage.jsx

import { useIsMobile } from "@/hooks";
import { BranchesDesktopPage } from "./desktop";
import { BranchesMobilePage } from "./mobile";

const BranchesPage = () => {
  const isMobile = useIsMobile();
  return isMobile ? <BranchesMobilePage /> : <BranchesDesktopPage />;
};

export default BranchesPage;
```

**Rules for the parent page:**
- No UI markup whatsoever
- No direct API calls or state (unless passing shared data as props to both children)
- Only `useIsMobile()` + conditional render
- Shared business logic (data fetch, delete handlers, filters state) lives here and is passed as props

### 3.3 The Layout Shell

The layout shell (`AppLayout.jsx`) mirrors this same pattern at the top level:

```
AppLayout.jsx
|-- AppDesktopLayout  -> Sidebar (230px) + Header (58px) + Outlet
`-- AppMobileLayout   -> Header + Sidebar Drawer + Outlet + BottomNav (64px)
```

**Desktop layout measurements:**
- Sidebar width: `230px` (collapsible to `0`)
- Header height: `58px` (fixed top)
- Content area: `ml-[230px] mt-[58px]`
- Main scroll: `h-[calc(100vh-58px)] overflow-auto`

**Mobile layout measurements:**
- Header: fixed top
- Bottom nav: `pb-16` (64px) body padding — `AppMobileLayout` handles this
- Content: `px-3 py-4 min-h-[calc(100vh-128px)]`

---

## 4. File and Folder Structure

```
src/
|-- app/                          # App entry, router config
|-- assets/                       # Static assets (images, icons)
|-- components/
|   |-- ui/                       # shadcn/ui primitives + custom base UI
|   |   |-- buttons/              # AppButton, AppIconButton, AppLoadingButton, AppSplitButton
|   |   |-- inputs/               # Form input components
|   |   |-- overlays/             # Modal, Dialog, Drawer, Popover
|   |   |-- feedback/             # Alert, Toast, Skeleton, Spinner, Progress
|   |   |-- navigation/           # Tabs, Breadcrumb, Stepper, Pagination
|   |   |-- layout/               # Card, Box, Divider, Stack, Grid
|   |   |-- typography/           # AppHeading, AppText
|   |   `-- data-display/         # Chip, Badge, Avatar, Tooltip, Tag
|   |-- charts/                   # Chart wrappers (MUI X Charts)
|   |-- shared/                   # Domain-agnostic composite components
|   |   |-- page/                 # PageContainer, PageToolbar, PageContent, PageActions
|   |   |-- tables/               # AppTable, DataTable, AppResponsiveTable, AppTablePagination
|   |   |-- forms/                # AppForm, AppFormField, AppFormSection, AppFormActions
|   |   |-- dialogs/              # AppConfirmModal, info dialogs
|   |   |-- filters/              # Filter panels and search bars
|   |   |-- display/              # Generic display helpers
|   |   |-- activity/             # Activity feeds and logs
|   |   `-- theme/                # Theme switcher, dark mode toggle
|   `-- features/                 # Feature-specific shared components (e.g. notifications)
|
|-- features/
|   `-- <feature-name>/
|       |-- pages/
|       |   |-- FeaturePage.jsx           <- Parent gate (isMobile only)
|       |   |-- desktop/
|       |   |   |-- FeatureDesktopPage.jsx
|       |   |   `-- index.js
|       |   `-- mobile/
|       |       |-- FeatureMobilePage.jsx
|       |       `-- index.js
|       |-- hooks/                        # useFeature.js
|       |-- services/                     # API calls
|       |-- store/                        # Redux slice
|       |-- routes/                       # Route definitions
|       `-- index.js                      # Public API
|
|-- layouts/
|   |-- app/
|   |   |-- AppLayout.jsx                 # Boot + isMobile gate
|   |   |-- desktop/                      # AppDesktopLayout, AppDesktopHeader, AppDesktopSidebar
|   |   `-- mobile/                       # AppMobileLayout, AppMobileHeader, AppMobileBottomNav, AppMobileSidebar
|   |-- auth/
|   |-- onboarding/
|   `-- public/
|
|-- theme/
|   |-- tokens.js                         # All color token definitions for 5 themes
|   |-- createAppTheme.js                 # MUI theme factory
|   `-- getThemeTokens.js
|
|-- hooks/                                # useIsMobile, useDebounce, etc.
|-- constants/                            # API_STATUS, route paths, etc.
|-- index.css                             # Tailwind v4 @theme + CSS custom properties
`-- pages/                                # Top-level pages (rare)
```

---

## 5. Design Tokens and CSS Variables

### 5.1 App-Level Variables

These are the **primary** variables to use in markup. They switch automatically with theme and dark mode.

```
Backgrounds:
  var(--app-color-bg)               Page background
  var(--app-color-surface)          Card / panel surfaces
  var(--app-color-surface-alt)      Alternate surface (zebra rows, etc.)
  var(--app-color-surface-hover)    Hover state background
  var(--app-color-surface-active)   Active/selected state

Text:
  var(--app-color-text)             Primary text
  var(--app-color-text-muted)       Secondary / supporting text
  var(--app-color-text-disabled)    Disabled label text
  var(--app-color-text-inverse)     White text on dark backgrounds

Borders:
  var(--app-color-border)           Standard border
  var(--app-color-border-strong)    Emphasized border
  var(--app-color-divider)          Hairline divider

Brand:
  var(--app-color-primary)          Brand color (#00994a in emerald)
  var(--app-color-primary-hover)    Hover state of primary
  var(--app-color-primary-soft)     Tinted background (badge bg, etc.)
  var(--app-color-primary-contrast) Text on primary bg (white)

Semantics:
  var(--app-color-success)    var(--app-color-success-soft)
  var(--app-color-error)      var(--app-color-error-soft)
  var(--app-color-warning)    var(--app-color-warning-soft)
  var(--app-color-info)       var(--app-color-info-soft)

Shadows:
  var(--app-shadow-xs)    1px  — very subtle
  var(--app-shadow-sm)    2px  — card resting
  var(--app-shadow-md)    8px  — elevated panel
  var(--app-shadow-lg)    18px — modal, toast
  var(--app-shadow-xl)    28px — maximum elevation

Focus:
  var(--app-focus-ring)   Box-shadow for focus states
```

### 5.2 Tailwind Semantic Classes

These are wired to app variables via `@theme` in `index.css`:

```
bg-bg           text-text           border-border
bg-surface      text-text-muted     border-border-strong
bg-surface-alt  text-text-disabled
bg-primary      text-primary
bg-success      text-success        bg-success-soft
bg-error        text-error          bg-error-soft
bg-warning      text-warning        bg-warning-soft
bg-info         text-info           bg-info-soft
```

### 5.3 shadcn/ui CSS Variables

shadcn primitives use `--background`, `--foreground`, `--card`, `--primary`, etc. These live in `index.css` under `:root` and `.dark`. Do not override them manually.

---

## 6. Tailwind CSS v4 Usage

### 6.1 Version-Specific Rules

- **Import:** `@import "tailwindcss"` — NOT `@tailwind base/components/utilities`
- **Dark mode:** `@custom-variant dark (&:where(.dark, .dark *))` — class-based, not `media`
- **Theme tokens:** `@theme { }` block in CSS — NOT `tailwind.config.js`
- **No config file:** Tailwind v4 is configured entirely in CSS

### 6.2 What to Use Tailwind For

Use Tailwind for:
- Layout: `flex`, `grid`, `gap`, `items-center`, `justify-between`
- Spacing: `p-4`, `px-6`, `mt-2`, `mb-4`
- Responsive: `md:grid-cols-3`, `lg:hidden`
- Semantic colors: `bg-surface`, `text-text-muted`, `border-border`
- Transitions: `transition-colors duration-200`
- Sizing: `w-full`, `max-w-6xl`, `h-screen`, `min-h-0`

Do NOT use Tailwind for:
- Hardcoded color values (`bg-green-500`) — use semantic tokens
- MUI component internals — use `sx` prop
- Arbitrary values when a token already exists

### 6.3 Responsive Breakpoints

| Prefix | Min Width | Usage |
|---|---|---|
| (none) | 0px | Mobile default |
| `sm:` | 640px | Mobile landscape (rare) |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Wide desktop |
| `2xl:` | 1536px | Ultra-wide |

**Note:** Because of the dual-layout pattern, responsive breakpoints in feature pages are rarely needed. Desktop pages already assume `lg+`, mobile pages assume `< md`. Use breakpoints in shared components and layouts only.

---

## 7. shadcn/ui Integration

### 7.1 Configuration (components.json)

```json
{
  "style": "radix-nova",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "css": "src/index.css",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### 7.2 Adding New Components

```bash
npx shadcn@latest add <component-name>
```

Components are added to `src/components/ui/` automatically.

### 7.3 Available shadcn Primitives

These are low-level Radix-based primitives. Wrap them in `App*` components before using in features:

```
Buttons:        Button
Inputs:         Input, Select, Checkbox, RadioGroup, Switch, Slider, Textarea
Overlays:       Dialog, Sheet, Popover, Tooltip, DropdownMenu, ContextMenu, AlertDialog
Layout:         Card, Separator, ScrollArea, ResizablePanelGroup
Data display:   Badge, Avatar, Table, DataTable
Navigation:     Accordion, Tabs, NavigationMenu, Breadcrumb
Feedback:       Skeleton, Progress, Alert
Forms:          Form, Label
Date:           Calendar
```

### 7.4 The Wrapping Pattern

```
shadcn <Button>   -->  AppButton              -->  used in feature pages
shadcn <Dialog>   -->  AppModal/AppConfirmModal -->  used in features
shadcn <Table>    -->  AppTable/DataTable       -->  used in features
shadcn <Sheet>    -->  AppDrawer               -->  used in features
```

**Rule:** Feature pages import from `@/components`, never directly from `@/components/ui` shadcn primitives.

---

## 8. Component Library

> **Fresh-build note:** The examples below show what your new primitive components
> should look like and what API they should expose. Do NOT use the existing `App*` components.
> Build equivalent primitives yourself in `src/features/<feature>/components/` or
> `src/design-system/` before building any page.

### 8.1 Buttons

```jsx
// Build this as a fresh primitive first, then use it:
// import Button from "../../components/Button";

// What your Button primitive should expose:
// <Button variant="primary" | "outlined" | "ghost" | "destructive"
//         size="sm" | "md" | "lg"
//         loading={bool} disabled={bool} fullWidth={bool}
//         icon={<LucideIcon />} iconPosition="left" | "right"
//         onClick={fn} type="button" | "submit">
//   Label
// </Button>

// Primary action
<AppButton variant="contained" color="primary" onClick={handleSave}>
  Save
</AppButton>

// Secondary / cancel
<AppButton variant="outlined" color="primary" onClick={handleCancel}>
  Cancel
</AppButton>

// Destructive
<AppButton variant="contained" color="error" onClick={handleDelete}>
  Delete
</AppButton>

// Icon-only button
<AppIconButton icon={<Edit size={18} />} tooltip="Edit" onClick={handleEdit} />

// Loading state
<AppLoadingButton loading={isSaving} variant="contained" color="primary">
  Saving...
</AppLoadingButton>
```

### 8.2 Typography

```jsx
// Build a fresh Heading and Text primitive:
// import { Heading, Text } from "../../components/Typography";

// What your Typography primitives should expose:
// <Heading level={1|2|3|4} weight={400|500|600|700|800} className="...">
// <Text size="xs"|"sm"|"base"|"lg" muted={bool} disabled={bool} className="...">

// Page title (desktop)
<AppHeading level={1} weight={800} sx={{ fontSize: "28px", mb: 1 }}>
  Branch List
</AppHeading>

// Section header
<AppHeading level={2} weight={700} sx={{ fontSize: "20px", mb: 2 }}>
  Contact Information
</AppHeading>

// Card title
<AppHeading level={3} weight={700} sx={{ fontSize: "16px", mb: 1.5 }}>
  Sales Overview
</AppHeading>

// Body text
<AppText variant="body1" sx={{ color: "var(--app-color-text)" }}>
  Main description or content.
</AppText>

// Muted supporting text
<AppText variant="body2" sx={{ color: "var(--app-color-text-muted)" }}>
  Supporting detail or hint text.
</AppText>
```

### 8.3 Layout Containers

```jsx
// Build a fresh Card primitive:
// import Card from "../../components/Card";

// What your Card primitive should expose:
// <Card
//   bordered={bool}       -> adds border-border
//   elevated={bool}       -> adds shadow-sm
//   interactive={bool}    -> adds cursor-pointer + hover:bg-surface-hover
//   onClick={fn}
//   className="..."
// >

// Flexible box (MUI Box)
<AppBox sx={{ display: "flex", gap: 2, alignItems: "center" }}>
  content
</AppBox>

// Standard card
<AppCard variant="default" rounded="lg" bordered sx={{ p: 3 }}>
  Card content
</AppCard>

// Primary accent card (welcome, highlights)
<AppCard
  variant="default"
  rounded="xl"
  bordered
  sx={{
    p: 4,
    mb: 4,
    bgcolor: "color-mix(in srgb, var(--app-color-primary) 5%, var(--app-color-surface))",
    borderLeft: "5px solid var(--app-color-primary)",
  }}
>
  Accent card content
</AppCard>
```

### 8.4 Page Structure

```jsx
// Build page structure using plain semantic HTML + Tailwind:
// NO PageContainer, PageToolbar, PageContent wrappers from @/components

<PageContainer>
  <PageToolbar title="Branches" />
  <PageContent>
    {/* Table, form, or other content */}
  </PageContent>
  <PageActions>
    <AppButton variant="contained">Save</AppButton>
  </PageActions>
</PageContainer>
```

### 8.5 Tables

```jsx
import { AppTable, AppResponsiveTable, DataTable } from "@/components";

// Desktop: full-featured table
<AppTable
  columns={columns}
  rows={rows}
  loading={isLoading}
  onRowClick={handleRowClick}
/>

// shadcn-based data table
<DataTable columns={columns} data={data} />

// Mobile: card-list style
<AppResponsiveTable
  rows={rows}
  renderRow={(row) => <MobileRowCard row={row} />}
/>
```

### 8.6 Forms

```jsx
import { AppForm, AppFormField, AppFormSection, AppFormActions } from "@/components";

<AppForm onSubmit={handleSubmit}>
  <AppFormSection title="Basic Information">
    <AppFormField label="Branch Name" required>
      <AppInput value={name} onChange={setName} />
    </AppFormField>
    <AppFormField label="Phone" hint="Include country code">
      <AppInput value={phone} onChange={setPhone} />
    </AppFormField>
  </AppFormSection>

  <AppFormActions>
    <AppButton type="submit" variant="contained" color="primary">
      Create Branch
    </AppButton>
    <AppButton variant="outlined" onClick={onCancel}>
      Cancel
    </AppButton>
  </AppFormActions>
</AppForm>
```

### 8.7 Feedback Components

```jsx
import { AppAlert, AppSkeleton } from "@/components";

// Success notification
<AppAlert severity="success" variant="filled" title="Branch created!" />

// Error state
<AppAlert severity="error" title="Failed to load branches" closable onClose={dismiss} />

// Loading skeleton
<AppSkeleton variant="rectangular" height={200} />
<AppSkeleton variant="text" width="60%" />
```

### 8.8 Confirm Modal

```jsx
import { AppConfirmModal } from "@/components";

<AppConfirmModal
  open={showDeleteModal}
  title="Delete Branch"
  message="This action cannot be undone. Are you sure?"
  confirmLabel="Delete"
  confirmColor="error"
  onConfirm={handleDelete}
  onClose={() => setShowDeleteModal(false)}
/>
```

---

## 9. Desktop UI Principles

The desktop experience should feel like a **native desktop application** — dense, efficient, keyboard-friendly, data-rich.

### 9.1 Layout Specifications

| Rule | Specification |
|---|---|
| Content max-width | `max-w-[1200px] mx-auto` |
| Page padding | `p-8` (32px all sides) |
| Card padding | `p-4` to `p-6` |
| Stats grid | `grid grid-cols-3 gap-6` or `grid-cols-4 gap-4` |
| Form grid | `grid grid-cols-2 gap-6` |
| Section spacing | `mb-6` between sections |
| Table row height | Dense — `48px` standard |

### 9.2 Desktop-Specific UI Elements

- **Persistent sidebar** — 230px wide, collapsible, with nav item groups
- **Fixed header bar** — 58px, breadcrumb + workspace switcher + user menu
- **Full data tables** — column headers, sortable, paginated, bulk select, inline row actions
- **AppRowActions** — edit / view / delete menu in last column
- **Split views** — master list + detail panel side by side
- **Keyboard shortcuts** — `Enter` to submit, `Escape` to close modals, `Tab` navigation
- **Dense spacing** — 8–12px between list items, not the mobile 16–24px
- **Dropdown menus** — context-sensitive actions instead of swipe gestures

### 9.3 Desktop Navigation Structure

```
Fixed Sidebar (230px, left)
  Logo + Workspace name
  Nav item groups (with icons + labels)
    Active item: primary color bg-surface-active + left border accent
    Hover item: bg-surface-hover
  Bottom: user profile + settings link

Fixed Header (58px, top, right of sidebar)
  Left: hamburger toggle (when sidebar collapsed)
  Left: breadcrumb trail
  Center: workspace / company / branch context switcher
  Right: notifications bell + user avatar dropdown
```

### 9.4 Desktop List Page Template

```jsx
// src/features/branch/pages/desktop/BranchesDesktopPage.jsx

import { AppBox, AppCard, AppHeading, AppButton, AppTable } from "@/components";

const BranchesDesktopPage = ({ branches, isLoading, onDelete }) => {
  return (
    <section className="min-h-screen bg-bg p-8">
      <AppBox sx={{ maxWidth: 1200, mx: "auto" }}>

        {/* Page header row */}
        <AppBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <AppHeading level={1} weight={700} sx={{ fontSize: "24px" }}>
            Branches
          </AppHeading>
          <AppButton variant="contained" color="primary" startIcon={<Plus size={16} />}>
            New Branch
          </AppButton>
        </AppBox>

        {/* Filters toolbar */}
        <AppCard bordered sx={{ p: 2, mb: 3 }}>
          {/* search input + status dropdown + company filter */}
        </AppCard>

        {/* Data table */}
        <AppCard bordered>
          <AppTable
            columns={columns}
            rows={branches}
            loading={isLoading}
            onRowClick={(row) => navigate(`/branches/${row._id}`)}
          />
        </AppCard>

      </AppBox>
    </section>
  );
};
```

### 9.5 Desktop Form Page Template

```jsx
// src/features/branch/pages/desktop/CreateBranchDesktopPage.jsx

const CreateBranchDesktopPage = ({ onSubmit, isSaving }) => {
  return (
    <section className="min-h-screen bg-bg p-8">
      <AppBox sx={{ maxWidth: 800, mx: "auto" }}>

        {/* Breadcrumb */}
        <AppBreadcrumb items={["Branches", "New Branch"]} sx={{ mb: 3 }} />

        {/* Form card */}
        <AppCard bordered rounded="xl" sx={{ p: 6 }}>
          <AppHeading level={1} weight={700} sx={{ fontSize: "22px", mb: 4 }}>
            Create Branch
          </AppHeading>

          <AppForm onSubmit={onSubmit}>
            <AppFormSection title="Basic Information">
              <div className="grid grid-cols-2 gap-6">
                <AppFormField label="Branch Name" required>
                  <AppInput fullWidth />
                </AppFormField>
                <AppFormField label="Phone">
                  <AppInput fullWidth />
                </AppFormField>
              </div>
            </AppFormSection>

            <AppFormActions>
              <AppLoadingButton loading={isSaving} variant="contained" color="primary" type="submit">
                Create Branch
              </AppLoadingButton>
              <AppButton variant="outlined" onClick={() => navigate(-1)}>
                Cancel
              </AppButton>
            </AppFormActions>
          </AppForm>
        </AppCard>

      </AppBox>
    </section>
  );
};
```

---

## 10. Mobile UI Principles

The mobile experience should feel like a **native mobile app** — touch-friendly, spacious, thumb-reachable, gesture-aware.

### 10.1 Layout Specifications

| Rule | Specification |
|---|---|
| Page padding | `px-4 py-6` (16px horizontal, 24px vertical) |
| Card padding | `p-3` to `p-4` |
| List item min-height | `min-h-[56px]` |
| Touch target minimum | `44px x 44px` |
| Font sizes | Larger than desktop: body `14px`, headings `18–22px` |
| Bottom nav clearance | `pb-16` on body (handled by `AppMobileLayout`) |
| Content width | `w-full` — no max-width constraints |
| Action buttons | `fullWidth` in forms |

### 10.2 Mobile-Specific UI Elements

- **Bottom navigation** — 4–5 primary tabs fixed at the bottom
- **Slide-in drawer sidebar** — full-height overlay, closes on backdrop tap
- **AppMobileContextSheet** — bottom sheet for workspace/branch switching
- **Card-based lists** — replace tables; each record is a tappable card
- **Floating Action Button (FAB)** — primary create action, bottom-right
- **Bottom sheets** — replace modals for confirmations, filters, quick actions
- **Sticky bottom action bar** — for form submit / cancel buttons
- **Pull-to-refresh** — for list pages (optional, Framer Motion)

### 10.3 Mobile Navigation Structure

```
Fixed Header (top)
  Left: hamburger icon -> slide-in drawer
  Center: current page title
  Right: context icon (branch selector) or action icon

Slide-in Drawer (left overlay)
  User avatar + name + role
  Nav links with icons
  Workspace/company/branch context

Content Area (scrollable)
  px-4 horizontal padding
  Cards stacked vertically with gap-3
  Full-width touch-friendly rows

Bottom Navigation (fixed, 64px)
  Dashboard | Inventory | Sales | Finance | More
```

### 10.4 Mobile List Page Template

```jsx
// src/features/branch/pages/mobile/BranchesMobilePage.jsx

const BranchesMobilePage = ({ branches, isLoading }) => {
  return (
    <section className="min-h-screen bg-bg px-4 py-6">

      {/* Search bar */}
      <div className="mb-4">
        <AppInput placeholder="Search branches..." fullWidth />
      </div>

      {/* Results count */}
      <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mb: 2 }}>
        {branches.length} branches
      </AppText>

      {/* Card list */}
      <div className="flex flex-col gap-3">
        {branches.map((branch) => (
          <AppCard
            key={branch._id}
            bordered
            rounded="lg"
            sx={{ p: 3 }}
            onClick={() => navigate(`/branches/${branch._id}`)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <AppHeading level={3} weight={600} sx={{ fontSize: "15px" }}>
                {branch.name}
              </AppHeading>
              <StatusBadge status={branch.status} />
            </div>
            <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontSize: "13px", mt: 0.5 }}>
              {branch.address?.city}
            </AppText>
          </AppCard>
        ))}
      </div>

      {/* FAB for create */}
      <div className="fixed bottom-20 right-4">
        <AppIconButton
          icon={<Plus size={24} />}
          onClick={() => navigate("/branches/create")}
          sx={{
            bgcolor: "var(--app-color-primary)",
            color: "var(--app-color-primary-contrast)",
            width: 56, height: 56, borderRadius: "50%",
            boxShadow: "var(--app-shadow-lg)",
          }}
        />
      </div>

    </section>
  );
};
```

### 10.5 Mobile Form Page Template

```jsx
// src/features/branch/pages/mobile/CreateBranchMobilePage.jsx

const CreateBranchMobilePage = ({ onSubmit, isSaving }) => {
  return (
    <section className="min-h-screen bg-bg px-4 pt-4 pb-28">

      <AppHeading level={2} weight={700} sx={{ fontSize: "20px", mb: 3 }}>
        Create Branch
      </AppHeading>

      {/* Form sections stacked as cards */}
      <div className="flex flex-col gap-4">
        <AppCard bordered rounded="lg" sx={{ p: 3 }}>
          <AppHeading level={3} sx={{ fontSize: "14px", mb: 2, color: "var(--app-color-text-muted)" }}>
            BASIC INFO
          </AppHeading>
          <div className="flex flex-col gap-3">
            <AppFormField label="Branch Name" required>
              <AppInput fullWidth />
            </AppFormField>
            <AppFormField label="Phone">
              <AppInput fullWidth />
            </AppFormField>
          </div>
        </AppCard>
      </div>

      {/* Sticky bottom action bar — above bottom nav (bottom-16 = 64px) */}
      <div className="fixed bottom-16 left-0 right-0 bg-surface border-t border-border px-4 py-3 flex gap-3">
        <AppButton variant="outlined" fullWidth onClick={() => navigate(-1)}>
          Cancel
        </AppButton>
        <AppLoadingButton
          loading={isSaving}
          variant="contained"
          color="primary"
          fullWidth
          onClick={onSubmit}
        >
          Create
        </AppLoadingButton>
      </div>

    </section>
  );
};
```

---

## 11. Theme System

### 11.1 Available Themes

| Theme | Token | Primary Color | Best For |
|---|---|---|---|
| Emerald Care | `emerald` | `#00994a` | Default — healthcare green |
| Classic Blue | `classicBlue` | Blue tones | Traditional medical ERP |
| Slate Office | `slate` | Neutral slate | Admin, reports, finance |
| Warm Care | `warm` | Warm amber | Long POS/billing sessions |
| Indigo Pro | `indigo` | Indigo | Analytics dashboards |

### 11.2 How Theming Works

1. User selects a theme in settings
2. `ThemeProvider` applies CSS vars to `:root`
3. All `var(--app-color-*)` tokens update automatically
4. Tailwind classes and MUI `sx` props both update (they read from CSS vars)

### 11.3 Dark Mode

- Applied via `.dark` class on `<html>` or the root element
- Both `var(--app-color-*)` vars AND shadcn vars switch
- Always test both light and dark before delivering UI

---

## 12. Typography

### 12.1 Font Loading

```css
/* Loaded via npm package in main entry file */
font-family: 'Geist Variable', system-ui, sans-serif;
```

### 12.2 Desktop Type Scale

| Role | Size | Weight | Component |
|---|---|---|---|
| Page Title | 28px | 800 | `<AppHeading level={1}>` |
| Section Title | 20px | 700 | `<AppHeading level={2}>` |
| Card Title | 16px | 700 | `<AppHeading level={3}>` |
| Body | 15px | 400 | `<AppText variant="body1">` |
| Secondary | 13–14px | 400 | `<AppText variant="body2">` |
| Caption | 12px | 400 | Labels, hints, metadata |

### 12.3 Mobile Type Scale

| Role | Size | Weight | Component |
|---|---|---|---|
| Page Title | 20–22px | 800 | `<AppHeading level={2}>` |
| Section Title | 16px | 700 | `<AppHeading level={3}>` |
| Body | 14px | 400 | `<AppText variant="body2">` |
| Secondary | 12–13px | 400 | Hints, metadata |

---

## 13. Animation and Motion

### 13.1 Principles

- **Purpose-first** — only animate if it aids understanding (not decoration)
- **Subtle and fast** — 150–300ms for interactions, 300–500ms for page entries
- **Respect preferences** — include `prefers-reduced-motion` fallback

### 13.2 Standard Transitions

```css
/* Interaction transitions (buttons, hovers) */
transition-colors duration-150

/* Layout transitions (sidebar collapse) */
transition-all duration-300 ease-in-out
```

```jsx
/* Page entry — use Framer Motion */
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, ease: "easeOut" }}
>
  page content
</motion.div>
```

### 13.3 What to Animate

- Sidebar open/close — `ml-[230px]` to `ml-0` with `transition-all duration-300`
- Mobile drawer slide-in — Framer Motion `x: "-100%"` to `x: 0`
- Card hover — subtle shadow elevation change
- Button hover — `transition-colors duration-150`
- Toast / alert appearance — slide down from top
- Modal appear — fade + scale from 0.95 to 1

### 13.4 What NOT to Animate

- Table row data loading (instant)
- Filter changes (instant update expected)
- Form validation errors (appear instantly)
- Pagination page changes

---

## 14. Icon Usage Rules

| Rule | Do | Do Not |
|---|---|---|
| Icon source | `lucide-react` exclusively | Mix emojis or MUI icons |
| Import | `import { Edit, Trash2, Plus } from "lucide-react"` | Use emoji as icon |
| Size in text/button | `size={16}` | Mix sizes randomly |
| Size standalone | `size={20}` | |
| Color | Inherit from text or semantic color | Hardcode hex |

```jsx
// Correct
import { Plus, Edit, Trash2, ChevronRight } from "lucide-react";

<AppButton startIcon={<Plus size={16} />}>New Branch</AppButton>
<AppIconButton icon={<Edit size={18} />} tooltip="Edit" />

// Wrong — never do this
<button>+ New Branch</button>        // no icon component
<button>🗑 Delete</button>           // emoji icon
```

---

## 15. Pre-Delivery Checklist

Run through this checklist before marking any UI task complete.

### Visual Quality

- [ ] No emojis used as icons — SVG Lucide icons only
- [ ] No hardcoded hex colors — `var(--app-color-*)` or Tailwind tokens only
- [ ] Desktop page has `max-width` container (`max-w-[1200px]` or `max-w-7xl`)
- [ ] Mobile page has `px-4` horizontal padding and full-width layout

### Dual-Layout Pattern

- [ ] Parent page has zero UI markup — only `useIsMobile()` + conditional render
- [ ] Desktop child is in `pages/desktop/FeatureDesktopPage.jsx`
- [ ] Mobile child is in `pages/mobile/FeatureMobilePage.jsx`
- [ ] Shared business logic is in the parent or feature hooks — not duplicated in both children
- [ ] Both `desktop/index.js` and `mobile/index.js` export the child page

### Interaction and Accessibility

- [ ] All clickable elements have `cursor-pointer`
- [ ] All clickable cards/rows have hover feedback (`hover:bg-surface-hover` or `sx` equivalent)
- [ ] Mobile touch targets are 44px minimum
- [ ] All `<img>` tags have `alt` text
- [ ] Form inputs have associated `<label>` elements (via `AppFormField`)
- [ ] Modals/dialogs close on `Escape` key

### Data States

- [ ] Loading state shown (`AppSkeleton` or spinner)
- [ ] Empty state shown when no data (`AppEmptyTable` or custom empty component)
- [ ] Error state shown on API failure (`AppAlert severity="error"`)

### Theme and Mode

- [ ] Light mode tested and looks correct
- [ ] Dark mode tested and looks correct
- [ ] Both themes use semantic tokens — no hardcoded colors that won't update

### Code Quality

- [ ] No `console.log` statements left in feature code
- [ ] No `style={{}}` objects for layout — use Tailwind or `sx` prop
- [ ] Imports use `@/components` alias — not relative paths across features
- [ ] Barrel imports used — from `index.js`, not individual files

### Performance & Optimization (check parent page logic)

- [ ] No `useEffect` with missing or incorrect dependency array (causes infinite loop)
- [ ] No state setter called after component unmount (memory leak)
- [ ] API calls are NOT fired on every render — guarded by stable deps or `enabled` flag
- [ ] Expensive computations wrapped in `useMemo`; stable callbacks wrapped in `useCallback`
- [ ] No prop drilling more than 3 levels — lifted to context or feature hook if needed
- [ ] Parent page passes props as stable references (no inline object/array literals in JSX)
- [ ] No duplicate `useSelector` calls selecting the same slice in multiple child components — select once in parent and pass down
- [ ] Redux selectors that return derived data use `createSelector` (memoized) — not computed inline
