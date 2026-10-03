# POS Terminal & Shift Fixes Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Apply dark mode theme fixes to POS terminal pages, restrict POS to open shifts, auto-calculate cash breakdown change, prevent multiple open shifts, reset Redux state on branch/company change, and remove mock POS search users.

**Architecture:** We will modify `SalesDesktopPage.jsx`, `POSTerminalPage.jsx`, and `SalesCheckoutModal.jsx` to remove hardcoded light mode colors. We will update `CashBreakdownModal.jsx` with an effect that automatically calculates the returned denominations based on `expectedChange`. We will update the `shift.controller.js` backend and add Redux store reset listeners.

**Tech Stack:** React, Tailwind CSS, Express, Redux Toolkit.

---

### Task 1: Fix Styling for Sales Checkout / Receipt
**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\sales\components\SalesCheckoutModal.jsx`

**Step 1:** Replace hardcoded colors (like `bg-slate-100`, `bg-white`, `text-slate-800`, `border-slate-300`, `bg-slate-50`, `bg-slate-800`) with theme variables (`bg-surface-alt`, `bg-surface`, `text-text`, `border-border`, `bg-primary`, `text-primary-foreground`, `text-text-muted`).

### Task 2: Auto-calculate change in Cash Breakdown Modal
**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\sales\components\CashBreakdownModal.jsx`

**Step 1:** Add a `useEffect` that triggers when `expectedChange`, `availableDenomsMap`, or `received` changes. It should execute the greedy algorithm to compute the `autoReturned` denominations object and `setReturned(autoReturned)`.

### Task 3: Hide POS Sales Page if no shift is open
**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\sales\pages\desktop\SalesDesktopPage.jsx`
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\billing\pages\POSTerminalPage.jsx`

**Step 1:** Import `useSelector` and get `state.shift.activeShift`.
**Step 2:** Early return a "No Open Shift" empty state component if `!activeShift`. Include a button that routes to `/operations/shifts`.

### Task 4: Set Customer Doctor Info Date from Open Shift
**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\sales\components\SalesCustomerDoctorInfo.jsx`
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\sales\pages\desktop\SalesDesktopPage.jsx`

**Step 1:** In `SalesDesktopPage`, pass `activeShift?.createdAt` to `SalesCustomerDoctorInfo`.
**Step 2:** Make the date field read-only and prefilled with the open shift's date.

### Task 5: Prevent multiple open shifts (Backend)
**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-backend\src\modules\operations\shifts\shift.controller.js`

**Step 1:** In `openShift` controller, check if an open shift exists for the user/branch/company. Throw a 400 error if one exists.

### Task 6: Reset Redux state on Company/Branch Change
**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\store\rootReducer.js`
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\layouts\app\components\sidebar\SidebarCompanySelector.jsx`
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\layouts\app\components\sidebar\SidebarBranchSelector.jsx`

**Step 1:** In `rootReducer`, add handling for `"APP/RESET_STATE"` to preserve only core auth/user/company/branch states and clear others.
**Step 2:** Dispatch `"APP/RESET_STATE"` before dispatching `setCompany` / `setBranch`.

### Task 7: Remove mock users in Customer Search
**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\parties\customers\components\B2cCustomerSearchBar.jsx`
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\parties\customers\components\B2bCustomerSearchBar.jsx`

**Step 1:** Remove static mock results fallback (`POS_DEFAULT_CUSTOMERS`, etc.) from the dropdown and `useEffect` block. Show only API-fetched real users.
