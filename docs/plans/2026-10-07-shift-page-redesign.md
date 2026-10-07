# Shift Page Redesign Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Completely replace the Shift page UI with the exact new layout from the user screenshot and Business Day page pattern, with zero legacy UI remnants, no breadcrumbs, and full preservation of backend and business logic.

**Architecture:** Rewrite `ShiftsDesktopPage.jsx`, `ShiftTableView.jsx`, and `ShiftCard.jsx` using modern theme tokens (`bg-bg`, `bg-surface`, `border-border`, `text-text`, `text-text-muted`, etc.) and reusable `UI*` primitives (`UIButton`, `UIInput`, `UIDatePicker`, `UISelect`, `UIBadge`, `UIEmptyState`, `UIPagination`, `UIAlert`).

**Tech Stack:** React 19, Tailwind CSS (Tokens & CSS Variables), Lucide Icons, Redux Toolkit, Vite.

---

### Task 1: Rebuild `ShiftTableView.jsx` with All 12 Columns
**Files:**
- Modify: `src/features/operations/shifts/components/ShiftTableView.jsx`

**Step 1: Implement 12-column table structure**
- Columns: `#`, `Shift No.`, `Shift Name`, `Business Date`, `Time`, `Cashier`, `Opening Float`, `Cash Sales`, `Deposits`, `Withdrawals`, `Status`, `Actions`.
- Cashier column with avatar initials badge (`JD`, `MS`, etc.) and full name.
- Status column using `UIBadge` with dot variant (`success` for Open, `neutral` for Closed, `error` for Cancelled).
- Actions column with Eye icon button, Lock icon button (when open), and 3-dots `MoreVertical` menu.

**Step 2: Verify table rendering with edge cases (empty strings, zero amounts)**

---

### Task 2: Rebuild `ShiftCard.jsx` for Card View
**Files:**
- Modify: `src/features/operations/shifts/components/ShiftCard.jsx`

**Step 1: Implement refreshed modern card UI**
- Header with shift title, shift number, status dot badge.
- Cashier avatar with initials and name.
- Business date and time range.
- Metric grid: Opening Float, Cash Sales, Deposits, Withdrawals.
- Action buttons: View details, Lock shift (if open).

---

### Task 3: Completely Rewrite `ShiftsDesktopPage.jsx`
**Files:**
- Modify: `src/features/operations/shifts/pages/desktop/ShiftsDesktopPage.jsx`

**Step 1: Implement Page Header**
- Title: "Shifts", Subtitle: "Manage cashier shifts and cash drawer sessions". (No breadcrumb).
- Actions: `Refresh` button, `Export` button with dropdown chevron (downloads CSV), and `+ New Shift` button.

**Step 2: Implement 4 Stat KPI Cards**
- Total Shifts: Soft blue `Users` icon container, count, "All shift sessions".
- Open Shifts: Soft green `Play` icon container, count, "Currently active".
- Closed Shifts: Slate/dark `CheckCircle2` icon container, count, "Completed".
- Cancelled Shifts: Soft red `XCircle` icon container, count, "Did not start".

**Step 3: Implement Filter & View Toolbar**
- Date picker with calendar icon.
- Search input with search icon ("Search by shift no, name or cashier...").
- Status select ("All", "Open", "Closed", "Cancelled").
- Sort by select ("Newest First", "Oldest First").
- View switcher buttons: `Table` (filled green when active) and `Card` (outline when active).

**Step 4: Integrate Data Table, Card View, and Empty State**
- Render `ShiftTableView` when viewMode is "table" or `ShiftCard` grid when viewMode is "card".
- Render `UIEmptyState` when no shifts match filters.

**Step 5: Implement Bottom Pagination**
- "Showing X to Y of Z shifts" on the left.
- `< 1 2 >` page buttons in center/right.
- "Show [ 6 ] per page" dropdown.

**Step 6: Maintain All Modal Dialogs & Handlers**
- Wire up `CreateShiftDialog`, `ViewShiftDialog`, `CloseShiftDialog`, `CloseBusinessDayDialog`.

---

### Task 4: Align Props & Pagination in `ShiftsPage.jsx`
**Files:**
- Modify: `src/features/operations/shifts/pages/ShiftsPage.jsx`

**Step 1: Ensure viewMode default is "table"**
- Set default viewMode to "table" (or `UI_TOOLBAR_VIEWS.TABLE`).
- Ensure pageSize is 6 as shown in screenshot.
- Ensure all filtered and pagination counts align with the table rows.

---

### Task 5: Build Verification
**Files:**
- Run Vite build: `npm run build` in `erp-frontend` to verify 0 syntax or bundle errors.
