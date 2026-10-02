# Sidebar Auto-Close & Day Closing Shift Details Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement auto-collapse for the desktop sidebar after 1.5 seconds of cursor leave, and add a "View Shift" dialog trigger button in Day Closing views to view full shift details.

**Architecture:**
- Use a ref-based timer (`setTimeout` 1500ms / `clearTimeout`) in `AppDesktopSidebar` to manage hover-leave auto-collapse when expanded, pausing auto-collapse if dropdowns or modals are open.
- Wire `ViewShiftDialog` into `ViewDayClosingDialog` and `CloseDayClosingDialog` shift breakdowns so clicking "View Shift" opens the existing modal with shift float, denominations, cash net, QR, and fund transfers.

**Tech Stack:** React 19, Vite, Tailwind CSS, Lucide icons, Redux Toolkit.

---

### Task 1: Desktop Sidebar Auto-Close on Mouse Leave
**Files:**
- Modify: `src/layouts/app/desktop/AppDesktopSidebar.jsx`
- Modify: `src/layouts/app/desktop/AppDesktopLayout.jsx`
- Modify: `src/layouts/app/components/sidebar/SidebarCompanySelector.jsx`

**Step 1: Update AppDesktopLayout to pass `onCollapse`**
Pass `onCollapse={() => setCollapsed(true)}` to `AppDesktopSidebar`.

**Step 2: Add mouse enter/leave timer and dropdown state tracking in AppDesktopSidebar**
- Keep `autoCloseTimerRef` with a 1500ms timer on `onMouseLeave`.
- Clear timer on `onMouseEnter` or when `collapsed` changes.
- Ensure selector dropdown open state suppresses auto-collapse.

**Step 3: Update SidebarCompanySelector to report open state**
Accept `onOpenChange` prop and trigger it when company/branch selector opens or closes.

---

### Task 2: Shift Details Button & Dialog in ViewDayClosingDialog
**Files:**
- Modify: `src/features/operations/day-closings/components/ViewDayClosingDialog.jsx`

**Step 1: Import ViewShiftDialog and Eye icon**
- Import `ViewShiftDialog` from `@/features/operations/shifts/components/ViewShiftDialog`.
- Import `Eye` icon from `lucide-react`.

**Step 2: Add selectedShift state and View Shift button**
- In `summary.shiftSummaries?.map((shift) => ...)`, render a "View Shift" button.
- Wire `<ViewShiftDialog isOpen={Boolean(selectedShift)} onClose={() => setSelectedShift(null)} shift={selectedShift} />`.

---

### Task 3: Shift Details Button & Dialog in CloseDayClosingDialog
**Files:**
- Modify: `src/features/operations/day-closings/components/CloseDayClosingDialog.jsx`

**Step 1: Import ViewShiftDialog and Eye icon**
- Import `ViewShiftDialog` and `Eye` icon.

**Step 2: Add selectedShift state and View Shift button**
- Add the "View Shift" button to `summary.shiftSummaries?.map((shift) => ...)`.
- Render `<ViewShiftDialog>`.

---

### Task 4: Verification and Task List Update
**Files:**
- Modify: `docs/plans/task.md`
- Modify: `tasks.text`

**Step 1: Verify frontend build**
Run: `npm run build` in `erp-frontend`.

**Step 2: Update task trackers**
Mark tasks as completed in `task.md` and `tasks.text`.
