// src/features/settings/components/tabs/BillingTab.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Plus, CreditCard, ArrowUpDown, CheckCircle2 } from "lucide-react";

import { ROUTES } from "@/constants";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useUser from "@/features/user/hooks/useUser";
import useSubscription from "@/features/subscription/subscriptions/hooks/useSubscription";
import {
  UIButton,
  UIInput,
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UICard,
  UICardHeader,
  UICardTitle,
  UICardDescription,
  UICardContent,
  UIAlert,
  UIConfirmDialog,
  PermissionGate,
} from "@/components/ui";

const INITIAL_CARDS = [
  {
    id: "card-1",
    brand: "visa",
    last4: "4291",
    expiry: "09 / 2028",
    isDefault: true,
    type: "Default",
  },
  {
    id: "card-2",
    brand: "mastercard",
    last4: "8830",
    expiry: "03 / 2027",
    isDefault: false,
    type: "backup",
  },
];

const INITIAL_INVOICES = [
  {
    id: "inv-1",
    date: "Jul 6, 2026",
    number: "INV-2026-0712",
    amount: "$79.00",
    status: "Paid",
  },
  {
    id: "inv-2",
    date: "Jun 6, 2026",
    number: "INV-2026-0610",
    amount: "$79.00",
    status: "Paid",
  },
];

const BillingTab = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const { user } = useUser();
  const {
    currentWorkspaceSubscription,
    getWorkspaceCurrentSubscription,
    cancelSubscription,
  } = useSubscription();

  const [cards, setCards] = useState(INITIAL_CARDS);
  const [invoices] = useState(INITIAL_INVOICES);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [billingEmail, setBillingEmail] = useState(user?.email || "billing@example.com");
  const [newEmailInput, setNewEmailInput] = useState(billingEmail);
  const [statusMessage, setStatusMessage] = useState("");

  // Sync email when user loads
  useEffect(() => {
    if (user?.email) {
      setBillingEmail(user.email);
      setNewEmailInput(user.email);
    }
  }, [user]);

  // Fetch current workspace subscription on load
  useEffect(() => {
    if (currentWorkspace?._id) {
      getWorkspaceCurrentSubscription(currentWorkspace._id).catch(() => null);
    }
  }, [currentWorkspace, getWorkspaceCurrentSubscription]);

  // New card form state
  const [newCardData, setNewCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });

  const handleMakeDefault = (cardId) => {
    setCards((prev) =>
      prev.map((c) => ({
        ...c,
        isDefault: c.id === cardId,
        type: c.id === cardId ? "Default" : "backup",
      }))
    );
  };

  const handleRemoveCard = (cardId) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    const last4 = newCardData.cardNumber.replace(/\s/g, "").slice(-4) || "1234";
    const newCard = {
      id: `card-${Date.now()}`,
      brand: "visa",
      last4,
      expiry: newCardData.expiry || "12 / 2029",
      isDefault: cards.length === 0,
      type: cards.length === 0 ? "Default" : "backup",
    };
    setCards((prev) => [...prev, newCard]);
    setNewCardData({ cardNumber: "", cardHolder: "", expiry: "", cvv: "" });
    setShowAddCardModal(false);
    setStatusMessage("Payment card added successfully.");
    setTimeout(() => setStatusMessage(""), 3500);
  };

  const handleSaveBillingEmail = (e) => {
    e.preventDefault();
    if (newEmailInput.trim()) {
      setBillingEmail(newEmailInput.trim());
      setShowChangeEmailModal(false);
      setStatusMessage("Billing email address updated.");
      setTimeout(() => setStatusMessage(""), 3500);
    }
  };

  const handleCancelPlan = async () => {
    if (!currentWorkspaceSubscription?._id) {
      setShowCancelModal(false);
      return;
    }
    setIsCancelling(true);
    try {
      await cancelSubscription({ subscriptionId: currentWorkspaceSubscription._id });
      setStatusMessage("Subscription cancellation scheduled at end of period.");
      setTimeout(() => setStatusMessage(""), 3500);
    } catch (err) {
      console.error("Cancel plan failed:", err);
    } finally {
      setIsCancelling(false);
      setShowCancelModal(false);
    }
  };

  const planName = currentWorkspaceSubscription?.plan?.name || "Professional Tier";
  const planPrice = currentWorkspaceSubscription?.plan?.price
    ? `$${currentWorkspaceSubscription.plan.price}`
    : "$79";
  const planInterval = currentWorkspaceSubscription?.plan?.billingInterval || "monthly";
  const planStatus = currentWorkspaceSubscription?.status || "active";
  const renewalDate = currentWorkspaceSubscription?.currentPeriodEnd
    ? new Date(currentWorkspaceSubscription.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Next Billing Cycle";

  const billedToName = user?.fullName || user?.name || "Workspace Administrator";
  const workspaceTitle = currentWorkspace?.name || "PharmaERP Business";

  return (
    <div className="space-y-4">
      {statusMessage && (
        <UIAlert type="success" variant="soft" className="p-3 rounded-[10px] text-xs">
          {statusMessage}
        </UIAlert>
      )}

      {/* ── CARD 1: Your Plan ─────────────────────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60 mb-0">
          <div>
            <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
              Your plan
            </UICardTitle>
            <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
              Manage your subscription tier, billing period, and seat limits
            </UICardDescription>
          </div>
          <PermissionGate permission="subscription:update">
            <div className="flex items-center gap-2 shrink-0">
              <UIButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.UPGRADE_PLAN)}
              >
                Change plan
              </UIButton>
              <UIButton
                type="button"
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.UPGRADE_PLAN)}
              >
                Upgrade
              </UIButton>
            </div>
          </PermissionGate>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-text">
                {planName}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-success capitalize">
                <span className="size-1.5 rounded-full bg-success" />
                {planStatus}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-text-muted">
              <strong className="font-semibold text-text tabular-nums">
                {planPrice} per {planInterval}
              </strong>{" "}
              · billed {planInterval}
            </p>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Calendar size={13} className="text-text-muted" />
              <span>
                Renews on{" "}
                <strong className="font-semibold text-text">
                  {renewalDate}
                </strong>{" "}
                — usage resets the same day.
              </span>
            </div>

            <PermissionGate permission="subscription:update">
              <UIButton
                type="button"
                variant="link"
                size="sm"
                onClick={() => setShowCancelModal(true)}
                className="text-xs text-text-muted hover:text-error"
              >
                Cancel plan
              </UIButton>
            </PermissionGate>
          </div>
        </UICardContent>
      </UICard>

      {/* ── CARD 2: Payment Method ────────────────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="pb-3 border-b border-border/60 mb-0">
          <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
            Payment method
          </UICardTitle>
          <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
            Charged automatically at the start of each billing cycle
          </UICardDescription>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          {/* Saved Cards List */}
          <div className="divide-y divide-border/60">
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between py-2.5 first:pt-0 last:pb-2.5"
              >
                <div className="flex items-center gap-3">
                  {/* Card Icon/Badge */}
                  {card.brand === "visa" ? (
                    <div className="flex h-6.5 w-10 items-center justify-center rounded-[5px] bg-slate-900 text-[9px] font-black tracking-wider text-white shadow-2xs">
                      VISA
                    </div>
                  ) : (
                    <div className="relative flex h-6.5 w-10 items-center justify-center overflow-hidden rounded-[5px] border border-border bg-surface">
                      <div className="size-3.5 -mr-1.5 rounded-full bg-red-500 opacity-90" />
                      <div className="size-3.5 -ml-1.5 rounded-full bg-amber-400 opacity-90" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold tracking-wider text-text font-mono tabular-nums">
                        •••• •••• •••• {card.last4}
                      </span>
                      {card.isDefault && (
                        <span className="rounded-full bg-primary-soft px-1.5 py-0.2 text-[10px] font-semibold text-primary">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted tabular-nums">
                      Expires {card.expiry} {card.type === "backup" ? "· backup" : ""}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 text-xs">
                  {!card.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleMakeDefault(card.id)}
                      className="font-medium text-primary hover:text-primary-hover hover:underline cursor-pointer"
                    >
                      Make default
                    </button>
                  )}
                  {!card.isDefault ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(card.id)}
                      className="font-medium text-text-muted hover:text-error cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAddCardModal(true)}
                      className="font-medium text-text-muted hover:text-text cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Payment Method trigger */}
          <PermissionGate permission="subscription:update">
            <div className="pt-1.5">
              <UIButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAddCardModal(true)}
                startIcon={<Plus size={13} />}
                className="text-primary hover:text-primary-hover font-semibold px-0 h-auto"
              >
                Add payment method
              </UIButton>
            </div>
          </PermissionGate>

          {/* Billed To & Billing Email 2-Column Row */}
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-border/60 pt-3.5 sm:grid-cols-2">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">
                Billed To
              </span>
              <p className="mt-0.5 text-xs font-bold text-text">
                {billedToName}
              </p>
              <p className="text-xs text-text-muted">
                {workspaceTitle}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">
                  Billing Email
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setNewEmailInput(billingEmail);
                    setShowChangeEmailModal(true);
                  }}
                  className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>
              <p className="mt-0.5 text-xs font-bold text-text">
                {billingEmail}
              </p>
              <p className="text-xs text-text-muted">
                Invoices and receipts are sent here
              </p>
            </div>
          </div>
        </UICardContent>
      </UICard>

      {/* ── CARD 3: Billing History ───────────────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60 mb-0">
          <div>
            <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
              Billing history
            </UICardTitle>
            <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
              Download invoices and tax receipts for your account accounting records
            </UICardDescription>
          </div>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div className="divide-y divide-border/60">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text font-mono">
                      {inv.number}
                    </span>
                    <span className="rounded-full bg-success-soft px-1.5 py-0.2 text-[10px] font-semibold text-success">
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted">
                    {inv.date} · <span className="tabular-nums font-semibold text-text">{inv.amount}</span>
                  </p>
                </div>

                <UIButton
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-7.5 px-2.5 font-medium"
                >
                  Download PDF
                </UIButton>
              </div>
            ))}
          </div>
        </UICardContent>
      </UICard>

      {/* ── Add Card Modal ────────────────────────────────────── */}
      <UIModal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        size="md"
      >
        <UIModalHeader>
          <UIModalTitle>Add Payment Method</UIModalTitle>
          <UIModalDescription>
            Add a new credit or debit card for subscription billing.
          </UIModalDescription>
        </UIModalHeader>
        <form onSubmit={handleAddCardSubmit}>
          <UIModalBody className="space-y-3.5">
            <UIInput
              id="card-holder"
              name="cardHolder"
              label="Cardholder Name"
              placeholder="Full name as printed on card"
              value={newCardData.cardHolder}
              onChange={(e) =>
                setNewCardData((prev) => ({ ...prev, cardHolder: e.target.value }))
              }
              required
            />
            <UIInput
              id="card-number"
              name="cardNumber"
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={newCardData.cardNumber}
              onChange={(e) =>
                setNewCardData((prev) => ({ ...prev, cardNumber: e.target.value }))
              }
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <UIInput
                id="card-expiry"
                name="expiry"
                label="Expires"
                placeholder="MM / YY"
                value={newCardData.expiry}
                onChange={(e) =>
                  setNewCardData((prev) => ({ ...prev, expiry: e.target.value }))
                }
                required
              />
              <UIInput
                id="card-cvv"
                name="cvv"
                label="CVC / CVV"
                placeholder="123"
                value={newCardData.cvv}
                onChange={(e) =>
                  setNewCardData((prev) => ({ ...prev, cvv: e.target.value }))
                }
                required
              />
            </div>
          </UIModalBody>
          <UIModalFooter>
            <UIButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddCardModal(false)}
            >
              Cancel
            </UIButton>
            <UIButton type="submit" variant="primary" size="sm">
              Save card
            </UIButton>
          </UIModalFooter>
        </form>
      </UIModal>

      {/* ── Change Billing Email Modal ────────────────────────── */}
      <UIModal
        isOpen={showChangeEmailModal}
        onClose={() => setShowChangeEmailModal(false)}
        size="sm"
      >
        <UIModalHeader>
          <UIModalTitle>Change Billing Email</UIModalTitle>
          <UIModalDescription>
            Where receipts and invoices should be delivered.
          </UIModalDescription>
        </UIModalHeader>
        <form onSubmit={handleSaveBillingEmail}>
          <UIModalBody>
            <UIInput
              id="billing-email-input"
              name="billingEmail"
              type="email"
              label="Email Address"
              value={newEmailInput}
              onChange={(e) => setNewEmailInput(e.target.value)}
              placeholder="accounting@company.com"
              required
            />
          </UIModalBody>
          <UIModalFooter>
            <UIButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowChangeEmailModal(false)}
            >
              Cancel
            </UIButton>
            <UIButton type="submit" variant="primary" size="sm">
              Update Email
            </UIButton>
          </UIModalFooter>
        </form>
      </UIModal>

      {/* ── Cancel Plan Dialog ────────────────────────────────── */}
      <UIConfirmDialog
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelPlan}
        title="Cancel Subscription"
        description="Are you sure you want to cancel your subscription? Your access will continue until the end of your current billing period."
        intent="danger"
        confirmText="Confirm Cancellation"
        cancelText="Keep Subscription"
        isLoading={isCancelling}
      />
    </div>
  );
};

export default BillingTab;
