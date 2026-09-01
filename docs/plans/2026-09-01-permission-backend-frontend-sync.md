# Permission Catalog & Role Sync Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Create the complete granular permission catalog and tailored system role templates in `erp-backend`, wire member access resolution with full permission payloads, and synchronize `erp-frontend` navigation and route guards with the exact backend permission keys.

**Architecture:** The backend (`erp-backend`) defines the single source of truth for all 50+ permission tokens in `permission.constant.js` and role templates in `role.constant.js`. Member access queries (`GET /core/access-control/member-access/me`) resolve and return the member's assigned role and active permission set. The frontend (`erp-frontend`) checks these exact permission keys in navigation filtering, header search, settings tabs, and route guards.

**Tech Stack:** Node.js, Express, MongoDB/Mongoose, React 18, Redux Toolkit, React Router v6

---

### Task 1: Backend — Expand Permission Catalog (`permission.constant.js`)

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/core/access-control/constants/permission.constant.js`

**Step 1: Update `PERMISSIONS` object**
Add all granular permissions for:
- Organization (`workspace:*`, `company:*`, `branch:*`, `workspace-member:*`)
- Access Control (`role:*`, `member-access:*`)
- Parties (`customer:*`, `supplier:*`)
- Catalog & Masters (`product:*`, `global-product:*`, `category:*`, `hsn:*`, `manufacturer:*`, `salt:*`, `uom:*`, `product-form:*`, `bank-master:*`)
- Inventory & Stock (`inventory:*`, `stock:*`)
- Sales, POS & Purchases (`sale:*`, `sales-return:*`, `pos:*`, `bill:*`, `purchase:*`, `purchase-return:*`)
- Marketplace (`marketplace-store:*`, `marketplace-product:*`, `marketplace-pricing:*`)
- Finance (`account-group:*`, `account:*`, `account-balance:*`, `opening-balance:*`, `financial-period:*`, `journal-voucher:*`, `ledger:*`, `report:*`, `expense:*`, `payment:*`)
- Treasury (`bank-account:*`, `bank-transaction:*`, `bank-slip:*`, `cash-account:*`, `cash-transaction:*`, `cash-denomination:*`, `fund-transfer:*`, `cheque:*`, `payment-qr:*`)
- Subscription & Settings (`subscription:*`, `settings:*`, `dashboard:*`)

**Step 2: Export updated `ALL_PERMISSIONS`**

---

### Task 2: Backend — Add Salesman Role & Update Role Templates (`role.constant.js` & `permission.constant.js`)

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/core/access-control/constants/role.constant.js`
- Modify: `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/core/access-control/constants/permission.constant.js`

**Step 1: Add `SALESMAN` to `SYSTEM_ROLES`**
- `SALESMAN: "salesman"`
- Label: `"Salesman"`
- Description: `"Access to POS billing, sales transactions, customers and marketplace stores"`

**Step 2: Define Granular `DEFAULT_ROLE_PERMISSIONS`**
- `owner`: `ALL_PERMISSIONS`
- `admin`: Full workspace operations, catalog, team, finance, and company configuration
- `manager`: Company, branch, inventory, stock, purchases, sales, parties, and reports
- `pharmacist`: Product catalog, master compositions, inventory stock, batches, sales, POS, and customers
- `cashier`: POS billing, sales, bills, customers, cash counter denominations
- `accountant`: Chart of accounts, journal vouchers, ledger, treasury (bank & cash), customer/supplier ledger, financial reports
- `inventory_manager`: Full catalog, workspace products, stock batches, all catalog master data, purchases, suppliers
- `salesman`: Sales, POS billing, orders & invoices, customers, marketplace stores & products
- `staff`: Dashboard view and basic branch access

---

### Task 3: Backend — Member Access Resolution with Populated Permissions

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/core/access-control/services/memberAccess.service.js`
- Modify: `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/core/access-control/controllers/memberAccess.controller.js`

**Step 1: Update `getMemberAccess` controller to handle `"me"`**
If `req.params.memberUserId === "me"`, resolve to `req.user._id`.

**Step 2: Update `getMemberAccess` service**
- Populate member's `roleId` (`name`, `code`, `permissions`, `isSystem`, `status`).
- Resolve effective permissions:
  - If `isOwner === true`, assign `ALL_PERMISSIONS`.
  - Else, assign `member.roleId?.permissions || []`.
- Return `{ ...access, role: member.roleId, permissions, isOwner }`.

---

### Task 4: Frontend — Synchronize Permission Keys in Navigation & Command Search

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/layouts/app/components/sidebar/sidebarNavConfig.js`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/layouts/app/components/header/accessibleSearchCommands.js`

**Step 1: Align `sidebarNavConfig.js`**
Update all item `permission` keys to exact backend tokens:
- Companies: `company:view`
- Branches: `branch:view`
- Members: `workspace-member:view`
- Access Control: `role:view`
- Customers: `customer:view`
- Suppliers: `supplier:view`
- All Parties: `customer:view` (or party view)
- Stock: `product:view`
- Global Catalog: `global-product:view`
- Master Data: `hsn:view`, `manufacturer:view`, `salt:view`, `category:view`, `product-form:view`, `uom:view`, `bank-master:view`
- POS Billing: `pos:view`
- Invoicing: `bill:view`
- Purchases: `purchase:view`
- Marketplace: `marketplace-store:view`, `marketplace-product:view`
- Chart of Accounts: `account:view`, `account-group:view`, `account-balance:view`
- Treasury: `bank-account:view`, `cash-account:view`, `fund-transfer:view`, `cheque:view`, `payment-qr:view`, `bank-slip:view`, `cash-denomination:view`
- Journal Vouchers: `journal-voucher:view`
- Ledger: `ledger:view`
- Financial Periods: `financial-period:view`
- Reports: `report:view`

**Step 2: Align `accessibleSearchCommands.js`**
Update all quick action `permission` keys to match backend tokens.

---

### Task 5: Frontend — Synchronize Route Guards (`routes.jsx` & `settingsRoutes.jsx`)

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/app/routes.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/settings/pages/SettingsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/settings/pages/desktop/SettingsDesktopPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/settings/pages/mobile/SettingsMobilePage.jsx`

**Step 1: Align `routes.jsx` PermissionGuard props**
Update each route wrapper:
- `workspaceRoutes`: `permission="workspace:view"`
- `companyRoutes`: `permission="company:view"`
- `branchRoutes`: `permission="branch:view"`
- `accessControlRoutes`: `permission="role:view"`
- `customerRoutes`: `permission="customer:view"`
- `supplierRoutes`: `permission="supplier:view"`
- `partiesRoutes`: `permissions={["customer:view", "supplier:view"]}`
- `subscriptionRoutes`: `permission="subscription:view"`
- `financeRoutes`, `chartOfAccountsRoutes`, `accountRoutes`, `accountGroupRoutes`, `accountBalanceRoutes`: `permission="account:view"`
- `journalVoucherRoutes`: `permission="journal-voucher:view"`
- `ledgerRoutes`: `permission="ledger:view"`
- `reportsRoutes`: `permission="report:view"`
- `financialPeriodRoutes`: `permission="financial-period:view"`
- `treasuryRoutes`, `bankAccountRoutes`, `bankTransactionRoutes`, `bankSlipRoutes`: `permission="bank-account:view"`
- `cashAccountRoutes`, `cashTransactionRoutes`, `cashDenominationRoutes`: `permission="cash-account:view"`
- `fundTransferRoutes`: `permission="fund-transfer:view"`
- `chequeRoutes`: `permission="cheque:view"`
- `paymentQrRoutes`: `permission="payment-qr:view"`
- `workspaceProductRoutes`: `permission="product:view"`
- `globalProductRoutes`: `permission="global-product:view"`
- `catalogRoutes`: `permission="product:view"`
- `hsnMasterRoutes`: `permission="hsn:view"`
- `manufacturerMasterRoutes`: `permission="manufacturer:view"`
- `saltMasterRoutes`: `permission="salt:view"`
- `categoryMasterRoutes`: `permission="category:view"`
- `productFormMasterRoutes`: `permission="product-form:view"`
- `uomMasterRoutes`: `permission="uom:view"`
- `bankMasterRoutes`: `permission="bank-master:view"`
- `marketplaceStoreRoutes`: `permission="marketplace-store:view"`
- `marketplaceProductRoutes`: `permission="marketplace-product:view"`

**Step 2: Align Settings tabs**
- `billing`: `subscription:view`
- `integrations`: `workspace:update` (or `settings:update`)

---

### Task 6: Verification & Production Build

**Step 1: Validate backend syntax & modules**
**Step 2: Run frontend production build**
Run: `npm run build` in `erp-frontend`
Expected: Exit code 0 with 0 errors.
