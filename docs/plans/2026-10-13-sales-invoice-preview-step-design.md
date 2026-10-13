# Sales Invoice Preview Step Design Document

## 1. Overview & Objective
In the current sales workflow, clicking the primary action on the cart immediately opens the payment (`SalesCheckoutModal`) dialog. To reduce billing errors, allow visual verification of items, taxes, discounts, and customer details, and provide a realistic tax invoice preview before collecting funds, we are introducing an **Invoice Preview** step between the cart and payment.

### The New Flow:
1. **Cart Selection:** Cashier adds products to cart, selects customer/doctor, and sets billing mode.
2. **Proceed Action:** Cashier clicks **"Proceed · ₹{Total}"** (instead of direct "Checkout").
3. **Bill Preview Modal (`SalesInvoicePreviewModal`):**
   - An A4 Tax Invoice document preview opens containing all current cart items, GST slab summary, customer details, and totals.
   - Distinctly marked with a "PENDING" stamp / "Draft Preview" badge.
   - Header contains **"Back to Edit"** (returns to cart) and **"Checkout"** (advances to payment).
4. **Checkout Payment Modal (`SalesCheckoutModal`):**
   - Cashier collects payment (Cash with live drawer/denominations, UPI QR, Split, Credit, Advance).
5. **Final Paid Invoice Bill (`OrderInvoiceModal`):**
   - Displays confirmed invoice with real invoice number, UPI payment QR, "PAID" stamp, and one-click "Print Bill".

---

## 2. Architecture & Component Structure

### New Component: `SalesInvoicePreviewModal.jsx`
- **Location:** `src/features/sales/components/SalesInvoicePreviewModal.jsx`
- **Export:** Exported individually and via `src/features/sales/components/index.js`.
- **Internal Document Renderer:** Reuses `OrderInvoiceDocument.jsx` to maintain 100% visual parity with the final printed bill.
- **Synthesized Draft Sale Data:**
  ```javascript
  const draftSaleData = useMemo(() => ({
    invoiceNo: "DRAFT-PREVIEW",
    orderId: `ORD-${Date.now().toString().slice(-6)}`,
    invoiceDate: saleDate || new Date().toISOString().split("T")[0],
    billingMode,
    customer: activeCustomer,
    customerName: resolvedCustomerName,
    customerPhone: resolvedCustomerPhone,
    doctorName,
    items: cart,
    paymentMethod: "Pending Checkout",
    isPaid: false,
    status: "Pending",
    showPaidStamp: true,
  }), [...]);
  ```

### Header Action Controls
- **Left:** Icon, "Bill Preview" title, "DRAFT" badge, and item count.
- **Right:**
  - `UIButton` (variant="outline"): **"Back to Edit"** (Esc / click).
  - `UIButton` (variant="primary"): **"Checkout"** (Enter / click) — advances directly to `SalesCheckoutModal`.
  - Close button (`X`).

---

## 3. Page Integrations

### 1. `SalesDesktopPage.jsx`
- Replace bottom CTA button text from `Checkout · ₹{Total}` to `Proceed · ₹{Total}` with `ArrowRight` icon.
- Replace keyboard shortcut hint from `Ctrl+Enter Checkout` to `Ctrl+Enter Proceed`.
- State variable: `isInvoicePreviewOpen` (boolean).
- Flow:
  - `handleProceedToPreview`: Validates customer/party name -> opens `SalesInvoicePreviewModal`.
  - `handleProceedFromPreviewToCheckout`: Closes `SalesInvoicePreviewModal` -> opens `SalesCheckoutModal`.
  - On checkout complete: closes `SalesCheckoutModal` -> opens final `OrderInvoiceModal`.

### 2. `SalesMobilePage.jsx`
- Replace mobile bottom button from `Checkout (₹{Total})` to `Proceed (₹{Total})`.
- Same modal sequence adapted for responsive layout.

---

## 4. Verification Plan
- Unit verification of `SalesInvoicePreviewModal` props and draft synthesis.
- Keyboard shortcut verification (`Enter` to checkout, `Esc` to return to cart).
- Production build validation (`npm run build` exit code 0).
