# Setup Center Flow-Based UI Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Redesign the PharmaERP Setup Center page into a top-to-bottom stepped workflow flow interface inspired by the reference image, featuring an interactive dot-grid canvas, connected step nodes, a live step inspector, and 100% native `UI*` components.

**Architecture:** Split the desktop view into a dual-pane workspace: a central stepped flow canvas (Step 1 Top -> Connector -> Step 2 -> Connector -> Go Live) on the left, and a reactive step inspector panel on the right. On mobile, provide a fluid vertical stepped flow with a bottom-sheet inspector drawer.

**Tech Stack:** React 19, Tailwind CSS v4, Framer Motion (Emil Kowalski spring physics), Lucide React, Redux Toolkit (`workspaceSlice`), native PharmaERP `UI*` primitives.

---

### Task 1: Create `SetupFlowHeader` Component

**Files:**
- Create: `src/features/setup/components/SetupFlowHeader.jsx`
- Modify: `src/features/setup/components/index.js`

**Step 1: Write `SetupFlowHeader.jsx`**
Build a header with back button, flow title, progress status pill (`UIBadge`), live switch (`UISwitch`), diagnostics trigger, and primary `Go Live` / `Continue` CTA.

**Step 2: Commit**
```bash
git add src/features/setup/components/SetupFlowHeader.jsx
git commit -m "feat(setup): add SetupFlowHeader component"
```

---

### Task 2: Create `SetupStepInspector` Component

**Files:**
- Create: `src/features/setup/components/SetupStepInspector.jsx`
- Modify: `src/features/setup/components/index.js`

**Step 1: Write `SetupStepInspector.jsx`**
Build the right-hand inspector panel that dynamically displays:
- Selected step header (Icon, title, category, description)
- Direct target route URL with copy button
- Prerequisites checklist
- Contextual advice / warning callout (`UIAlert` / `UIInfoCard`)
- Primary action button (`UIButton` with `whileTap={{ scale: 0.97 }}`)

**Step 2: Commit**
```bash
git add src/features/setup/components/SetupStepInspector.jsx
git commit -m "feat(setup): add SetupStepInspector component"
```

---

### Task 3: Create `SetupFlowCanvas` Component

**Files:**
- Create: `src/features/setup/components/SetupFlowCanvas.jsx`
- Modify: `src/features/setup/components/index.js`

**Step 1: Write `SetupFlowCanvas.jsx`**
Implement the stepped flow canvas:
- Subtle dot-grid backdrop
- Top progress badge pill
- Step Node 1 (Company) card with active highlight ring & completion check
- Stepped SVG connector with inline `+` node
- Step Node 2 (Branch) card with dynamic locked/active status
- Stepped SVG connector with inline `+` node
- Terminal `Go Live` badge with glowing completion state
- Bottom canvas navigation toolbar (Zoom in/out, fit to view, reset)

**Step 2: Commit**
```bash
git add src/features/setup/components/SetupFlowCanvas.jsx
git commit -m "feat(setup): add SetupFlowCanvas component"
```

---

### Task 4: Assemble `SetupCenterDesktopPage` & `SetupCenterPage`

**Files:**
- Modify: `src/features/setup/pages/desktop/SetupCenterDesktopPage.jsx`
- Modify: `src/features/setup/pages/SetupCenterPage.jsx`

**Step 1: Refactor Desktop Page**
Replace all legacy `App*` components with `SetupFlowHeader`, `SetupFlowCanvas`, and `SetupStepInspector`. Wire selected step state, navigation, and diagnostics.

**Step 2: Commit**
```bash
git add src/features/setup/pages/desktop/SetupCenterDesktopPage.jsx src/features/setup/pages/SetupCenterPage.jsx
git commit -m "feat(setup): refactor SetupCenterDesktopPage to flow architecture"
```

---

### Task 5: Assemble `SetupCenterMobilePage`

**Files:**
- Modify: `src/features/setup/pages/mobile/SetupCenterMobilePage.jsx`

**Step 1: Refactor Mobile Page**
Replace legacy `App*` components with a clean mobile stepped flow, featuring vertical connector lines, touch-first cards (≥ 44px), and a bottom slide-up sheet inspector for step configuration.

**Step 2: Commit**
```bash
git add src/features/setup/pages/mobile/SetupCenterMobilePage.jsx
git commit -m "feat(setup): refactor SetupCenterMobilePage with modern flow cards"
```

---

### Task 6: Build Verification & Multi-Device Testing

**Files:**
- Verify: `npx vite build --mode development`
- Update: `docs/plans/task.md`

**Step 1: Run Vite Build**
Verify exit code 0 and zero compilation errors.

**Step 2: Commit & update task tracker**
```bash
git add docs/plans/task.md
git commit -m "docs(setup): update task tracker for setup center redesign"
```
