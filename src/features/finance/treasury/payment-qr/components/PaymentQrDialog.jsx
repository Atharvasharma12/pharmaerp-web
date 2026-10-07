import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIInput,
  UISelect,
  UICheckbox,
  UIButton,
  UIAlert,
  UIBadge,
  UISkeleton,
} from "@/components/ui";
import {
  QrCode,
  Building2,
  Landmark,
  CheckCircle2,
  Copy,
  Check,
  Star,
  Sparkles,
  ShieldCheck,
  Lock,
  AtSign,
  Smartphone,
  Layers,
  Info,
  CreditCard,
  Tag,
} from "lucide-react";

import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";

const PROVIDER_OPTIONS = [
  { label: "Google Pay (GPay)", value: "GPAY", description: "Google Pay for Business" },
  { label: "PhonePe for Business", value: "PHONEPE", description: "PhonePe Merchant QR" },
  { label: "Paytm Business", value: "PAYTM", description: "Paytm All-In-One QR" },
  { label: "BHIM / NPCI Official", value: "BHIM", description: "Standard Bharat Interface for Money" },
  { label: "Razorpay POS", value: "RAZORPAY", description: "Razorpay Dynamic QR Gateway" },
  { label: "Cashfree Payments", value: "CASHFREE", description: "Cashfree UPI Collections" },
  { label: "Other / Standard UPI", value: "OTHER", description: "Universal Interoperable UPI" },
];

const INITIAL_FORM = {
  label: "",
  upiId: "",
  provider: "OTHER",
  bankAccountId: "",
  isPrimary: false,
  isActive: true,
};

/**
 * Countertop UPI Standee Preview Component
 * Recreates the authentic merchant QR standee seen at billing counters
 */
const CountertopUpiStandee = ({
  upiId,
  label,
  provider,
  isPrimary,
  bankAccount,
}) => {
  const [copied, setCopied] = useState(false);

  const cleanUpi = String(upiId || "").trim().toLowerCase();
  const displayName = label || "BILLING COUNTER";

  // Standard UPI intent payload for merchant QR
  const upiPayPayload = useMemo(() => {
    if (!cleanUpi) {
      return "upi://pay?pa=demo@upi&pn=Retail%20Store&cu=INR";
    }
    return `upi://pay?pa=${encodeURIComponent(cleanUpi)}&pn=${encodeURIComponent(
      displayName
    )}&cu=INR`;
  }, [cleanUpi, displayName]);

  const qrImageUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(
      upiPayPayload
    )}`;
  }, [upiPayPayload]);

  const handleCopyUpi = (e) => {
    e.stopPropagation();
    if (!cleanUpi) return;
    navigator.clipboard.writeText(cleanUpi);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const providerLabel = useMemo(() => {
    const match = PROVIDER_OPTIONS.find((p) => p.value === provider);
    return match ? match.label.split(" ")[0] : "UPI";
  }, [provider]);

  return (
    <div className="relative w-full max-w-[340px] mx-auto rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 p-5 text-white shadow-2xl border border-white/15 overflow-hidden flex flex-col items-center select-none">
      {/* Background Refraction Lights */}
      <div className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 size-40 rounded-full bg-blue-500/15 blur-3xl" />

      {/* Top Banner: BHIM UPI Header */}
      <div className="relative z-10 w-full flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-white/10 flex items-center justify-center text-white text-[10px] font-black tracking-tighter">
            UPI
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-200">
            Scan & Pay
          </span>
        </div>

        {isPrimary && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-300/30 backdrop-blur-md">
            <Star className="size-2.5 fill-amber-300" />
            PRIMARY POS
          </span>
        )}
      </div>

      {/* White QR Code Plate */}
      <div className="relative z-10 w-full max-w-[230px] aspect-square bg-white rounded-2xl p-3.5 shadow-xl border border-white/40 flex flex-col items-center justify-center">
        {cleanUpi ? (
          <img
            src={qrImageUrl}
            alt="UPI QR Code"
            className="w-full h-full object-contain mix-blend-multiply"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-200 rounded-xl p-3 text-center">
            <QrCode className="size-12 stroke-[1.2] mb-1.5 opacity-50" />
            <span className="text-[10px] font-medium leading-tight">
              Enter UPI ID to generate live QR
            </span>
          </div>
        )}
      </div>

      {/* Merchant / Display Name */}
      <div className="relative z-10 w-full text-center mt-4">
        <div className="text-[10px] tracking-wider uppercase font-semibold text-indigo-300/80">
          Accepted At
        </div>
        <div className="text-sm font-bold text-white truncate px-2 drop-shadow-sm">
          {displayName}
        </div>
      </div>

      {/* UPI ID Pill with Copy Button */}
      <div className="relative z-10 mt-2.5 w-full">
        <button
          type="button"
          onClick={handleCopyUpi}
          disabled={!cleanUpi}
          className="w-full px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md flex items-center justify-between gap-2 text-xs font-mono font-medium text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Click to copy UPI ID"
        >
          <div className="flex items-center gap-1.5 truncate">
            <AtSign className="size-3 text-indigo-300 shrink-0" />
            <span className="truncate">{cleanUpi || "handle@bank"}</span>
          </div>
          {copied ? (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold shrink-0">
              <Check className="size-3" /> Copied
            </span>
          ) : (
            <Copy className="size-3 text-white/60 hover:text-white shrink-0" />
          )}
        </button>
      </div>

      {/* Bottom Footer: Accepted Wallets & Bank Chip */}
      <div className="relative z-10 w-full mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
        <span className="truncate max-w-[170px]">
          {bankAccount ? (
            <span className="text-indigo-200 font-medium">
              Settles: {bankAccount.accountName || "Bank Account"}
            </span>
          ) : (
            "GPay • PhonePe • Paytm • BHIM"
          )}
        </span>
        <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-bold text-[9px] uppercase tracking-wider shrink-0">
          {providerLabel}
        </span>
      </div>
    </div>
  );
};

export function PaymentQrDialog({
  isOpen,
  onClose,
  mode = "create",
  entityId = null,
  qrData = null,
  onSubmitCreate,
  onSubmitUpdate,
  onFetchById,
  onSuccess,
}) {
  const { bankAccounts = [], getBankAccounts } = useBankAccount();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [details, setDetails] = useState(qrData);

  // Load active bank accounts list when modal opens
  useEffect(() => {
    if (isOpen) {
      getBankAccounts({ all: true }).catch(() => {});
    }
  }, [isOpen, getBankAccounts]);

  // Load existing details for edit or view
  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM);
      setFormErrors({});
      setServerError(null);
      setDetails(null);
      return;
    }

    if (mode === "view" || mode === "edit") {
      if (qrData) {
        setDetails(qrData);
        if (mode === "edit") {
          setFormData({
            label: qrData.label || qrData.qrName || qrData.name || "",
            upiId: qrData.upiId || "",
            provider: qrData.provider || "OTHER",
            bankAccountId: qrData.bankAccountId?._id || qrData.bankAccountId || "",
            isPrimary: Boolean(qrData.isPrimary),
            isActive: qrData.status !== "INACTIVE" && qrData.isActive !== false,
          });
        }
      } else if (entityId && onFetchById) {
        setIsFetching(true);
        setServerError(null);
        onFetchById(entityId)
          .then((data) => {
            setDetails(data);
            if (mode === "edit" && data) {
              setFormData({
                label: data.label || data.qrName || data.name || "",
                upiId: data.upiId || "",
                provider: data.provider || "OTHER",
                bankAccountId: data.bankAccountId?._id || data.bankAccountId || "",
                isPrimary: Boolean(data.isPrimary),
                isActive: data.status !== "INACTIVE" && data.isActive !== false,
              });
            }
          })
          .catch((err) =>
            setServerError(
              typeof err === "string" ? err : "Failed to load payment QR details."
            )
          )
          .finally(() => setIsFetching(false));
      }
    }
  }, [isOpen, mode, entityId, qrData, onFetchById]);

  // Auto-select primary bank account when creating a new QR
  useEffect(() => {
    if (mode === "create" && isOpen && !formData.bankAccountId && bankAccounts.length > 0) {
      const activeBanks = bankAccounts.filter((b) => b.isActive !== false);
      const defaultBank = activeBanks.find((b) => b.isPrimary) || activeBanks[0];
      if (defaultBank) {
        setFormData((prev) => ({
          ...prev,
          bankAccountId: defaultBank._id,
          label: prev.label || `${defaultBank.accountName} QR`,
        }));
      }
    }
  }, [mode, isOpen, bankAccounts, formData.bankAccountId]);

  // Bank Account Options for Searchable UISelect
  const bankOptions = useMemo(() => {
    return bankAccounts
      .filter((acc) => acc.isActive !== false)
      .map((acc) => {
        const bankTitle = acc.bankMasterId?.name || acc.bankName || "Corporate Bank";
        const maskedNum = String(acc.accountNumber || "").slice(-4);
        return {
          label: `${acc.accountName} (•••• ${maskedNum})`,
          value: acc._id,
          description: `${bankTitle} • IFSC: ${acc.ifscCode} ${
            acc.isPrimary ? "• Primary Account" : ""
          }`,
        };
      });
  }, [bankAccounts]);

  // Resolved Bank Account Object for live display
  const selectedBankAccount = useMemo(() => {
    const id = formData.bankAccountId;
    if (!id) return null;
    return bankAccounts.find((b) => b._id === id) || null;
  }, [bankAccounts, formData.bankAccountId]);

  // Unified change handler that reliably extracts values from either event or raw value
  const handleFieldChange = useCallback(
    (name, valueOrEvent) => {
      let val = valueOrEvent;
      if (valueOrEvent && typeof valueOrEvent === "object" && "target" in valueOrEvent) {
        val =
          valueOrEvent.target.type === "checkbox"
            ? valueOrEvent.target.checked
            : valueOrEvent.target.value;
      }

      setFormData((prev) => {
        const nextData = { ...prev, [name]: val };

        // Smart provider auto-detection from UPI handle suffix
        if (name === "upiId" && typeof val === "string") {
          const lower = val.toLowerCase();
          if (
            lower.includes("@okaxis") ||
            lower.includes("@okhdfcbank") ||
            lower.includes("@oksbi") ||
            lower.includes("@okicici")
          ) {
            nextData.provider = "GPAY";
          } else if (
            lower.includes("@ybl") ||
            lower.includes("@ibl") ||
            lower.includes("@axl")
          ) {
            nextData.provider = "PHONEPE";
          } else if (lower.includes("@paytm")) {
            nextData.provider = "PAYTM";
          } else if (lower.includes("@upi")) {
            nextData.provider = "BHIM";
          } else if (lower.includes("@razorpay")) {
            nextData.provider = "RAZORPAY";
          }
        }

        // Auto-fill label if empty and a bank account is selected
        if (name === "bankAccountId" && val && !prev.label) {
          const bank = bankAccounts.find((b) => b._id === val);
          if (bank) {
            nextData.label = `${bank.accountName} QR`;
          }
        }

        return nextData;
      });

      setFormErrors((prev) => ({ ...prev, [name]: undefined, submit: undefined }));
    },
    [bankAccounts]
  );

  const validate = () => {
    const errors = {};
    if (mode === "create" && !formData.bankAccountId) {
      errors.bankAccountId = "Select a linked corporate bank account";
    }

    if (!formData.upiId.trim()) {
      errors.upiId = "UPI ID / VPA is required";
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(formData.upiId.trim())) {
      errors.upiId = "Invalid UPI ID format (e.g. store@okaxis or pharmacy@icici)";
    }

    if (!formData.label.trim()) {
      errors.label = "QR Label / Counter Name is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      if (mode === "create") {
        const payload = {
          bankAccountId: formData.bankAccountId,
          upiId: formData.upiId.trim().toLowerCase(),
          label: formData.label.trim(),
          provider: formData.provider || "OTHER",
          isPrimary: Boolean(formData.isPrimary),
        };
        await onSubmitCreate(payload);
      } else {
        // Edit mode sends mutable properties
        const payload = {
          label: formData.label.trim(),
          provider: formData.provider || "OTHER",
          status: formData.isActive ? "ACTIVE" : "INACTIVE",
          isPrimary: Boolean(formData.isPrimary),
        };
        await onSubmitUpdate(entityId, payload);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(
        typeof err === "string" ? err : "Failed to save Payment QR code."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const isCreate = mode === "create";
  const isEdit = mode === "edit";

  const title = isCreate
    ? "Setup Counter Payment QR"
    : isView
    ? "Payment QR Details"
    : "Modify Payment QR";

  const subtitle = isCreate
    ? "Register a new UPI VPA handle mapped to your corporate settlement account."
    : isView
    ? "Merchant QR display, mapped ledger bank, and POS configuration."
    : "Update display label, provider brand, and checkout preferences.";

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      mobileSheet
      className="w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden"
    >
      {/* ── Dialog Header ── */}
      <UIModalHeader className="px-6 sm:px-8 pt-6 pb-4 border-b border-border/70 shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="size-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
              <QrCode className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <UIModalTitle className="text-xl sm:text-2xl font-bold tracking-tight text-text truncate">
                  {title}
                </UIModalTitle>
                <UIBadge
                  variant={isCreate ? "primary" : isView ? "neutral" : "warning"}
                  size="sm"
                  className="uppercase text-[10px] tracking-wider font-bold"
                >
                  {isCreate ? "New QR" : isView ? "Read Only" : "Edit Mode"}
                </UIBadge>
              </div>
              <UIModalDescription className="text-xs sm:text-sm text-text-muted mt-0.5 line-clamp-1">
                {subtitle}
              </UIModalDescription>
            </div>
          </div>
        </div>
      </UIModalHeader>

      {/* ── Dialog Body ── */}
      <UIModalBody className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 space-y-7">
        {isFetching && (
          <div className="space-y-4 py-8">
            <UISkeleton rows={8} />
          </div>
        )}

        {serverError && !isFetching && (
          <UIAlert variant="error" onDismiss={() => setServerError(null)}>
            {serverError}
          </UIAlert>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            VIEW MODE
           ══════════════════════════════════════════════════════════════════ */}
        {isView && !isFetching && details && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Standee Showcase (Left Col) */}
            <div className="lg:col-span-5 flex justify-center">
              <CountertopUpiStandee
                upiId={details.upiId}
                label={details.label || details.qrName || details.name}
                provider={details.provider}
                isPrimary={details.isPrimary}
                bankAccount={details.bankAccountId || details.bankAccount}
              />
            </div>

            {/* Information Cards (Right Col) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Top 3 Metric Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="bg-surface rounded-2xl border border-border p-3.5 shadow-2xs">
                  <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                    Role
                  </div>
                  <div className="text-xs font-bold text-text mt-1 truncate">
                    {details.isPrimary ? "Primary POS QR" : "Secondary QR"}
                  </div>
                </div>

                <div className="bg-surface rounded-2xl border border-border p-3.5 shadow-2xs">
                  <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                    Status
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`size-2 rounded-full ${
                        details.status !== "INACTIVE" && details.isActive !== false
                          ? "bg-emerald-500"
                          : "bg-neutral-400"
                      }`}
                    />
                    <span className="text-xs font-bold text-text">
                      {details.status !== "INACTIVE" && details.isActive !== false
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="bg-surface rounded-2xl border border-border p-3.5 shadow-2xs">
                  <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                    Provider
                  </div>
                  <div className="text-xs font-bold text-primary mt-1 truncate">
                    {details.provider || "Standard UPI"}
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown Card */}
              <div className="bg-surface rounded-2xl border border-border p-5 space-y-3.5 shadow-2xs text-xs sm:text-sm">
                <div className="flex items-center gap-2 pb-2.5 border-b border-border/80">
                  <CreditCard className="size-4 text-primary" />
                  <h4 className="text-xs font-bold text-text uppercase tracking-wider">
                    UPI Configuration Details
                  </h4>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-text-muted">Display Label</span>
                  <span className="font-semibold text-text">
                    {details.label || details.qrName || details.name || "Billing Counter"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-text-muted">UPI ID / VPA</span>
                  <span className="font-mono font-bold text-text">{details.upiId}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-text-muted">Mapped Bank Account</span>
                  <span className="font-semibold text-text truncate max-w-[220px]">
                    {details.bankAccountId?.accountName ||
                      details.bankAccount?.accountName ||
                      "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-text-muted">Settlement Account No</span>
                  <span className="font-mono font-bold text-text">
                    {details.bankAccountId?.accountNumber ||
                      details.bankAccount?.accountNumber ||
                      "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-text-muted">Registered On</span>
                  <span className="font-semibold text-text">
                    {details.createdAt
                      ? new Date(details.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            CREATE / EDIT MODE
           ══════════════════════════════════════════════════════════════════ */}
        {!isView && !isFetching && (
          <form id="payment-qr-form" onSubmit={handleSubmit} className="space-y-7">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column: Live Interactive Standee Preview */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2.5 flex items-center gap-1.5 self-center">
                  <Sparkles className="size-3.5 text-primary" />
                  Live Counter Standee Preview
                </div>
                <CountertopUpiStandee
                  upiId={formData.upiId}
                  label={formData.label}
                  provider={formData.provider}
                  isPrimary={formData.isPrimary}
                  bankAccount={selectedBankAccount}
                />
              </div>

              {/* Right Column: Spacious Form Cards */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. UPI Identity & Provider */}
                <div className="bg-surface-alt/40 dark:bg-surface-alt/20 rounded-2xl border border-border/80 p-5 sm:p-6 space-y-5 shadow-2xs">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/80">
                    <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Smartphone className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text uppercase tracking-wider">
                        UPI Handle & Branding
                      </h3>
                      <p className="text-xs text-text-muted">
                        Virtual payment address and payment provider classification
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4.5">
                    {/* UPI ID / VPA */}
                    <div className="space-y-1.5">
                      <UIInput
                        label="UPI ID / VPA Handle"
                        placeholder="e.g. pharmacy@okaxis, billing@hdfcbank"
                        value={formData.upiId}
                        onChange={(e) =>
                          handleFieldChange("upiId", e.target.value.toLowerCase().trim())
                        }
                        error={Boolean(formErrors.upiId)}
                        helperText={
                          formErrors.upiId ||
                          (isEdit
                            ? "UPI handle is fixed once registered"
                            : "Virtual Payment Address registered with your bank/UPI app")
                        }
                        startIcon={
                          isEdit ? (
                            <Lock className="size-4 text-amber-500" />
                          ) : (
                            <AtSign className="size-4 text-text-muted" />
                          )
                        }
                        disabled={isEdit}
                        required
                        size="md"
                      />
                    </div>

                    {/* QR Label / Name */}
                    <div className="space-y-1.5">
                      <UIInput
                        label="QR Label / Counter Name"
                        placeholder="e.g. Main Counter QR, Express Billing Desk"
                        value={formData.label}
                        onChange={(e) => handleFieldChange("label", e.target.value)}
                        error={Boolean(formErrors.label)}
                        helperText={
                          formErrors.label ||
                          "Friendly title shown on POS cashier screens and receipts"
                        }
                        startIcon={<Tag className="size-4 text-text-muted" />}
                        required
                        size="md"
                      />
                    </div>

                    {/* Provider Select */}
                    <div className="space-y-1.5">
                      <UISelect
                        label="UPI Provider / Gateway Brand"
                        value={formData.provider}
                        onChange={(val) => handleFieldChange("provider", val)}
                        options={PROVIDER_OPTIONS}
                        size="md"
                        helperText="Brand styling displayed on the checkout QR screen"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Bank Account Settlement Mapping */}
                <div className="bg-surface-alt/40 dark:bg-surface-alt/20 rounded-2xl border border-border/80 p-5 sm:p-6 space-y-4 shadow-2xs">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/80">
                    <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Landmark className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text uppercase tracking-wider">
                        Settlement Bank Account
                      </h3>
                      <p className="text-xs text-text-muted">
                        Target corporate account where funds settle
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <UISelect
                      label="Linked Settlement Bank Account"
                      placeholder="Select bank account..."
                      value={formData.bankAccountId}
                      onChange={(val) => handleFieldChange("bankAccountId", val)}
                      options={bankOptions}
                      error={Boolean(formErrors.bankAccountId)}
                      helperText={
                        formErrors.bankAccountId ||
                        (isEdit
                          ? "Bank settlement account cannot be changed after registration"
                          : "Customer UPI transfers settle directly into this account")
                      }
                      isSearchable
                      disabled={isEdit}
                      required
                      size="md"
                    />

                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface border border-border/80 text-xs text-text-muted">
                      <Info className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        Each UPI VPA is verified against an active corporate bank account
                        registered in your Treasury ledger.
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Operational Controls & POS Status */}
                <div className="bg-surface-alt/40 dark:bg-surface-alt/20 rounded-2xl border border-border/80 p-5 sm:p-6 space-y-4 shadow-2xs">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/80">
                    <div className="size-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Layers className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text uppercase tracking-wider">
                        POS Checkout Controls
                      </h3>
                      <p className="text-xs text-text-muted">
                        Default display behavior across cash register and billing screens
                      </p>
                    </div>
                  </div>

                  {/* Primary Default QR Card */}
                  <div className="rounded-xl border border-border bg-surface p-4 flex items-start gap-3.5 transition-all">
                    <div className="pt-0.5">
                      <UICheckbox
                        id="is-primary-qr-checkbox"
                        checked={formData.isPrimary}
                        onChange={(checked) => handleFieldChange("isPrimary", checked)}
                        color="primary"
                        size="lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor="is-primary-qr-checkbox"
                        className="text-sm font-bold text-text flex items-center gap-2 cursor-pointer select-none"
                      >
                        <span>Set as Default Primary POS QR</span>
                        {formData.isPrimary && (
                          <UIBadge variant="success" size="sm">
                            Default
                          </UIBadge>
                        )}
                      </label>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">
                        The primary QR automatically renders on the POS checkout modal
                        whenever a cashier chooses UPI payment.
                      </p>
                    </div>
                  </div>

                  {/* Active Status Card (Edit Mode) */}
                  {isEdit && (
                    <div className="rounded-xl border border-border bg-surface p-4 flex items-start gap-3.5 transition-all">
                      <div className="pt-0.5">
                        <UICheckbox
                          id="is-active-qr-checkbox"
                          checked={formData.isActive}
                          onChange={(checked) => handleFieldChange("isActive", checked)}
                          color="primary"
                          size="lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor="is-active-qr-checkbox"
                          className="text-sm font-bold text-text flex items-center gap-2 cursor-pointer select-none"
                        >
                          <span>Active QR Status</span>
                          <UIBadge
                            variant={formData.isActive ? "success" : "neutral"}
                            size="sm"
                          >
                            {formData.isActive ? "Active" : "Inactive"}
                          </UIBadge>
                        </label>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed">
                          Inactive QR codes are hidden from checkout counter selections.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        )}
      </UIModalBody>

      {/* ── Dialog Footer ── */}
      <UIModalFooter className="px-6 sm:px-8 py-4.5 bg-surface-alt/60 border-t border-border shrink-0 flex items-center justify-between">
        <div className="text-xs text-text-muted hidden sm:block">
          {!isView && (
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              Real-time UPI standard QR generated per NPCI specifications
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <UIButton
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            size="md"
            className="min-w-[100px]"
          >
            {isView ? "Close" : "Cancel"}
          </UIButton>

          {!isView && (
            <UIButton
              variant="primary"
              type="submit"
              form="payment-qr-form"
              isLoading={isSubmitting}
              size="md"
              className="min-w-[140px] shadow-sm"
              icon={isCreate ? <CheckCircle2 className="size-4" /> : undefined}
            >
              {isCreate ? "Setup QR Code" : "Save Changes"}
            </UIButton>
          )}
        </div>
      </UIModalFooter>
    </UIModal>
  );
}

export default PaymentQrDialog;
