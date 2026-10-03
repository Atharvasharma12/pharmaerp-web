// src/features/help-center/pages/desktop/HelpCenterDesktopPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  MessageSquare,
  BookOpen,
  Phone,
  Mail,
  CheckCircle2,
  ExternalLink,
  LifeBuoy,
  X,
  MessageCircle,
} from "lucide-react";
import { ROUTES } from "@/constants";
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
    setToastMessage(`✅ Support ticket ${ticket.ticketNo} submitted successfully.`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <section className="min-h-[calc(100vh-58px)] w-full bg-bg px-6 py-7 font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-8 z-[9999] flex items-center gap-2.5 rounded-2xl border border-primary/30 bg-surface/95 px-5 py-3.5 text-sm font-semibold text-text shadow-xl backdrop-blur-md"
          >
            <CheckCircle2 className="size-5 text-primary shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-7">
        {/* ── 1. Breadcrumbs & Header ─────────────────────────────────────── */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
              <button
                type="button"
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <ChevronRight className="size-3.5 text-text-muted/60" />
              <span className="text-text font-bold">Help & Support</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
                Help Center & Knowledge Base
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <LifeBuoy className="size-3.5" />
                Live Support
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsTicketOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4.5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer self-start md:self-auto"
          >
            <MessageSquare className="size-4 text-white" />
            <span>Open Support Ticket</span>
          </button>
        </div>

        {/* ── 2. Hero Search Banner ───────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface via-surface to-primary/5 border border-border p-8 sm:p-10 text-center shadow-xs">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              <span>Pharmaceutical ERP Knowledge & Tutorials</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              How can we assist your pharmacy today?
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Search answers for GST tax rates, barcode scanner configuration, batch expiry tracking, and cashier roles.
            </p>

            <div className="relative max-w-xl mx-auto pt-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tutorials, GST rules, POS billing, barcode printers..."
                className="w-full rounded-2xl border border-border bg-surface pl-11 pr-10 py-3.5 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-1 cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 3. Category Knowledge Cards ─────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text flex items-center gap-2">
              <BookOpen className="size-4.5 text-primary" />
              <span>Explore Guides by Topic</span>
            </h3>
            {selectedCategory && (
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                <span>Clear Category Filter</span>
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {HELP_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() =>
                    setSelectedCategory(isSelected ? null : cat.id)
                  }
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer shadow-xs ${isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                      : "border-border bg-surface hover:border-primary/40 hover:shadow-md"
                    }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                        {categoryIconMap[cat.iconName]}
                      </div>

                      {isSelected && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary text-white text-[10px] font-bold px-2 py-0.5">
                          Active Filter
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-text group-hover:text-primary transition-colors">
                        {cat.title}
                      </h4>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between text-xs text-text-muted">
                    <span className="font-medium">{cat.articleCount} articles</span>
                    <span className="text-primary font-semibold group-hover:underline flex items-center gap-1">
                      <span>View FAQs</span>
                      <ChevronRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 4. FAQs & Direct Support Split Layout ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* FAQ Accordion (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-text flex items-center gap-2">
                <HelpCircle className="size-4.5 text-primary" />
                <span>Frequently Asked Questions</span>
              </h3>
              <span className="text-xs text-text-muted font-medium">
                Showing {filteredFaqs.length} results
              </span>
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center space-y-2">
                <p className="text-sm font-semibold text-text">No matching answers found</p>
                <p className="text-xs text-text-muted">
                  Try adjusting your search terms or raise a ticket directly with our engineering desk.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                  className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  Reset Search & Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isOpen = expandedFaq === faq.id;

                  return (
                    <div
                      key={faq.id}
                      className={`rounded-2xl border bg-surface shadow-xs transition-colors overflow-hidden ${isOpen ? "border-primary/40 shadow-sm" : "border-border hover:border-border/80"
                        }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                        className="w-full p-4.5 text-left flex items-center justify-between gap-4 font-bold text-sm text-text hover:text-primary transition-colors cursor-pointer"
                      >
                        <span className="leading-snug">{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="size-4.5 shrink-0 text-primary" />
                        ) : (
                          <ChevronDown className="size-4.5 shrink-0 text-text-muted" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-4.5 pb-4.5 text-xs text-text-muted leading-relaxed border-t border-border/60 pt-3.5 bg-surface-alt/30">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contact Support Card (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-5">
              <div>
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <MessageSquare className="size-5" />
                </div>
                <h3 className="text-base font-bold text-text">Need Immediate Support?</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Our healthcare software engineers are available to resolve issues, set up hardware, or troubleshoot data.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-border/70 text-xs">
                <div className="flex items-center gap-2.5 text-text font-medium">
                  <Phone className="size-4 text-primary shrink-0" />
                  <span className="font-mono font-bold">+91 (022) 8800-4400</span>
                </div>
                <div className="flex items-center gap-2.5 text-text font-medium">
                  <Mail className="size-4 text-primary shrink-0" />
                  <span>support@pharmaerp.internal</span>
                </div>
                <div className="flex items-center gap-2.5 text-text font-medium">
                  <MessageCircle className="size-4 text-success shrink-0" />
                  <span>WhatsApp Business: +91 98765 43210</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTicketOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Raise Support Ticket</span>
                <ChevronRight className="size-3.5 text-white" />
              </button>
            </div>

            {/* Quick Tips Card */}
            <div className="rounded-2xl border border-border bg-surface-alt/50 p-5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                System Status
              </span>
              <div className="flex items-center gap-2 text-xs font-bold text-success">
                <span className="size-2 rounded-full bg-success animate-pulse" />
                <span>All Pharmacy Cloud Services Operational</span>
              </div>
              <p className="text-[11px] text-text-muted">
                Daily automated cloud backups are active and verified.
              </p>
            </div>
            {/* Version Information Card */}
            <div className="rounded-2xl border border-border bg-surface-alt/50 p-5 space-y-2 mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Application Version
              </span>
              <div className="flex flex-col gap-2 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Semantic Version</span>
                  <span className="font-mono font-bold text-text bg-surface border border-border px-2 py-0.5 rounded">v{__APP_VERSION__}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Last Deployment</span>
                  <span className="font-mono font-bold text-text bg-surface border border-border px-2 py-0.5 rounded">
                    {new Date(__BUILD_TIME__).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1 pt-2 border-t border-border/50">
                  <span className="font-bold text-text">Active Environment</span>
                  <span className="font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded shadow-sm">
                    {__APP_ENV__ === "local" ? "Localhost (Dev)" : `Vercel (${__APP_ENV__})`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Ticket Modal */}
      <SubmitTicketModal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        onSubmitted={handleTicketSubmitted}
      />
    </section>
  );
};

export default HelpCenterDesktopPage;
