# POS Billing & Operational Dialogs Redesign Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Completely redesign the POS Billing page empty/closed state and all operational dialogs (View Shift, Close Business Day, View Business Day, Post-Close Confirmation) using standard `src/components/ui/` components.

**Architecture:** Create rich, premium UI wrappers leveraging `UIModal`, `UIStatCard`, `UIInfoCard`, `UIDetailRow`, `UIKeyValueList`, `UIBadge`, `UIButton`, `UIAlert`. Integrate direct operational modal triggers on the POS billing page when no shift/day is open.

**Tech Stack:** React 18, Redux Toolkit, Tailwind CSS, Lucide React Icons, standard UI component system (`src/components/ui`).

---

### Task 1: Redesign View Shift Dialog (`ViewShiftDialog.jsx`)

**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\operations\shifts\components\ViewShiftDialog.jsx`

**Step 1: Replace ad-hoc markup with `UIModal`, `UIStatCard`, `UIInfoCard`, `UIDetailRow`, `UIBadge`, `UIButton`**
- Import standard UI components from `@/components/ui`.
- Standardize running cash and frozen reserve cards with `UIStatCard` components.
- Standardize Cash Summary tab breakdown using `UIDetailRow` and `UIKeyValueList`.
- Enhance cash drawer denomination breakdown spacing and font alignment.
- Refactor tab bar into clean segmented controls.

**Step 2: Verify in build**
- Run build check to verify syntax and imports.

**Step 3: Commit**
- Commit `ViewShiftDialog.jsx` changes.

---

### Task 2: Redesign Close Business Day Dialog (`CloseBusinessDayDialog.jsx`)

**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\operations\business-days\components\CloseBusinessDayDialog.jsx`

**Step 1: Rebuild dialog layout with `UIModal`, `UIAlert`, `UIInfoCard`, `UIDetailRow`, `UIBadge`, `UIButton`**
- Import UI components from `@/components/ui`.
- Use `UIAlert` for active shift blocker warnings.
- Build session audit summary card using `UIInfoCard` and `UIDetailRow`.
- Redesign shift verification checklist with status badges and quick view details trigger.
- Add irreversible day-end lock warning card and structured checkbox confirmation.

**Step 2: Verify in build**
- Run build check to verify syntax and imports.

**Step 3: Commit**
- Commit `CloseBusinessDayDialog.jsx` changes.

---

### Task 3: Redesign View Business Day Dialog (`ViewBusinessDayDialog.jsx`)

**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\operations\business-days\components\ViewBusinessDayDialog.jsx`

**Step 1: Rebuild overview, shifts, and fund transfers tabs using `UIModal`, `UIStatCard`, `UIInfoCard`, `UIDetailRow`, `UIBadge`**
- Import standard UI components.
- Build hero session card and session audit trail using `UIInfoCard` and `UIDetailRow`.
- Build shift statistics grid using `UIStatCard`.
- Redesign shifts tab and fund transfers/bank slips tab with clean cards and status indicators.

**Step 2: Verify in build**
- Run build check to verify syntax and imports.

**Step 3: Commit**
- Commit `ViewBusinessDayDialog.jsx` changes.

---

### Task 4: Redesign Post Shift Close Confirmation Dialog (`PostShiftCloseDialog.jsx`)

**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\operations\shifts\components\PostShiftCloseDialog.jsx`

**Step 1: Upgrade post-close dialog with `UIModal`, `UIStatCard`, `UIButton` and interactive action cards**
- Import standard UI components.
- Build carry-forward cash and frozen reserve balance cards with `UIStatCard`.
- Redesign action cards ("Start Next Shift", "Close Business Day") with smooth hover states, icons, and clear subtitles.

**Step 2: Verify in build**
- Run build check to verify syntax and imports.

**Step 3: Commit**
- Commit `PostShiftCloseDialog.jsx` changes.

---

### Task 5: Redesign POS Billing Empty/Closed State & Direct Modal Triggers (`POSTerminalPage.jsx`)

**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\billing\pages\POSTerminalPage.jsx`

**Step 1: Upgrade no-shift / no-business-day empty states in POS Terminal**
- Add state handling for `openBusinessDay` and `activeShift`.
- Render executive operational card when no day or shift is open.
- Add "Start Business Day" button opening `OpenBusinessDayDialog` in overlay.
- Add "Start Shift" button opening `CreateShiftDialog` in overlay.
- Connect callbacks so completing modal actions updates POS Terminal state seamlessly without page redirect.

**Step 2: Verify build and test full POS flow**
- Run `npm run build` or Vite build check.

**Step 3: Commit**
- Commit `POSTerminalPage.jsx` changes.
