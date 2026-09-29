# Design: Sidebar Auto-Close & Day Closing Shift View

## 1. Overview
This design covers two usability enhancements for the ERP frontend:
1. **Desktop Sidebar Auto-Close**: When the sidebar is expanded and the user's cursor leaves the sidebar boundary for 1.5 seconds, automatically collapse the sidebar. Moving the cursor back into the sidebar within 1.5s cancels the auto-collapse.
2. **Shift Details in Day Closing Views**: In the Day Closing view dialogs (`ViewDayClosingDialog` and `CloseDayClosingDialog`), provide a "View Shift" button for each shift listed under the Shift-wise Breakdown so users can view the full shift summary (float, transactions, denominations, cash differences, and fund transfers) via `ViewShiftDialog`.

---

## 2. Desktop Sidebar Auto-Close

### Requirements
- When the sidebar is open/expanded (`collapsed === false`), track cursor entry and leave on the desktop sidebar container.
- When `onMouseLeave` fires, start a 1500ms timer (`setTimeout`).
- If `onMouseEnter` fires before the timer expires, cancel and clear the timer (`clearTimeout`).
- If the timer completes (1.5 seconds without mouse re-entering), trigger collapse (`setCollapsed(true)`).
- When `collapsed === true`, the timer should not trigger or do anything.
- If a modal or dropdown is active (e.g. logout dialog, company dropdown), suppress auto-collapse.
- Clean up any active timer on unmount.

### Architecture
- Implement timer control in `AppDesktopSidebar.jsx` (or `AppDesktopLayout.jsx`).
- The `aside` or wrapper element gets `onMouseEnter` and `onMouseLeave` handlers.
- When `onMouseLeave` triggers while `!collapsed`, set a 1500ms timeout to call `onCollapse?.()` or `onToggleCollapse()`.
- When `onMouseEnter` triggers, clear the timeout ref.

---

## 3. Shift Details Modal in Day Closing Views

### Requirements
- In `ViewDayClosingDialog.jsx` and `CloseDayClosingDialog.jsx`, inside the `Shift-wise Breakdown` section, render an action button for each shift (e.g., `<UIButton variant="outline" size="sm"><Eye className="w-3.5 h-3.5 mr-1" /> View Shift</UIButton>`).
- Add state `selectedShiftForView` (initial `null`).
- Clicking "View Shift" sets `selectedShiftForView(shift)`.
- Render `<ViewShiftDialog isOpen={Boolean(selectedShiftForView)} onClose={() => setSelectedShiftForView(null)} shift={selectedShiftForView} />`.
- When opened, `ViewShiftDialog` fetches `/operations/shifts/:id/summary` and renders the modal with full details.
- Closing `ViewShiftDialog` returns focus back to the Day Closing view without disturbing its state.

---

## 4. Verification Plan
1. Test sidebar expansion: Click expand button, move mouse into sidebar -> remains open. Move mouse outside sidebar -> closes after 1.5s.
2. Move mouse outside sidebar, re-enter within 1s -> remains open, timer cancelled.
3. Test Day Closing view: Navigate to Day Closing (`/operations/day-closings`), open "View" or "Lock" dialog.
4. Verify each shift in the shift list has "View Shift" button.
5. Click "View Shift", verify `ViewShiftDialog` appears with denominations, cash summary, operations totals, and fund transfers.
6. Close `ViewShiftDialog`, verify Day Closing view is still open and responsive.
