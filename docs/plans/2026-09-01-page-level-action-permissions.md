# Page-Level & Button-Level Permission Gating Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement granular page-level and button-level permission gating across all list, details, and hub pages in the ERP, ensuring action buttons (Add, Create, Edit, Update, Delete, Invite, Import, Post) are conditionally rendered only when the current user has the required permission.

**Architecture:** Use `usePermission()` (`can`, `canAny`) and a declarative `<PermissionGate>` wrapper component. Every create, edit, delete, and action trigger across 25+ feature pages is gated with its specific permission key (`*:create`, `*:update`, `*:delete`).

**Tech Stack:** React 18, Redux Toolkit, Lucide React, Tailwind CSS

---

### Task 1: Create Declarative `<PermissionGate>` Component

**Files:**
- Create: `c:/Users/Intel/Desktop/erp/erp-frontend/src/components/common/PermissionGate.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/components/common/index.js` (or `components/ui/index.js`)

**Step 1: Implement `PermissionGate`**
- Accepts `permission` (string), `permissions` (array for `canAny`), `requireAll` (boolean for `canAll`), `fallback` (optional ReactNode), `children`.
- Evaluates permissions via `usePermission()` with automatic owner bypass.

---

### Task 2: Gating Parties & Organization Pages

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/parties/customers/pages/CustomersPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/parties/customers/pages/CustomerDetailsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/parties/suppliers/pages/SuppliersPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/parties/suppliers/pages/SupplierDetailsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/parties/pages/PartiesPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/company/pages/CompaniesPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/company/pages/CompanyDetailsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/branch/pages/BranchesPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/branch/pages/BranchDetailsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/pages/WorkspaceMembersPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/pages/WorkspaceMemberDetailsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/access-control/pages/RolesPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/access-control/pages/RoleDetailsPage.jsx`

**Actions Gated:**
- "Add Customer" (`customer:create`), Edit (`customer:update`), Delete (`customer:delete`)
- "Add Supplier" (`supplier:create`), Edit (`supplier:update`), Delete (`supplier:delete`)
- "Add Company" (`company:create`), Edit/Settings (`company:update`), Delete (`company:delete`)
- "Add Branch" (`branch:create`), Edit/Settings (`branch:update`), Delete (`branch:delete`)
- "Invite Member" (`workspace-member:create`), Edit Access (`member-access:update`), Remove Member (`workspace-member:delete`)
- "Create Role" (`role:create`), Edit Role (`role:update`), Delete Role (`role:delete`)

---

### Task 3: Gating Finance & Chart of Accounts Pages

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/chart-of-accounts/accounts/pages/AccountsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/chart-of-accounts/accounts/pages/AccountDetailsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/chart-of-accounts/account-groups/pages/AccountGroupsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/chart-of-accounts/account-groups/pages/AccountGroupDetailsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/chart-of-accounts/pages/ChartOfAccountsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/journal-vouchers/pages/desktop/JournalVouchersDesktopPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/journal-vouchers/pages/mobile/JournalVouchersMobilePage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/journal-vouchers/pages/JournalVoucherDetailsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/financial-periods/pages/FinancialPeriodsPage.jsx`

**Actions Gated:**
- "Add Account" (`account:create`), Edit (`account:update`), Delete (`account:delete`)
- "Add Account Group" (`account-group:create`), Edit (`account-group:update`), Delete (`account-group:delete`)
- "Create Journal Voucher" (`journal-voucher:create`), Edit (`journal-voucher:update`), Post Voucher (`journal-voucher:post`)
- "Add Financial Period" (`financial-period:create`)

---

### Task 4: Gating Treasury Management Pages

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/treasury/bank-management/bank-accounts/pages/BankAccountsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/treasury/bank-management/bank-accounts/pages/BankAccountDetailsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/treasury/cash-management/cash-accounts/pages/CashAccountsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/treasury/cash-management/cash-accounts/pages/CashAccountDetailsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/treasury/fund-transfers/pages/FundTransfersPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/treasury/cheque-management/pages/ChequesPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/treasury/payment-qr/pages/PaymentQrsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/treasury/bank-management/bank-slips/pages/desktop/BankSlipsDesktopPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/treasury/bank-management/bank-slips/pages/mobile/BankSlipsMobilePage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/treasury/cash-management/cash-denominations/pages/CashDenominationsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/finance/treasury/pages/TreasuryPage.jsx`

**Actions Gated:**
- "Add Bank Account" (`bank-account:create`), Edit (`bank-account:update`), Delete (`bank-account:delete`)
- "Add Cash Account" (`cash-account:create`), Edit (`cash-account:update`)
- "New Fund Transfer" (`fund-transfer:create`)
- "Issue Cheque" (`cheque:create`)
- "Create Payment QR" (`payment-qr:create`)
- "Create Bank Slip" (`bank-slip:create`)
- "Record Cash Denomination" (`cash-denomination:create`)

---

### Task 5: Gating Inventory, Catalog & Master Data Pages

**Files:**
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace-products/pages/WorkspaceProductsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace-products/pages/WorkspaceProductDetailsPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/hsn-master/pages/HsnMasterPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/manufacturer-master/pages/ManufacturerMasterPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/salt-master/pages/SaltMasterPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/category-master/pages/CategoryMasterPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/product-form-master/pages/ProductFormMasterPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/uom-master/pages/UomMasterPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/bank-master/pages/BankMasterPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/marketplace/stores/pages/MarketplaceStoreListPage.jsx`
- Modify: `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/marketplace/products/pages/MarketplaceProductsPage.jsx`

**Actions Gated:**
- "Add Medicine / Product" (`product:create`), Import (`product:create`), Edit (`product:update`), Delete (`product:delete`)
- Master Data Adds (`*:create`), Edits (`*:update`), Deletes (`*:delete`)
- Marketplace Store & Product Adds (`*:create`), Edits (`*:update`)

---

### Task 6: Verification & Production Build

- Run frontend production build: `npm run build`
- Confirm exit code 0 with 0 errors.
