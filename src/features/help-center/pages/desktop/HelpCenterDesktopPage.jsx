// src/features/help-center/pages/desktop/HelpCenterDesktopPage.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  HelpCircle,
  Sparkles,
  ShoppingCart,
  Package,
  Receipt,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  BookOpen,
  Phone,
  Mail,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import {
  UICard,
  UIButton,
  UIBadge,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { HELP_CATEGORIES, HELP_FAQS } from "../../constants/helpCenterData";
import { SubmitTicketModal } from "../../components/SubmitTicketModal";

const categoryIconMap = {
  Sparkles: <Sparkles className="size-6 text-primary" />,
  ShoppingCart: <ShoppingCart className="size-6 text-primary" />,
  Package: <Package className="size-6 text-primary" />,
  Receipt: <Receipt className="size-6 text-primary" />,
  Truck: <Truck className="size-6 text-primary" />,
  ShieldCheck: <ShieldCheck className="size-6 text-primary" />,
};

export const HelpCenterDesktopPage = () => {
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
    setToastMessage(`✅ Support ticket ${ticket.ticketNo} submitted successfully.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <section className="min-h-[100dvh] w-full bg-bg px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Toast */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 right-8 z-50 flex items-center gap-2.5 rounded-2xl border border-primary/30 bg-surface/95 px-4 py-3 text-sm font-semibold text-text shadow-xl backdrop-blur-md"
        >
          <CheckCircle2 className="size-5 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Search Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-surface border border-border p-8 sm:p-12 text-center shadow-xs">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              <span>PharmaERP Knowledge Base & Help</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
              How can we assist your pharmacy today?
            </h1>
            <p className="text-sm sm:text-base text-text-muted">
              Find answers, follow step-by-step guides, or contact technical specialists.
            </p>

            <div className="relative max-w-xl mx-auto pt-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tutorials, GST rules, POS workflows, barcode setups..."
                className="w-full rounded-2xl border border-border bg-surface-alt/70 pl-12 pr-4 py-3.5 text-sm text-text placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Category Knowledge Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-text">Explore Guides by Topic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HELP_CATEGORIES.map((cat) => (
              <UICard
                key={cat.id}
                variant="default"
                className="p-5 rounded-2xl bg-surface border-border shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="size-12 rounded-xl bg-primary-soft border border-primary/20 flex items-center justify-center">
                    {categoryIconMap[cat.iconName]}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-text group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{cat.desc}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between text-xs text-text-muted">
                  <span>{cat.articleCount} articles</span>
                  <span className="text-primary font-semibold group-hover:underline flex items-center gap-1">
                    Read guides <ExternalLink className="size-3" />
                  </span>
                </div>
              </UICard>
            ))}
          </div>
        </div>

        {/* FAQs & Direct Support Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* FAQ Accordion (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-xl font-bold text-text">Frequently Asked Questions</h2>

            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = expandedFaq === faq.id;

                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-border bg-surface shadow-2xs overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-text hover:text-primary transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="size-4 shrink-0 text-primary" />
                      ) : (
                        <ChevronDown className="size-4 shrink-0 text-text-muted" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-text-muted leading-relaxed border-t border-border/60 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Support Card (4 Cols) */}
          <div className="lg:col-span-4">
            <UICard variant="default" className="p-6 rounded-2xl bg-surface border-border shadow-xs space-y-5">
              <div>
                <div className="size-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-3">
                  <MessageSquare className="size-5" />
                </div>
                <h3 className="text-base font-bold text-text">Need Immediate Support?</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Our healthcare software engineers are available to resolve issues, set up hardware, or troubleshoot data.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-border/70 text-xs">
                <div className="flex items-center gap-2.5 text-text">
                  <Phone className="size-4 text-primary" />
                  <span className="font-mono font-bold">+91 (022) 8800-4400</span>
                </div>
                <div className="flex items-center gap-2.5 text-text">
                  <Mail className="size-4 text-primary" />
                  <span>support@pharmaerp.internal</span>
                </div>
              </div>

              <UIButton
                variant="primary"
                size="md"
                className="w-full justify-center text-xs font-bold"
                onClick={() => setIsTicketOpen(true)}
              >
                Raise Support Ticket
              </UIButton>
            </UICard>
          </div>
        </div>
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

export default HelpCenterDesktopPage;
