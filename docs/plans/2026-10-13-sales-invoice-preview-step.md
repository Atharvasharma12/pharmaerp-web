# Sales Invoice Preview Step Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Insert an authentic A4 Tax Invoice preview dialog step (`SalesInvoicePreviewModal`) between the product cart and the payment checkout modal on both desktop and mobile sales pages.

**Architecture:** Create `SalesInvoicePreviewModal.jsx` which wraps `OrderInvoiceDocument.jsx` using live draft cart data. Replace the cart bottom CTA button text with "Proceed · ₹{Total}", which opens the preview dialog. In the preview dialog, a prominent "Checkout" button advances to `SalesCheckoutModal`.

**Tech Stack:** React 19, Tailwind CSS v4, Lucide React, existing ERP design system tokens.

---

### Task 1: Create `SalesInvoicePreviewModal` Component
**Files:**
- Create: `c:\Users\Intel\Desktop\pharma-erp\pharmaerp-web\src\features\sales\components\SalesInvoicePreviewModal.jsx`
- Modify: `c:\Users\Intel\Desktop\pharma-erp\pharmaerp-web\src\features\sales\components\index.js`

**Step 1:** Build `SalesInvoicePreviewModal.jsx` with:
- Top toolbar: "Bill Preview (Draft)", item count badge, "Back to Edit" button, primary "Checkout" button, and close (X).
- Keyboard shortcuts: `Enter` / `Ctrl+Enter` triggers `onProceedToCheckout`, `Escape` triggers `onClose`.
- Synthesized draft sale object passed into `<OrderInvoiceDocument saleData={draftSale} branch={branch} company={company} />`.
- Scrollable A4 paper wrapper with smooth custom scrollbar.

**Step 2:** Export `SalesInvoicePreviewModal` in `src/features/sales/components/index.js`.

---

### Task 2: Integrate Bill Preview in `SalesDesktopPage.jsx`
**Files:**
- Modify: `c:\Users\Intel\Desktop\pharma-erp\pharmaerp-web\src\features\sales\pages\desktop\SalesDesktopPage.jsx`

**Step 1:** Add `isInvoicePreviewOpen` state.
**Step 2:** Replace the bottom CTA button text from `Checkout · ₹...` to `Proceed · ₹...` with `ArrowRight` icon.
**Step 3:** Update `handleProceedToPreview`:
- Performs customer validation.
- Sets `setIsInvoicePreviewOpen(true)`.
**Step 4:** Wire `SalesInvoicePreviewModal`:
- `isOpen={isInvoicePreviewOpen}`
- `onClose={() => setIsInvoicePreviewOpen(false)}`
- `onProceedToCheckout={() => { setIsInvoicePreviewOpen(false); setIsCheckoutOpen(true); }}`
**Step 5:** Update Ctrl+Enter keyboard shortcut to trigger `handleProceedToPreview`.

---

### Task 3: Integrate Bill Preview in `SalesMobilePage.jsx`
**Files:**
- Modify: `c:\Users\Intel\Desktop\pharma-erp\pharmaerp-web\src\features\sales\pages\mobile\SalesMobilePage.jsx`

**Step 1:** Add `isInvoicePreviewOpen` state.
**Step 2:** Update bottom mobile button from `Checkout (₹...)` to `Proceed (₹...)`.
**Step 3:** Mount `<SalesInvoicePreviewModal>` and wire `onProceedToCheckout` to open `setIsCheckoutOpen(true)`.

---

### Task 4: Verification & Production Build
**Files:**
- Verify: `npm run build`
- Update: `docs/plans/task.md`
