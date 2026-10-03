# Permission Catalog & Role Sync Design Document

**Date:** 2026-09-01  
**Goal:** Synchronize the complete permission catalog, system role templates, and member access resolution in `erp-backend`, and align the navigation and route access gates in `erp-frontend`.

---

## 1. Backend Permission Architecture (`erp-backend`)

### 1.1 Complete Permission Catalog (`PERMISSIONS`)
Granular permission tokens organized by domain module:

- **Organization & Team:**
  - `workspace:view`, `workspace:update`, `workspace:delete`
  - `workspace-member:view`, `workspace-member:create`, `workspace-member:update`, `workspace-member:delete`
  - `company:view`, `company:create`, `company:update`, `company:delete`
  - `branch:view`, `branch:create`, `branch:update`, `branch:delete`

- **Access Control:**
  - `role:view`, `role:create`, `role:update`, `role:delete`
  - `member-access:view`, `member-access:update`

- **Parties:**
  - `customer:view`, `customer:create`, `customer:update`, `customer:delete`
  - `supplier:view`, `supplier:create`, `supplier:update`, `supplier:delete`

- **Catalog & Inventory:**
  - `product:view`, `product:create`, `product:update`, `product:delete`
  - `global-product:view`, `global-product:create`, `global-product:update`, `global-product:delete`
  - `category:view`, `category:create`, `category:update`, `category:delete`
  - `inventory:view`, `inventory:create`, `inventory:update`, `inventory:delete`
  - `stock:view`, `stock:create`, `stock:update`, `stock:delete`
  - `hsn:view`, `hsn:create`, `hsn:update`, `hsn:delete`
  - `manufacturer:view`, `manufacturer:create`, `manufacturer:update`, `manufacturer:delete`
  - `salt:view`, `salt:create`, `salt:update`, `salt:delete`
  - `uom:view`, `uom:create`, `uom:update`, `uom:delete`
  - `product-form:view`, `product-form:create`, `product-form:update`, `product-form:delete`
  - `bank-master:view`, `bank-master:create`, `bank-master:update`, `bank-master:delete`

- **Sales, POS & Purchasing:**
  - `sale:view`, `sale:create`, `sale:update`, `sale:delete`
  - `pos:view`, `pos:create`
  - `bill:view`, `bill:create`, `bill:update`, `bill:delete`
  - `sales-return:view`, `sales-return:create`, `sales-return:update`, `sales-return:delete`
  - `purchase:view`, `purchase:create`, `purchase:update`, `purchase:delete`
  - `purchase-return:view`, `purchase-return:create`, `purchase-return:update`, `purchase-return:delete`

- **Marketplace:**
  - `marketplace-store:view`, `marketplace-store:create`, `marketplace-store:update`, `marketplace-store:delete`
  - `marketplace-product:view`, `marketplace-product:create`, `marketplace-product:update`, `marketplace-product:delete`
  - `marketplace-pricing:view`, `marketplace-pricing:create`, `marketplace-pricing:update`

- **Finance & Treasury:**
  - `account-group:view`, `account-group:create`, `account-group:update`, `account-group:delete`
  - `account:view`, `account:create`, `account:update`, `account:delete`
  - `account-balance:view`
  - `opening-balance:view`, `opening-balance:create`, `opening-balance:update`
  - `financial-period:view`, `financial-period:create`, `financial-period:update`
  - `journal-voucher:view`, `journal-voucher:create`, `journal-voucher:update`, `journal-voucher:delete`, `journal-voucher:post`
  - `ledger:view`, `ledger:export`
  - `report:view`, `report:export`
  - `bank-account:view`, `bank-account:create`, `bank-account:update`, `bank-account:delete`
  - `bank-transaction:view`, `bank-transaction:create`, `bank-transaction:update`
  - `bank-slip:view`, `bank-slip:create`, `bank-slip:update`
  - `cash-account:view`, `cash-account:create`, `cash-account:update`
  - `cash-transaction:view`, `cash-transaction:create`, `cash-transaction:update`
  - `cash-denomination:view`, `cash-denomination:create`, `cash-denomination:update`
  - `fund-transfer:view`, `fund-transfer:create`, `fund-transfer:update`
  - `cheque:view`, `cheque:create`, `cheque:update`
  - `payment-qr:view`, `payment-qr:create`, `payment-qr:update`
  - `expense:view`, `expense:create`, `expense:update`, `expense:delete`
  - `payment:view`, `payment:create`, `payment:update`

- **System & Management:**
  - `subscription:view`, `subscription:update`
  - `settings:view`, `settings:update`
  - `dashboard:view`

---

### 1.2 System Role Templates (`DEFAULT_ROLE_PERMISSIONS`)

1. **Owner (`owner`)**: All permissions (`ALL_PERMISSIONS`)
2. **Admin (`admin`)**: Full operational, team, catalog, finance, and company configuration access.
3. **Manager (`manager`)**: Company & branch operations, product catalog, stock/inventory, purchases, sales, customers, suppliers, financial reports, dashboard.
4. **Pharmacist (`pharmacist`)**: Product catalog, master compositions (salt, form, manufacturer), stock & batches, sales, billing, POS, customers.
5. **Cashier (`cashier`)**: POS billing, sales, invoice generation, customer view & registration, cash accounts & counter denominations.
6. **Accountant (`accountant`)**: Full chart of accounts, journal vouchers, general ledger, treasury (bank/cash accounts, slips, cheques, UPI QR, fund transfers), customer & supplier balances/payments, financial reports.
7. **Inventory Manager (`inventory_manager`)**: Full inventory, stock batches, global catalog, workspace products, all catalog masters (HSN, salt, manufacturer, form, UOM, category, bank), purchases, supplier management.
8. **Salesman (`salesman`)**: Sales, POS billing, orders & invoices, customers, marketplace stores & products.
9. **Staff (`staff`)**: Dashboard view and basic assigned branch view.

---

### 1.3 Backend Member Access Resolution
- `GET /core/access-control/member-access/me` and `/core/access-control/member-access/:memberUserId`:
  - Populates member's `roleId` and resolves their effective `permissions: [...]`.
  - For workspace owners (`isOwner === true`), returns `permissions: ALL_PERMISSIONS` and `isOwner: true`.

---

## 2. Frontend Synchronization (`erp-frontend`)

### 2.1 Navigation & Search Configuration (`sidebarNavConfig.js` & `accessibleSearchCommands.js`)
- Map every nav item to its exact backend permission key:
  - Companies: `company:view`
  - Branches: `branch:view`
  - Staff & Members: `workspace-member:view`
  - Access Control: `role:view`
  - Customers: `customer:view`
  - Suppliers: `supplier:view`
  - All Parties: `canAny(['customer:view', 'supplier:view'])`
  - Pharmacy Stock: `product:view`
  - Global Catalog: `global-product:view`
  - Master Data: `hsn:view`, `manufacturer:view`, `salt:view`, `category:view`, `product-form:view`, `uom:view`, `bank-master:view`
  - POS Billing: `pos:view`
  - Invoices & Billing: `bill:view`
  - Purchases: `purchase:view`
  - Marketplace Stores: `marketplace-store:view`
  - Marketplace Products: `marketplace-product:view`
  - Chart of Accounts: `account:view`, `account-group:view`, `account-balance:view`
  - Treasury: `bank-account:view`, `cash-account:view`, `fund-transfer:view`, `cheque:view`, `payment-qr:view`, `bank-slip:view`, `cash-denomination:view`
  - Journal Vouchers: `journal-voucher:view`
  - General Ledger: `ledger:view`
  - Financial Periods: `financial-period:view`
  - Financial Reports: `report:view`

### 2.2 Route Protection (`routes.jsx`)
- Wrap each route with `<PermissionGuard permission="...">` using the exact backend permission strings.
