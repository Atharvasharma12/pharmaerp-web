// src/features/help-center/pages/mobile/HelpCenterMobilePage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MessageSquare,
  Phone,
  CheckCircle2,
  X,
  BookOpen,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { HELP_CATEGORIES, HELP_FAQS } from "../../constants/helpCenterData";
import { SubmitTicketModal } from "../../components/SubmitTicketModal";

export const HelpCenterMobilePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState("faq-1");
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const filteredFaqs = HELP_FAQS.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? faq.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleTicketSubmitted = (ticket) => {
    setToastMessage(`✅ Ticket ${ticket.ticketNo} logged.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <section className="min-h-[calc(100vh-56px)] w-full bg-bg px-3.5 pt-3 pb-24 font-sans space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 z-[9999] flex items-center gap-2 rounded-xl border border-primary/30 bg-surface/95 p-3 text-xs font-semibold text-text shadow-xl backdrop-blur-md">
          <CheckCircle2 className="size-4 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Knowledge & Help
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 border border-success/20 px-2 py-0.5 text-[10px] font-semibold text-success">
            Live Support
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-text">
          Help Center
        </h1>
        <p className="text-xs text-text-muted">
          Guides, FAQs, and engineering support for your pharmacy.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search guides, GST, POS billing..."
          className="w-full rounded-xl border border-border bg-surface pl-9 pr-8 py-2.5 text-xs text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-1 cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Topics Horizontal Scroll / Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Browse Categories
          </h2>
          {selectedCategory && (
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {HELP_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : cat.id)
                }
                className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-surface active:bg-surface-alt"
                }`}
              >
                <p className="font-bold text-xs text-text truncate">{cat.title}</p>
                <p className="text-[10px] text-text-muted">{cat.articleCount} articles</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Common Questions ({filteredFaqs.length})
          </h2>
        </div>

        <div className="space-y-2">
          {filteredFaqs.map((faq) => {
            const isOpen = expandedFaq === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-xl border bg-surface shadow-2xs overflow-hidden transition-colors ${
                  isOpen ? "border-primary/40" : "border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                  className="w-full p-3 text-left flex items-center justify-between gap-2 font-bold text-xs text-text cursor-pointer"
                >
                  <span className="leading-snug">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="size-3.5 shrink-0 text-primary" />
                  ) : (
                    <ChevronDown className="size-3.5 shrink-0 text-text-muted" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-3 pb-3 text-[11px] text-text-muted leading-relaxed border-t border-border/60 pt-2.5 bg-surface-alt/30">
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
          <h3 className="text-xs font-bold text-text">Direct Support Desk</h3>
        </div>
        <p className="text-[11px] text-text-muted">
          Have an urgent question? Open a ticket or contact our pharmacy engineers.
        </p>
        <button
          type="button"
          onClick={() => setIsTicketOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Submit Support Ticket</span>
          <ChevronRight className="size-3.5 text-white" />
        </button>
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
