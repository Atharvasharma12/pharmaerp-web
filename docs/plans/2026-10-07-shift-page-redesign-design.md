# Shift Page Complete UI Redesign - Design Document

## 1. Overview
The Shift Management page (`src/features/operations/shifts/pages/desktop/ShiftsDesktopPage.jsx` and related view components) is being completely redesigned to match the uploaded UI specification and the clean architecture established in `BusinessDaysDesktopPage.jsx`.

All legacy UI elements are replaced with a brand-new, modern layout built on standard theme tokens (`bg-bg`, `bg-surface`, `border-border`, etc.) and `UI*` primitives. No breadcrumbs are included per user specification.

---

## 2. Key Requirements & User Constraints
1. **No Breadcrumbs:** Omit breadcrumb navigation on the top of the page.
2. **Brand-New UI (Zero Legacy Remnants):** Replace old table structures, archaic headers, and filter toolbars completely.
3. **Screenshot Fidelity:**
   - Header with Title "Shifts", Subtitle "Manage cashier shifts and cash drawer sessions", and 3 actions: `Refresh`, `Export`, and `+ New Shift`.
   - 4 KPI/Stat cards in a row: Total Shifts, Open Shifts, Closed Shifts, Cancelled Shifts.
   - Filter toolbar with Date picker, Search bar ("Search by shift no, name or cashier..."), Status dropdown ("All", "Open", "Closed", "Cancelled"), Sort By dropdown ("Newest First", "Oldest First"), and `Table` / `Card` view toggle buttons.
   - 12-column Data Table:
     1. `#`
     2. `Shift No.`
     3. `Shift Name`
     4. `Business Date`
     5. `Time`
     6. `Cashier` (Initials avatar + name)
     7. `Opening Float`
     8. `Cash Sales`
     9. `Deposits`
     10. `Withdrawals`
     11. `Status` (UIBadge with dot)
     12. `Actions` (Eye icon, Lock icon for open shifts, 3-dots menu)
   - Pagination footer: `"Showing X to Y of Z shifts"`, `< 1 2 >`, and `"Show [ 6 ] per page"`.
   - Refreshed Card view for grid mode with matching metrics.
4. **Logic Preservation:**
   - Retain all Redux selectors and actions: `listShifts`, `clearShiftError`, `clearShiftMessage`.
   - Retain fallback shift name calculation and date filtering.
   - Retain dialog integrations: `CreateShiftDialog`, `ViewShiftDialog`, `CloseShiftDialog`, `CloseBusinessDayDialog`.
   - Retain CSV export and dynamic refresh.
5. **Theme Consistency:** Follow colors, index.css tokens, dark/light mode compatibility just as done on the Business Day page.

---

## 3. Component Architecture
* **`ShiftsDesktopPage.jsx`**: Main desktop container coordinating stats, toolbar, table/card view toggle, pagination, and modal dialogs.
* **`ShiftTableView.jsx`**: Data table implementing all 12 columns, interactive hover rows, status badges, and action buttons.
* **`ShiftCard.jsx`**: Refreshed modern card component for Grid/Card view.
* **Reusable `UI*` Components Used**:
  - `UIButton`, `UIInput`, `UIDatePicker`, `UISelect`, `UIBadge`, `UIEmptyState`, `UIPagination`, `UIAlert`
