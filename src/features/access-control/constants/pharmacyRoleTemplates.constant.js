export const PHARMACY_ROLE_TEMPLATES = {
  OWNER: {
    key: "OWNER",
    label: "Owner",
    description: "Full access to all pharmacy operations, financial reports, and system settings",
    icon: "👑",
    defaultPermissions: ["*"],
  },
  PHARMACIST: {
    key: "PHARMACIST",
    label: "Pharmacist",
    description: "POS billing, inventory stock management, customer lookup, prescription notes, and receipt generation",
    icon: "💊",
    defaultPermissions: [
      "billing:view", "billing:create", "billing:update",
      "inventory:view", "inventory:create", "inventory:update",
      "customer:view", "customer:create", "customer:update",
      "receipt:view", "receipt:create"
    ],
  },
  ACCOUNTANT: {
    key: "ACCOUNTANT",
    label: "Accountant",
    description: "Financial journal vouchers, bank transfers, ledger reports, and supplier payment records (no POS terminal access)",
    icon: "📊",
    defaultPermissions: [
      "finance:view", "finance:create", "finance:update",
      "report:view", "payment:view", "payment:create",
      "ledger:view"
    ],
  },
  HELPER: {
    key: "HELPER",
    label: "Store Helper",
    description: "Inventory stock view and POS cash billing assistance only",
    icon: "🏪",
    defaultPermissions: [
      "billing:create", "billing:view",
      "inventory:view"
    ],
  },
  DELIVERY: {
    key: "DELIVERY",
    label: "Delivery Agent",
    description: "View sales orders and update delivery dispatch statuses",
    icon: "🛵",
    defaultPermissions: [
      "order:view", "delivery:view", "delivery:update"
    ],
  },
  CUSTOM: {
    key: "CUSTOM",
    label: "Custom Role",
    description: "Pick and choose individual module permissions manually",
    icon: "⚙️",
    defaultPermissions: [],
  },
};
