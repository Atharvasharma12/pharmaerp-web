// src/features/help-center/components/SubmitTicketModal.jsx

import React, { useState } from "react";
import {
  HelpCircle,
  Send,
  CheckCircle2,
  Paperclip,
} from "lucide-react";
import { UIModal, UIButton } from "@/components/ui";

export const SubmitTicketModal = ({ isOpen, onClose, onSubmitted }) => {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("pos-billing");
  const [priority, setPriority] = useState("Normal");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitted({
        ticketNo: `TICK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        subject,
        category,
        priority,
      });
      onClose();
    }, 800);
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={handleSubmit} className="p-6 font-sans space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
              <HelpCircle className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">Contact Support Desk</h2>
              <p className="text-xs text-text-muted">Our technical specialists respond within 2 hours</p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text">Issue Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Question regarding GST report export"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs text-text focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs font-medium text-text focus:border-primary focus:outline-none"
              >
                <option value="pos-billing">POS & Billing</option>
                <option value="inventory">Inventory & Expiry</option>
                <option value="gst">GST & Invoicing</option>
                <option value="access">User Permissions</option>
                <option value="hardware">Thermal Printer / Scanner</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs font-medium text-text focus:border-primary focus:outline-none"
              >
                <option value="Low">Low - Question</option>
                <option value="Normal">Normal - Request</option>
                <option value="Urgent">Urgent - Operations Blocked</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text">Detailed Description</label>
            <textarea
              rows={4}
              required
              placeholder="Please describe the steps or issue in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs text-text focus:border-primary focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <UIButton type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </UIButton>

          <UIButton
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            leftIcon={<Send className="size-3.5" />}
          >
            {isSubmitting ? "Submitting..." : "Send Request"}
          </UIButton>
        </div>
      </form>
    </UIModal>
  );
};

export default SubmitTicketModal;
