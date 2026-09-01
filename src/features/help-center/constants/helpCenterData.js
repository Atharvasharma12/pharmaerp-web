// src/features/help-center/constants/helpCenterData.js

export const HELP_CATEGORIES = [
  {
    id: "getting-started",
    title: "Getting Started & Setup",
    desc: "Configure pharmacy branches, licenses, tax rules and company master profile.",
    iconName: "Sparkles",
    articleCount: 6,
  },
  {
    id: "pos-billing",
    title: "POS Billing & Sales",
    desc: "Barcode scanning, prescription cart, multi-tender payment and thermal receipts.",
    iconName: "ShoppingCart",
    articleCount: 12,
  },
  {
    id: "inventory-batches",
    title: "Inventory & Batch Expiry",
    desc: "Track medicine stock levels, batch numbers, expiry risk alerts and reorder limits.",
    iconName: "Package",
    articleCount: 15,
  },
  {
    id: "invoicing-gst",
    title: "Invoicing & GST Compliance",
    desc: "Tax invoice generation, HSN rates, CGST/SGST/IGST breakdown and credit notes.",
    iconName: "Receipt",
    articleCount: 9,
  },
  {
    id: "procurement",
    title: "Purchases & Suppliers",
    desc: "Purchase orders (PO), supplier intake reconciliation and payment schedules.",
    iconName: "Truck",
    articleCount: 8,
  },
  {
    id: "access-security",
    title: "Roles & Access Control",
    desc: "Manage staff permissions, cashier roles, pharmacist privileges and audit logs.",
    iconName: "ShieldCheck",
    articleCount: 7,
  },
];

export const HELP_FAQS = [
  {
    id: "faq-1",
    question: "How do I process a quick prescription sale using the POS Terminal?",
    category: "pos-billing",
    answer:
      "Navigate to 'Sales & POS > POS Billing'. Search or scan the medicine barcode to add items to the cart. Adjust quantities or discounts, choose the customer/patient, click 'Proceed to Pay', select payment method (Cash/UPI/Card), and confirm to instantly print a tax invoice receipt.",
  },
  {
    id: "faq-2",
    question: "How does batch expiry monitoring alert my pharmacy team?",
    category: "inventory-batches",
    answer:
      "PharmaERP tracks every medicine batch expiry date. In the Dashboard and Inventory views, products expiring within 30, 60, or 90 days are flagged with high-urgency color badges, enabling FIFO (First-In, First-Out) rotation and supplier return processing.",
  },
  {
    id: "faq-3",
    question: "Can I restrict cashier staff from editing prices or cancelling invoices?",
    category: "access-security",
    answer:
      "Yes. Navigate to 'Organization > Access Control'. You can assign specific granular permissions (such as bill:view and pos:create) while omitting bill:delete or bill:update so staff cannot cancel or tamper with finalized bills without owner approval.",
  },
  {
    id: "faq-4",
    question: "How do I create and send a Purchase Order to my medicine supplier?",
    category: "procurement",
    answer:
      "Go to 'Sales & POS > Purchases', click 'Issue Purchase Order', select your registered vendor, add medicine line items with quantities and unit costs, set the expected delivery date, and click 'Confirm & Issue Purchase Order'.",
  },
  {
    id: "faq-5",
    question: "What GST tax rates are supported for pharmaceutical goods?",
    category: "invoicing-gst",
    answer:
      "PharmaERP fully supports 0%, 5% (critical life-saving drugs), 12% (standard formulations and antibiotics), 18% (nutritional supplements and syrup tonics), and 28% with automated HSN validation.",
  },
];
