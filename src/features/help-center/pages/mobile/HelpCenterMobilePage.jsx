// src/features/help-center/pages/mobile/HelpCenterMobilePage.jsx

import React, { useState } from "react";
import {
  Search,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Phone,
  CheckCircle2,
} from "lucide-react";
import {
  UICard,
  UIButton,
} from "@/components/ui";
import { HELP_CATEGORIES, HELP_FAQS } from "../../constants/helpCenterData";
import { SubmitTicketModal } from "../../components/SubmitTicketModal";

export const HelpCenterMobilePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState("faq-1");
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const filteredFaqs = HELP_FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmitted = (ticket) => {
    setToastMessage(`✅ Ticket ${ticket.ticketNo} logged.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <section className="min-h-[100dvh] w-full bg-bg px-3.5 pt-3 pb-24 font-sans space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-surface/95 p-3 text-xs font-semibold text-text shadow-xl backdrop-blur-md">
          <CheckCircle2 className="size-4 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-extrabold text-text tracking-tight">Help & Knowledge Base</h1>
        <p className="text-xs text-text-muted">Guides and support for your pharmacy team</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search guides & FAQs..."
          className="w-full rounded-xl border border-border bg-surface-alt/70 pl-9 pr-3 py-2 text-xs text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
        />
      </div>

      {/* Topics Grid */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Browse Categories
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {HELP_CATEGORIES.slice(0, 4).map((cat) => (
            <div
              key={cat.id}
              className="p-3 rounded-xl border border-border bg-surface shadow-2xs space-y-1"
            >
              <p className="font-bold text-xs text-text truncate">{cat.title}</p>
              <p className="text-[11px] text-text-muted">{cat.articleCount} articles</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Common Questions
        </h2>
        <div className="space-y-2">
          {filteredFaqs.map((faq) => {
            const isOpen = expandedFaq === faq.id;

            return (
              <div
                key={faq.id}
                className="rounded-xl border border-border bg-surface shadow-2xs overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                  className="w-full p-3 text-left flex items-center justify-between gap-2 font-bold text-xs text-text"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="size-3.5 shrink-0 text-primary" />
                  ) : (
                    <ChevronDown className="size-3.5 shrink-0 text-text-muted" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-3 pb-3 text-xs text-text-muted leading-relaxed border-t border-border/60 pt-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Contact Button */}
      <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-primary" />
          <h3 className="text-xs font-bold text-text">Direct Pharmacy Support</h3>
        </div>
        <p className="text-xs text-text-muted">
          Have an urgent question? Open a ticket with our support engineers.
        </p>
        <UIButton
          variant="primary"
          size="sm"
          className="w-full justify-center text-xs"
          onClick={() => setIsTicketOpen(true)}
        >
          Submit Support Ticket
        </UIButton>
      </div>

      {/* Ticket Modal */}
      <SubmitTicketModal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        onSubmitted={handleTicketSubmitted}
      />
    </section>
  );
};

export default HelpCenterMobilePage;
