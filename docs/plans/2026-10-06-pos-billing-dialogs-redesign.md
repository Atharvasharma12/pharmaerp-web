# POS Billing & Operational Dialogs Redesign Specification

**Date**: 2026-10-06  
**Status**: Approved  
**Scope**: POS Billing Page (Empty / Closed States), View Shift Dialog, Close Business Day Dialog, View Business Day Dialog, Post-Close Confirmation Dialog, and modal triggers alignment.

---

## 🎯 Objectives
1. **Elevate POS Billing Closed/Empty State**: Replace simple text notice with a high-end, premium ERP operational terminal banner and direct action triggers ("Start Business Day", "Start Shift").
2. **Redesign Operational Dialogs**: Rebuild **View Shift**, **Close Business Day**, **View Business Day**, and **Post-Close Confirmation** dialogs using standard `src/components/ui/` components (`UIModal`, `UIStatCard`, `UIInfoCard`, `UIDetailRow`, `UIKeyValueList`, `UIBadge`, `UIButton`, `UIAlert`).
3. **Unified Component Language & Aesthetics**: Standardize color coding (emerald for sales/running cash, cyan for frozen reserve, amber/rose for warnings), typography (`font-mono` for figures), paddings, and interaction states.

---

## 🏗️ Detailed Architecture & Component Changes

### 1. POS Terminal / Billing Page (`POSTerminalPage.jsx`)
- **Closed State Handling**:
  - Detect `openBusinessDay` and `activeShift`.
  - If **No Business Day is Open**: Render a premium hero card with date/branch context, operational workflow timeline, and a primary CTA **"Start Business Day"** that opens `OpenBusinessDayDialog` in-place.
  - If **Business Day is Open, but No Shift is Open**: Render an active day card with branch cash balance info, shift supervisor details, and a primary CTA **"Start Shift"** that opens `CreateShiftDialog` in-place.
  - Support seamless modal callbacks so opening a day/shift directly updates the POS Billing state without requiring page navigation.

### 2. View Shift Dialog (`ViewShiftDialog.jsx`)
- **Header**: Gradient clock icon, shift name, status badge (`UIBadge`), shift number in `font-mono`.
- **Top Metrics**: Dual `UIStatCard` components for **Running Cash** (emerald) and **Frozen Reserve** (cyan).
- **Segmented Tabs**:
  - `Cash Summary`: Expected cash breakdown using `UIDetailRow` / `UIKeyValueList`, plus closing discrepancy card with variance indicators (`TrendingUp` / `TrendingDown` / `Minus`).
  - `Bills & Payments`: Cash sales vs Digital/UPI sales cards, per-QR terminal breakdown list.
  - `Cash Drawer`: Opening float count vs Closing/Live count tables with clean tabular alignment.
  - `Fund Movements`: Shift deposits & withdrawals list.

### 3. Close Business Day Dialog (`CloseBusinessDayDialog.jsx`)
- **Header**: Lock icon, business day date, session title.
- **Active Shift Blocker**: `UIAlert` / alert card when active register shifts exist, disabling the close button until all shifts are closed.
- **Audit Summary**: `UIInfoCard` & `UIDetailRow` list for Business Day No., date, opened time, shift count.
- **Shift Verification List**: Itemized list of all shifts run with status badges and quick view trigger (`ViewShiftDialog`).
- **Confirmation & Lock Action**: End-of-day remarks input, verification checkbox, and danger action button.

### 4. View Business Day Dialog (`ViewBusinessDayDialog.jsx`)
- **Header**: Calendar icon, business day number, session status badge (`UIBadge`).
- **Segmented Tabs**:
  - `Overview`: Hero session card, audit trail (`UIDetailRow`), shift status statistics grid (`UIStatCard`).
  - `Shifts`: Chronological list of register shifts with status badges and details inspector.
  - `Transfers & Slips`: Branch cash transfers and bank deposit slips with status indicators.

### 5. Post Shift Close Confirmation Dialog (`PostShiftCloseDialog.jsx`)
- **Success Header**: Emerald checkmark graphic, shift finalized title.
- **Post-Close Balance Cards**: Carry-forward cash & frozen reserve stat cards (`UIStatCard`).
- **Interactive Action Cards**:
  - Primary: **"Start Next Shift"** → Opens `CreateShiftDialog` directly.
  - Secondary: **"Close Business Day"** → Opens `CloseBusinessDayDialog` directly.
  - Ghost: **"Return to POS Terminal"** → Dismisses dialog.

---

## 🛠️ Design Tokens & Component Rules
- Reusable UI imports from `@/components/ui`:
  - `UIModal`, `UIModalHeader`, `UIModalTitle`, `UIModalBody`, `UIModalFooter`
  - `UIStatCard`, `UIInfoCard`, `UIDetailRow`, `UIKeyValueList`
  - `UIBadge`, `UIButton`, `UIAlert`, `UIStatusIndicator`
- Numeric Formatting: All currency figures use `₹${fmt(amount)}` with `font-mono`.
- Spacing & Padding: Consistent `space-y-4` inside modal bodies, `p-4` or `p-3.5` for cards, `rounded-xl` borders.
