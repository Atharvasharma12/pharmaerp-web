# Design Document: Invoice & Billing Hub Redesign

**Date:** 2026-10-12  
**Status:** Approved (Approach 1)  

---

## 1. Overview & Objectives

The Invoice & Billing Hub (`BillingDesktopPage.jsx`) requires a major architectural and visual overhaul to align with Pharma ERP's modern design system (as seen in the Business Day management pages) and address core usability requirements:

1. **Remove Unnecessary Controls**: Eliminate top page header, title, subtitle, POS button, top pagination, and the fake invoice creation dialog.
2. **Compact Daily Financial Statistics**: Replace the previous revenue cards with 4 ultra-compact metric cards:
   - **Total Invoices**
   - **Total Amount**
   - **Cash Amount** (including cash components of split payments)
   - **UPI Amount** (including UPI components of split payments)
3. **Filter-Independent Statistics**: Ensure statistics represent the entire filtered dataset across all records matching the active filters, completely decoupled from table pagination or infinite scroll batches.
4. **Date Filtering**: Default to **Today**, with options for **Last 7 Days**, **This Week**, **This Month**, and **Custom Range**.
5. **Modern Table with Reusable UI Components**: Use `@/components/ui/UITable` family (`UITable`, `UITableHeader`, `UITableBody`, `UITableRow`, `UITableHead`, `UITableCell`, `UIBadge`, etc.).
   - Remove **Due Date** and **Item** columns.
   - Add **Payment Type** column (`Cash`, `UPI`, `Split`).
   - In **Amount** column, display the total amount along with a clear sub-breakdown of Cash and UPI for Split payments.
6. **Constrained Scrolling & Reusable Infinite Scroll**: Provide a fixed/constrained table viewport with sticky header and independent internal vertical scrolling. When nearing the bottom, load batches of 10 items via a dedicated, reusable `UIInfiniteScroll` component.

---

## 2. Architecture & Data Flow

### 2.1 Backend Aggregation & Pagination (`pharmaerp-api`)
* **Endpoint**: `GET /api/v1/sales/invoices`
* **Query Parameters**:
  - `page`: default 1
  - `limit`: default 10 (updated from 20)
  - `startDate`, `endDate`: ISO date boundaries
  - `status`: `'all'`, `'Paid'`, `'Pending'`, `'Overdue'`, `'Cancelled'`
  - `paymentMethod`: `'all'`, `'Cash'`, `'UPI'`, `'Split'`, etc.
  - `search`: string (matches invoice number or customer name/phone)
  - `branchId`, `shiftId`: optional scopes
* **Repository Aggregation (`invoice.repository.js`)**:
  - Simultaneously query paginated items via `find(query).skip(skip).limit(limit)` and total document count via `countDocuments(query)`.
  - Concurrently compute accurate overall statistics across **all matching documents** in `query`:
    - `totalInvoices`: matching count
    - `totalAmount`: sum of `grandTotal` (excluding cancelled bills unless `status === 'Cancelled'`)
    - `cashAmount`: sum of pure Cash invoices + cash portions of Split invoices
    - `upiAmount`: sum of pure UPI invoices + UPI portions of Split invoices
  - Return `{ sales, total, page, limit, summary }`.
* **Controller Response**: Wraps `data: salesList`, `meta: { total, page, limit }`, and `summary: { totalInvoices, totalAmount, cashAmount, upiAmount }`.

### 2.2 Reusable Infinite Scroll Component (`UIInfiniteScroll.jsx`)
* **Location**: `src/components/ui/UIInfiniteScroll.jsx`
* **Export**: Available through `@/components/ui`
* **Mechanism**: Uses `IntersectionObserver` observing a sentinel element rendered at the bottom of the scroll container.
* **Key Props**:
  - `onLoadMore`: `() => void`
  - `hasMore`: `boolean`
  - `isLoading`: `boolean`
  - `rootMargin`: string (default `"150px"`)
  - `loader`: custom JSX or default `Loader2` spinner
  - `endMessage`: custom JSX or subtle "All invoices loaded" label
  - `children`: wrapped items or table content

### 2.3 Table & UI Layout (`BillingDesktopPage.jsx`)
* **Top Header**: Removed entirely.
* **Stat Cards Row**: 4 ultra-compact horizontal cards (`p-3.5`, concise layout with icon + label + bold formatted value).
* **Table Filter Bar**:
  - Reusable `UIInput` for real-time search with clear button.
  - Reusable `UIDatePicker` / `UISelect` for date ranges (`Today`, `Last 7 Days`, `This Week`, `This Month`, `Custom Range`).
  - Reusable `UISelect` for Payment Method (`All Payments`, `Cash`, `UPI`, `Split`).
  - Reusable `UISelect` for Status (`All Statuses`, `Paid`, `Pending`, `Overdue`, `Cancelled`).
  - **Refresh Button**: in the table toolbar with loading spinner.
  - **Reset Filters Button**: clears filters back to defaults.
* **Table Viewport**:
  - Constrained height (`max-h-[calc(100vh-270px)]`), internal scrolling (`overflow-y-auto`).
  - Sticky table header (`sticky top-0 z-10 bg-surface-alt`).
  - Columns:
    1. `Invoice No`: font-mono bold text-primary
    2. `Customer / Patient`: customer name + phone
    3. `Date`: date, time, edited indicator
    4. `Payment Type`: `UIBadge` (Cash: green/emerald, UPI: purple/violet, Split: amber/orange)
    5. `Amount`: formatted total ₹, plus split breakdown sub-lines for split invoices
    6. `Status`: `UIBadge`
    7. `Actions`: View details button (opens `BillingInvoiceDetailsDrawer`)

---

## 3. Data Integrity & Edge Cases

1. **Split Payments Reconciliation**:
   - Split breakdown sums match `inv.grandTotal`.
   - Extracted directly from `inv.payments` where `p.paymentType` is Cash or UPI.
2. **Cancelled Invoices**:
   - Cancelled invoices do not artificially inflate `cashAmount` or `upiAmount`.
3. **Filter Changes vs Infinite Scroll**:
   - Changing search, date range, payment method, or status triggers an immediate reset: `page` resets to 1, `invoices` array resets, and the table scrolls to top.
   - Fetching subsequent batches (page 2, 3...) only appends new invoices without resetting or recomputing the summary statistics.
