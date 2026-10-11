# Invoice & Billing Hub Redesign Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Transform the Invoice & Billing Hub into a streamlined, high-performance view with decoupled aggregated statistics, compact stat cards, reusable UI components, sticky-header table with split payment breakdown, and a reusable infinite scroll component.

**Architecture:** 
1. Backend (`invoice.repository.js`, `invoice.service.js`) calculates accurate global totals (`totalInvoices`, `totalAmount`, `cashAmount`, `upiAmount`) across all records matching the query filters, returned alongside paginated items.
2. Reusable `UIInfiniteScroll` component monitors an intersection sentinel inside a constrained scroll container to fetch subsequent 10-item batches.
3. Frontend (`BillingDesktopPage.jsx`) consumes backend summary, replaces the old header with compact 4-stat cards, adds a toolbar with Refresh and reusable UI selects/inputs, and renders a modern `UITable` with split breakdowns and no traditional pagination.

**Tech Stack:** React 18, Tailwind CSS, Lucide React, Framer Motion, Express.js, Mongoose, MongoDB.

---

### Task 1: Backend Aggregated Statistics & Limit 10 Default

**Files:**
- Modify: `pharmaerp-api/src/modules/sales/invoices/repositories/invoice.repository.js:86-165`
- Modify: `pharmaerp-api/src/modules/sales/invoices/services/invoice.service.js:1086-1102`

**Step 1: Update `getAllInvoices` in `invoice.repository.js`**
- Set default limit to 10.
- Execute an aggregation / summary calculation across all documents matching `query` to compute:
  - `totalInvoices`: total matching documents
  - `totalAmount`: sum of `grandTotal` (excluding Cancelled invoices unless `status === "Cancelled"`)
  - `cashAmount`: sum of Cash invoices `grandTotal` + cash components in Split invoices
  - `upiAmount`: sum of UPI invoices `grandTotal` + UPI components in Split invoices
- Return `{ sales: mappedData, total, page, limit, summary }`.

**Step 2: Update `getAllCustomerSales` in `invoice.service.js`**
- Forward `summary: result.summary` in the returned object.

**Step 3: Verification**
- Validate backend syntax and run node check on `invoice.repository.js` to ensure proper query execution.

---

### Task 2: Reusable `UIInfiniteScroll` Component

**Files:**
- Create: `pharmaerp-web/src/components/ui/UIInfiniteScroll.jsx`
- Modify: `pharmaerp-web/src/components/ui/index.js`

**Step 1: Implement `UIInfiniteScroll.jsx`**
- Build a generic, accessible component using `IntersectionObserver`.
- Props: `onLoadMore`, `hasMore`, `isLoading`, `rootMargin`, `loader`, `endMessage`, `className`, `children`.
- Include safe observer disconnect on unmount, guard against double-firing when `isLoading` or `!hasMore`.

**Step 2: Export in `src/components/ui/index.js`**
- Export `UIInfiniteScroll` alongside existing UI primitives.

**Step 3: Verification**
- Build/lint check in `pharmaerp-web`.

---

### Task 3: Redesign `BillingDesktopPage.jsx` Layout & Statistics

**Files:**
- Modify: `pharmaerp-web/src/features/billing/pages/desktop/BillingDesktopPage.jsx`

**Step 1: Clean Up Unused Elements**
- Remove top page header: title `Invoices & Billing Hub`, subtitle, POS Terminal button, top pagination controls, and `BillingCreateInvoiceModal` (fake invoice creation dialog).

**Step 2: Implement Compact 4-Card Statistics Grid**
- Render 4 ultra-compact horizontal cards (`Total Invoices`, `Total Amount`, `Cash Amount`, `UPI Amount`).
- Bind values to `backendSummary` from the API response (independent of loaded page rows).
- Ensure styling uses design system tokens (`bg-surface`, `border-border`, `text-text`, compact `p-3.5`).

---

### Task 4: Filter Toolbar & Reusable Controls

**Files:**
- Modify: `pharmaerp-web/src/features/billing/pages/desktop/BillingDesktopPage.jsx`

**Step 1: Redesign Toolbar**
- Add Refresh button with spinning indicator into the table toolbar.
- Reusable `UIInput` for customer/invoice search with clearable button.
- Reusable `UISelect` for date ranges (`Today` default, `Last 7 Days`, `This Week`, `This Month`, `Custom Range`) with custom start/end pickers when `Custom Range` is selected.
- Reusable `UISelect` for Payment Method (`All Payments`, `Cash`, `UPI`, `Split`).
- Reusable `UISelect` for Status (`All Statuses`, `Paid`, `Pending`, `Overdue`, `Cancelled`).
- Reusable `UIButton` for Reset filters.

---

### Task 5: Reusable `UITable`, Fixed-Height Container & Split Breakdown

**Files:**
- Modify: `pharmaerp-web/src/features/billing/pages/desktop/BillingDesktopPage.jsx`

**Step 1: Table Structure with Reusable UI Components**
- Use `UITable`, `UITableHeader`, `UITableBody`, `UITableRow`, `UITableHead`, `UITableCell`, `UIBadge`, `UIEmptyState`.
- Fixed height container with `overflow-y-auto` and sticky table header (`sticky top-0 z-10`).
- Columns:
  1. `Invoice No`
  2. `Customer / Patient`
  3. `Date`
  4. `Payment Type` (`Cash`, `UPI`, `Split` with distinct `UIBadge` variants)
  5. `Amount` (Prominent total ₹ with clean sub-breakdown for split payments: `Cash: ₹...`, `UPI: ₹...`)
  6. `Status` (`UIBadge`)
  7. `Actions` (View Details)
- Ensure **Due Date** and **Item** columns are completely removed.

**Step 2: Infinite Scroll Integration**
- Limit = 10 per request.
- Attach `UIInfiniteScroll` sentinel to bottom of table.
- Appends new records seamlessly without page jump or altering overall statistics.
- Reset to page 1 on filter or search updates.

---

### Task 6: Final Verification & Testing

**Files:**
- Test with `npm run build` in `pharmaerp-web`.
- Verify API response format and frontend error handling.
