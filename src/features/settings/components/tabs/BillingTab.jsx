import { useState } from "react";
import { Calendar, Plus, CreditCard, ArrowUpDown } from "lucide-react";

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
  {
    id: "inv-3",
    date: "May 6, 2026",
    number: "INV-2026-0508",
    amount: "$79.00",
    status: "Paid",
  },
];

const BillingTab = () => {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [invoices] = useState(INITIAL_INVOICES);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [billingEmail, setBillingEmail] = useState("billing@storeadmin.com");
  const [newEmailInput, setNewEmailInput] = useState(billingEmail);

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
  };

  const handleSaveBillingEmail = (e) => {
    e.preventDefault();
    if (newEmailInput.trim()) {
      setBillingEmail(newEmailInput.trim());
      setShowChangeEmailModal(false);
    }
  };

  return (
    <div className="space-y-4">
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
          <div className="flex items-center gap-2 shrink-0">
            <UIButton
              type="button"
              variant="outline"
              size="sm"
            >
              Change plan
            </UIButton>
            <UIButton
              type="button"
              variant="primary"
              size="sm"
            >
              Upgrade
            </UIButton>
          </div>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-text">
                Growth
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-success">
                <span className="size-1.5 rounded-full bg-success" />
                Active
              </span>
            </div>
            <p className="mt-0.5 text-xs text-text-muted">
              <strong className="font-semibold text-text tabular-nums">
                $79 per month
              </strong>{" "}
              · billed monthly
            </p>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Calendar size={13} className="text-text-muted" />
              <span>
                Renews on{" "}
                <strong className="font-semibold text-text">
                  August 12, 2026
                </strong>{" "}
                — usage resets the same day.
              </span>
            </div>

            <UIButton
              type="button"
              variant="link"
              size="sm"
              className="text-xs text-text-muted hover:text-error"
            >
              Cancel plan
            </UIButton>
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

          {/* Billed To & Billing Email 2-Column Row */}
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-border/60 pt-3.5 sm:grid-cols-2">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">
                Billed To
              </span>
              <p className="mt-0.5 text-xs font-bold text-text">
                Anna Schulz
              </p>
              <p className="text-xs text-text-muted">
                Schulz Retail GmbH · Berlin, DE
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

      {/* ── CARD 3: Invoices ──────────────────────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="pb-3 border-b border-border/60 mb-0">
          <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
            Invoices
          </UICardTitle>
          <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
            Download tax receipts and billing transaction records
          </UICardDescription>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 text-[10px] font-bold tracking-wider text-text-muted uppercase">
                  <th className="pb-2.5 font-bold">
                    <div className="flex items-center gap-1">
                      <span>Date</span>
                      <ArrowUpDown size={11} />
                    </div>
                  </th>
                  <th className="pb-2.5 font-bold">Invoice</th>
                  <th className="pb-2.5 font-bold">Amount</th>
                  <th className="pb-2.5 font-bold">
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      <ArrowUpDown size={11} />
                    </div>
                  </th>
                  <th className="pb-2.5 text-right font-bold">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-surface-hover">
                    <td className="py-2.5 font-medium text-text tabular-nums">
                      {inv.date}
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-text-muted tabular-nums">
                      {inv.number}
                    </td>
                    <td className="py-2.5 font-semibold text-text tabular-nums">
                      {inv.amount}
                    </td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success-soft px-2 py-0.5 text-[10px] font-semibold text-success">
                        <span className="size-1 rounded-full bg-success" />
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Downloading receipt for ${inv.number}`)}
                        className="font-bold text-primary hover:text-primary-hover hover:underline cursor-pointer"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 text-primary" />
            <UIModalTitle>Add Payment Method</UIModalTitle>
          </div>
          <UIModalDescription>
            Enter your credit or debit card details for secure billing
          </UIModalDescription>
        </UIModalHeader>

        <form onSubmit={handleAddCardSubmit}>
          <UIModalBody className="space-y-3.5">
            <UIInput
              label="Card Number"
              required
              placeholder="4242 •••• •••• 4242"
              value={newCardData.cardNumber}
              onChange={(e) =>
                setNewCardData({ ...newCardData, cardNumber: e.target.value })
              }
            />

            <UIInput
              label="Cardholder Name"
              required
              placeholder="Anna Schulz"
              value={newCardData.cardHolder}
              onChange={(e) =>
                setNewCardData({ ...newCardData, cardHolder: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <UIInput
                label="Expiry (MM/YY)"
                required
                placeholder="08/28"
                value={newCardData.expiry}
                onChange={(e) =>
                  setNewCardData({ ...newCardData, expiry: e.target.value })
                }
              />
              <UIInput
                label="CVC / CVV"
                required
                maxLength={4}
                placeholder="123"
                value={newCardData.cvv}
                onChange={(e) =>
                  setNewCardData({ ...newCardData, cvv: e.target.value })
                }
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
            <UIButton
              type="submit"
              variant="primary"
              size="sm"
            >
              Save Card
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
            Invoices and transaction receipts will be forwarded to this address
          </UIModalDescription>
        </UIModalHeader>

        <form onSubmit={handleSaveBillingEmail}>
          <UIModalBody>
            <UIInput
              type="email"
              label="New Billing Email Address"
              required
              value={newEmailInput}
              onChange={(e) => setNewEmailInput(e.target.value)}
              placeholder="billing@company.com"
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
            <UIButton
              type="submit"
              variant="primary"
              size="sm"
            >
              Save Email
            </UIButton>
          </UIModalFooter>
        </form>
      </UIModal>
    </div>
  );
};

export default BillingTab;
