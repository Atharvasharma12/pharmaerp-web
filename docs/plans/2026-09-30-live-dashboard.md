# ERP Live Dashboard Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Transform the ERP frontend dashboard from static mock data to a 100% live, real-time analytics dashboard backed by a high-performance backend aggregation service querying real MongoDB collections (`SalesInvoice`, `WorkspaceProduct`, `Batch`, `ProductFacility`, `PurchaseBill`), while removing any unsupported dummy fields (such as fake compliance percentages and fake online orders).

**Architecture:** A dedicated, tenant-aware backend module (`/api/v1/dashboard/overview`) computes multi-tenant operational KPIs (revenue, today's sales, stock counts, low stock alerts, expiring batches, 6-month financial performance, category distribution, and live alerts) scoped to the active `workspaceId`, `companyId`, and optional `branchId`. The frontend dashboard consumes this unified endpoint with real-time refresh, loading skeletons, graceful zero-states, and live table data.

**Tech Stack:** Node.js, Express, MongoDB (Mongoose aggregation pipelines), React 18, Redux Toolkit, Tailwind CSS, Lucide Icons, Framer Motion.

---

## 🏛️ Council Deliberation & Verdict Summary

- **Verdict:** **PROCEED WITH MODIFICATIONS**
- **Confidence Score:** 96%
- **Key Council Directives:**
  1. **Strict Real Data Rule:** Remove all fake fields with no DB backing (Hero Banner "Compliance: 98%", Revenue Card "Online Orders: ₹42k", fake AI forecast copy).
  2. **Unified Aggregation Service:** Instead of 8 client-side requests, create `GET /api/v1/dashboard/overview` in `erp-backend` using compound indexes (`companyId`, `workspaceId`, `branchId`, `date`).
  3. **Tenancy Scoping:** Dashboard metrics must dynamically re-aggregate when the user switches Company or Branch via the existing `x-company-id` and `x-branch-id` interceptors.
  4. **Robust Zero-State Handling:** When a new workspace or branch has 0 sales or 0 batches, render clean ₹0 / 0-count badges and informative empty states without SVG NaN errors or broken paths.
  5. **Operational Activity over Fake AI:** Convert `SmartPharmacyInsightsCard` into live data-driven **Operational Alerts & Activity** (e.g. low stock warnings, expiring batch notices, shift status, and invoice counts).

---

## Field & Feature Mapping: Mock vs. Real Reality

| Dashboard Element | Current Mock Field / State | Real Backend Source / Action | Resolution |
| :--- | :--- | :--- | :--- |
| **Hero Banner** | `184 transactions today` | Count of `SalesInvoice` for today (00:00 to 23:59:59) | **LIVE** (query count) |
| **Hero Banner** | `Compliance: 98%` | No compliance model exists in ERP DB | **REMOVE** per user directive |
| **KPI: Total Revenue** | `₹1,28,450 (+18.4%)` | Sum of `grandTotal` from `SalesInvoice` for current month/all-time | **LIVE** (sum from DB) |
| **KPI: Stock Count** | `12,845 (+320)` | Count of active `WorkspaceProduct` / total sum of batch quantities | **LIVE** (count from DB) |
| **KPI: Low Stock** | `37 items` | Count of products/batches with stock <= 10 or <= reorder level | **LIVE** (query threshold) |
| **KPI: Expiring Soon**| `56 items (30 days)` | Count of `Batch` records with `expiryDate` in next 30 days | **LIVE** (date range query) |
| **KPI: Today's Sales**| `₹8,940 (+9.2%)` | Sum of `grandTotal` from `SalesInvoice` where date = today | **LIVE** (sum from DB) |
| **Monthly Revenue** | Revenue, Profit, Expenses, Online Orders | Revenue (`SalesInvoice`), Expenses (`PurchaseBill`), Net Margin, Invoices Count | **LIVE** (replace Online Orders with Invoices Count or Tax) |
| **Revenue Chart** | 6-month static points (Jan-Jun) | 6-month monthly aggregation of `SalesInvoice` and `PurchaseBill` | **LIVE** (dynamic 6-month buckets) |
| **Inventory Donut** | Fake categories (Tablets 40%, etc.) | Aggregation of `WorkspaceProduct` grouped by `category` (CategoryMaster) or `productType` | **LIVE** (real product distribution) |
| **Inventory Table** | 8 hardcoded medicines | Live paginated/filtered list of `WorkspaceProduct` with batches/stock | **LIVE** (real inventory products) |
| **AI Insights Card** | 5 static fake AI predictions | Data-driven operational alerts derived from real inventory & sales metrics | **LIVE** (real alerts & activity) |
| **Low Stock Action** | 4 static medicines | Top items with lowest stock from `ProductFacility` / `Batch` | **LIVE** (real low stock list) |
| **Expiry Alerts** | 12 fake bars, 4 static items | Earliest expiring batches from `Batch` collection | **LIVE** (real batch expiry list) |
| **Supplier Updates** | Fake shipment statuses | Recent purchase bills / payables from `PurchaseBill` | **LIVE** (real purchase bills) |

---

## Tasks Breakdown

### Task 1: Backend Dashboard Overview Repository & Aggregations
Create the data aggregation pipelines querying `SalesInvoice`, `WorkspaceProduct`, `Batch`, `ProductFacility`, and `PurchaseBill` with tenant isolation (`workspaceId`, `companyId`, `branchId`).

**Files:**
- Create: `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/dashboard/repositories/dashboard.repository.js`
- Test: Verify with script querying live MongoDB collections.

---

### Task 2: Backend Dashboard Service, Controller, and Module Routing
Assemble the service layer, HTTP controller, and express router under `/api/v1/dashboard`.

**Files:**
- Create: `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/dashboard/services/dashboard.service.js`
- Create: `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/dashboard/controllers/dashboard.controller.js`
- Create: `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/dashboard/routes/dashboard.routes.js`
- Create: `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/dashboard/dashboard.module.js`
- Modify: `c:/Users/Intel/Desktop/erp/erp-backend/src/routes/index.routes.js`

---

### Task 3: Frontend API Service and Endpoints Integration
Register the dashboard endpoints in the frontend service layer and create a hook/service to fetch live dashboard data.

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/services/endpoints.js` (add `DASHBOARD.OVERVIEW`)
- Create: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/dashboard/services/dashboardService.js`
- Create: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/dashboard/hooks/useDashboardData.js`

---

### Task 4: Refactor Hero Banner & Remove Fake Compliance Field
Remove the unsupported `Compliance: 98%` pill and wire the hero banner to real live data (today's transactions, today's sales).

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/dashboard/components/DashboardHeroBanner.jsx`

---

### Task 5: Refactor KPI Grid with Live Metrics & Clean Zero-States
Replace the static `DASHBOARD_KPI_CARDS` constant with real dynamic metrics computed from backend response.

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/dashboard/components/DashboardKpiGrid.jsx`

---

### Task 6: Refactor Monthly Revenue Performance & Financial Chart
Replace static points and remove fake "Online Orders".

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/dashboard/components/MonthlyRevenueChartCard.jsx`

---

### Task 7: Refactor Inventory Distribution Donut Card with Live Categories
Bind the donut chart to real `WorkspaceProduct` category distribution data.

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/dashboard/components/InventoryDistributionCard.jsx`

---

### Task 8: Refactor Inventory Overview Table Card with Live Products
Connect the inventory table to real live products from the workspace.

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/dashboard/components/InventoryOverviewTableCard.jsx`

---

### Task 9: Refactor Action Cards Grid & Transform AI Insights to Live Alerts
Connect Action Cards to live low stock, live expiry batches, and live purchase bills, and transform AI insights to real operational alerts.

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/dashboard/components/DashboardActionCardsGrid.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/dashboard/components/SmartPharmacyInsightsCard.jsx`

---

### Task 10: Wire Desktop and Mobile Dashboard Pages & End-to-End Verification
Connect `MainDashboardDesktopPage.jsx` and `MainDashboardMobilePage.jsx` to the live data flow, test end-to-end with backend running, and verify all views.

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/dashboard/pages/desktop/MainDashboardDesktopPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/dashboard/pages/mobile/MainDashboardMobilePage.jsx`
