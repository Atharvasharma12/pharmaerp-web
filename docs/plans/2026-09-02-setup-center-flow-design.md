# PharmaERP Setup Center — Flow-Based Redesign Specification

> **Date:** 2026-09-02  
> **Status:** Draft for Review  
> **Author:** Antigravity (Design Engineering)  
> **Standards:** PharmaERP Design Standards v3.0, Emil Kowalski Motion Physics, Zero Legacy App* Component Policy

---

## 1. Objective & Design Vision

Transform the PharmaERP **Setup Center** into a sleek, top-down **stepped workflow flow interface** inspired by modern flow-builder systems:
- **Top-to-Bottom Flow Hierarchy**: Clear sequential progression where Step 1 is at the top, followed by a stepped connector line to Step 2, leading into the terminal **Go Live** milestone.
- **Interactive Step Nodes**: Each step node acts as an interactive card displaying its icon, title, description, live status (Completed, In Progress with active ring, Locked), and selection state.
- **Dedicated Step Inspector Panel**: Selecting any step in the flow reveals its detailed configuration, route actions, prerequisite checklist, tips, and direct launch button in the right-hand inspector.
- **100% Native `UI*` Design System**: Complete elimination of legacy `App*` components in favor of native `UI*` primitives, semantic tokens, and Emil Kowalski tactile spring physics.

---

## 2. Spatial Layout & Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Bar: [<] Setup Flow — Business Onboarding    [Complete 2 steps]   [Test Setup] [Live] [Go Live] │
├──────────────────────────────────────────────────────────────────┬───────────────────────────────┤
│                                                                  │ RIGHT INSPECTOR PANEL (360px) │
│  FLOW CANVAS (Dot-Grid Backdrop)                                 │                               │
│                                                                  │ ┌───────────────────────────┐ │
│         ┌───────────────────────┐                                │ │ 🏢 Create Company         │ │
│         │ Complete 2 steps      │                                │ │ Business Entity Setup     │ │
│         └──────────┬────────────┘                                │ └───────────────────────────┘ │
│                    │                                             │                               │
│         ┌──────────▼────────────────────────────────────┐        │ Target Route:                 │
│  [Step 1]│ 🏢 Create Company                   [✓ Done] │ ◄─────┼─ [ /companies/create    [📋] ]│
│         │ Add business details, GSTIN, and licenses.   │ (Active│                               │
│         └──────────┬────────────────────────────────────┘  Node) │ Prerequisite Checklist:       │
│                    │ (Stepped SVG Connector)                     │  ✓ Workspace Active           │
│                   (+)                                            │  ✓ Admin Role Assigned        │
│                    │                                             │                               │
│         ┌──────────▼────────────────────────────────────┐        │ ℹ️ Completing this unlocks     │
│  [Step 2]│ 🏪 Create Branch                    [Locked] │        │ branch setup & POS operations.│
│         │ Add pharmacy store location & counters.      │        │                               │
│         └──────────┬────────────────────────────────────┘        │ ┌───────────────────────────┐ │
│                    │ (Stepped SVG Connector)                     │ │ 🚀 Open Company Setup     │ │
│                   (+)                                            │ └───────────────────────────┘ │
│                    │                                             │                               │
│         ┌──────────▼────────────┐                                │                               │
│         │ 🟢 Go Live / Ready    │                                │                               │
│         └───────────────────────┘                                │                               │
│                                                                  │                               │
│  [Pan/Select]               [ Zoom -  100%  +  Fit ]             │                               │
└──────────────────────────────────────────────────────────────────┴───────────────────────────────┘
```

---

## 3. Detailed Component Specifications

### 3.1 Top Flow Header Bar (`SetupFlowHeader`)
- **Back Button**: Tactile icon button (`<`) navigating back to dashboard.
- **Flow Identity**:
  - Main Title: `Setup Flow — Business Onboarding`
  - Subtitle: `Configure your core business entities to activate full ERP operations.`
- **Flow Status Capsule**:
  - `UIBadge` with live progress indicator (`Complete 2 steps to Go Live` / `100% Ready — Go Live`).
- **Action Toolbar**:
  - `Run Diagnostics` button with pulse animation when checking workspace readiness.
  - `Live Status` toggle switch (`UISwitch`) reflecting workspace configuration mode.
  - `Continue Setup / Go Live` primary button (`UIButton` with `whileTap={{ scale: 0.97 }}`).

### 3.2 Stepped Flow Canvas (`SetupFlowCanvas`)
- **Backdrop**: Subtle dot-grid pattern (`radial-gradient(circle, var(--app-color-border) 1px, transparent 1px)` with `background-size: 20px 20px`).
- **Top Badge**: Dark pill badge indicating total steps remaining.
- **Step Node 1 — Create Company**:
  - Left Icon Badge: Building icon with primary/success soft background.
  - Text Block: Step title + concise description.
  - Right Status: `UIBadge` (`Completed` with green check / `In Progress` with primary ring / `Locked`).
  - Active Glow: When selected, card receives `ring-2 ring-primary border-primary shadow-sm`.
- **Connector Line**:
  - Smooth vertical stepped SVG connector with a dashed/solid stroke depending on completion.
  - Inline center circular badge with `+` or step connector pin.
- **Step Node 2 — Create Branch**:
  - Left Icon Badge: Store/Pharmacy icon.
  - Status: Automatically reflects completion of Step 1 (`Locked` with padlock until Company is created).
- **Connector Line**: Stepped SVG line connecting Step 2 to terminal node.
- **Terminal Node — Go Live**:
  - Final pill badge `Go Live`.
  - When both steps are complete: Glowing success badge `🎉 All Steps Complete — System Live` with one-click navigation to Main POS / Inventory Dashboard.
- **Canvas Bottom Toolbar**:
  - Pan / Select mode toggle.
  - Zoom controls (`-`, `100%`, `+`, `Fit to View`).

### 3.3 Right Step Inspector Panel (`SetupStepInspector`)
- **Header**:
  - Large icon box + Title + Category tag (`Business Entity` / `Branch Location`).
  - Summary description explaining why the step is mandatory.
- **Route & Access Section**:
  - Direct route display box with copy-to-clipboard button.
  - Help note explaining production vs draft configuration.
- **Prerequisites & Validation**:
  - Checklist of prerequisite conditions (e.g., Company creation required before Branch creation).
  - Callout banner (`UIAlert` / `UIInfoCard`) with helpful business setup tips.
- **Primary Execution CTA**:
  - Dynamic button (`Open Company Form` / `Open Branch Form` / `View Company Details` if completed).
  - Tactile spring physics (`whileTap={{ scale: 0.97 }}`).

---

## 4. Universal Responsive Adaptation

| Viewport | Applied Architecture |
|---|---|
| **Desktop (≥ 1024px)** | Full dual-pane: interactive flow canvas on the left + persistent right inspector (360px). |
| **Tablet (768px – 1023px)** | Centered flow canvas with a toggleable slide-over inspector drawer (`UIDrawer`). |
| **Mobile & Foldables (< 768px)** | Centered single-column stepped flow with bottom-anchored inspector sheet and minimum 44px touch targets. |

---

## 5. Technology Stack & Design System Compliance

- **No Legacy Components**: 0 imports of `AppButton`, `AppCard`, `AppHeading`, `AppText`, `AppBox`, `AppStack`, etc.
- **Native Primitives**: `UIPageHeader`, `UIButton`, `UIBadge`, `UICard`, `UISwitch`, `UITooltip`, `UIDrawer`, `UISkeleton`.
- **Styling**: Pure Tailwind CSS v4 semantic tokens (`bg-bg`, `bg-surface`, `bg-surface-alt`, `text-text`, `text-text-muted`, `border-border`, `bg-primary`, `text-success`).
- **Motion**: Framer Motion with custom spring curve `[0.23, 1, 0.32, 1]`, duration `< 250ms`, `whileTap={{ scale: 0.97 }}`.

---

## 6. Verification Plan

1. **Visual & Flow Verification**:
   - Verify top-down flow: Step 1 (Top) -> Connector -> Step 2 -> Connector -> Go Live.
   - Verify node selection updates the right inspector panel in real-time.
   - Verify locking behavior (Step 2 locked until Step 1 complete).
2. **Device Responsiveness**:
   - Verify on Mobile (390px), Tablet (768px), and Desktop (1280px+).
   - Verify short screen handling (< 700px height) with natural scroll.
3. **Build & Type Check**:
   - Run `npx vite build --mode development` to ensure exit code 0 and zero lint/type regressions.
