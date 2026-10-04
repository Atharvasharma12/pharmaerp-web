# Import B2B Outstanding Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement the "B2B Outstanding" import feature that dynamically parses MARG ERP debtor reports, extracts historical invoices, deduplicates, and securely imports them as credit sale bills via a unified modal interface.

**Architecture:** A unified frontend import modal that triggers backend parsing and validation. The backend handles MARG ERP Excel logic (`xlsx`), date alignment, customer discovery, duplicate avoidance, and invoice generation, maintaining data integrity and historical context.

**Tech Stack:** React, Express, MongoDB, Node.js, xlsx

---

### Task 1: Update API - Add `importB2BOutstanding` route

**Files:**
- Modify: `../pharmaerp-api/src/modules/parties/customers/routes/customer.routes.js`
- Modify: `../pharmaerp-api/src/modules/parties/customers/controllers/customer.controller.js`

**Step 1: Write routing modifications**
In the controller, update `previewImport` and `confirmImport` to use a `switch` based on `req.body.importType` (or `req.query.importType` for GET). For multipart requests, the type might be in `req.body`. Add placeholders for `parseB2BOutstandingExcel` and `confirmB2BOutstanding`.

**Step 2: Commit**
```bash
git add ../pharmaerp-api/src/modules/parties/customers/routes/customer.routes.js ../pharmaerp-api/src/modules/parties/customers/controllers/customer.controller.js
git commit -m "feat: setup basic routing for importB2BOutstanding"
```

### Task 2: Create Excel Parser Service

**Files:**
- Create: `../pharmaerp-api/src/modules/parties/customers/services/b2bOutstandingParser.service.js`

**Step 1: Write parser implementation**
Implement the logic to extract "DEBTORS OUTSTANDING AS ON..." date.
Implement the loop over rows: detecting "INVOICE", next row as customer name (normalizing it by removing pipes, multiple spaces, trimming), and then invoice rows, extracting `*` from invoice numbers. Convert date `dd-mm-yy` to `YYYY-MM-DD` using report date year. Stop invoice section on "TOTAL :" or next customer. Validate mandatory fields.

**Step 2: Commit**
```bash
git add ../pharmaerp-api/src/modules/parties/customers/services/b2bOutstandingParser.service.js
git commit -m "feat: implement marg erp excel parser for b2b outstanding"
```

### Task 3: Implement Database Check for Preview

**Files:**
- Modify: `../pharmaerp-api/src/modules/parties/customers/services/customer.service.js`

**Step 1: Integrate parser into `previewImport`**
When type is `b2b-outstanding`, call `b2bOutstandingParser.service.js` to get normalized records. 
Check duplicates against existing `SaleBill` (using invoice number and customer ID if matched).

**Step 2: Commit**
```bash
git add ../pharmaerp-api/src/modules/parties/customers/services/customer.service.js
git commit -m "feat: integrate b2b outstanding preview with database duplicate checks"
```

### Task 4: Implement Database Insertion for Confirm

**Files:**
- Modify: `../pharmaerp-api/src/modules/parties/customers/services/customer.service.js`

**Step 1: Integrate insertion into `confirmImport`**
When type is `b2b-outstanding`, iterate valid rows.
For each row, find or create the B2B customer using the normalized name. 
Create `SaleBill` with `paymentType="credit"`, original invoice total, and use the existing mechanism to set `outstandingAmount = balance`.
Generate a summary payload distinguishing created, skipped, and failed.

**Step 2: Commit**
```bash
git add ../pharmaerp-api/src/modules/parties/customers/services/customer.service.js
git commit -m "feat: implement sale bill creation for b2b outstanding import"
```

### Task 5: Create Frontend Import Modal

**Files:**
- Create: `src/features/parties/customers/components/ImportConfigModal.jsx`
- Modify: `src/features/parties/customers/pages/desktop/CustomersDesktopPage.jsx`

**Step 1: Implement ImportConfigModal**
Create a small modal containing a dropdown for Import Type (`b2b`, `b2c`, `b2b-outstanding`) and a file upload button. When submitted, pass type and file to page handler.

**Step 2: Update CustomersDesktopPage**
Replace the existing "Import B2B" UI with a single generic "Import" button. Open `ImportConfigModal`.
Update the preview call to include the `importType`. 
Render `CustomerImportPreviewModal` or `OutstandingImportPreviewModal` conditionally based on type.

**Step 3: Commit**
```bash
git add src/features/parties/customers/components/ImportConfigModal.jsx src/features/parties/customers/pages/desktop/CustomersDesktopPage.jsx
git commit -m "feat: create unified import config modal UI"
```

### Task 6: Create Outstanding Import Preview Modal

**Files:**
- Create: `src/features/parties/customers/components/OutstandingImportPreviewModal.jsx`

**Step 1: Implement Preview Modal**
Similar to `CustomerImportPreviewModal`, but with columns: Customer Name, Invoice No, Date, Bill Amt, Outstanding (Balance), Due. 
Highlight valid vs invalid/duplicate. Enable confirmation to call backend.

**Step 2: Commit**
```bash
git add src/features/parties/customers/components/OutstandingImportPreviewModal.jsx
git commit -m "feat: implement preview modal for outstanding import"
```
