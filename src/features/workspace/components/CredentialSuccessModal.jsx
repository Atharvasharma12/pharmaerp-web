// src/features/workspace/components/CredentialSuccessModal.jsx

import React, { useState } from "react";
import {
  Check,
  Copy,
  User,
  Lock,
  Phone,
  Mail,
  Shield,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIBadge,
  uiToast,
} from "@/components/ui";

const CredentialSuccessModal = ({
  open,
  onClose,
  credentials,
  workspaceName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!credentials) return null;

  const { fullName, email, phone, password, roleName } = credentials;
  const loginUrl = window.location.origin + "/login";

  const messageText = `🏥 *${workspaceName || "Pharmacy ERP"} - Staff Login Credentials*
👤 *Name:* ${fullName}
📱 *Login ID / Mobile:* ${phone || email}
🔑 *Password:* ${password}
🛡️ *Role:* ${roleName || "Staff"}
🌐 *Login Portal:* ${loginUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    uiToast.success("Credentials Copied", "Staff login details copied to clipboard.");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, "") : "";
    const targetPhone =
      cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(
      messageText,
    )}`;
    window.open(url, "_blank");
  };

  return (
    <UIModal
      isOpen={open}
      onClose={onClose}
      size="md"
      className="max-w-[480px]"
    >
      {/* Header */}
      <UIModalHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-success/15 border border-success/30 flex items-center justify-center text-success shrink-0">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <UIModalTitle className="text-base sm:text-lg">
              Staff Account Activated
            </UIModalTitle>
            <UIModalDescription className="text-xs mt-0.5">
              Direct access credentials have been provisioned for immediate store operations.
            </UIModalDescription>
          </div>
        </div>
      </UIModalHeader>

      {/* Body */}
      <UIModalBody className="space-y-4 py-4 max-h-[70vh]">
        {/* Success Banner */}
        <div className="rounded-xl bg-success-soft/70 border border-success/30 p-3 text-center">
          <span className="text-xs font-bold text-success uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Sparkles className="size-3.5" /> Direct Access Ready
          </span>
          <p className="text-[11.5px] text-text-muted mt-1">
            <strong className="text-text">{fullName}</strong> can now log into point-of-sale and dispensary terminals.
          </p>
        </div>

        {/* Credentials Card */}
        <div className="rounded-2xl bg-surface-alt/75 border border-border/60 p-4 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs border-b border-border/30 pb-2">
            <span className="text-text-muted flex items-center gap-1.5 font-medium">
              <User className="size-3.5 text-primary" /> Full Name
            </span>
            <span className="font-bold text-text">{fullName}</span>
          </div>

          {phone && (
            <div className="flex items-center justify-between text-xs border-b border-border/30 pb-2">
              <span className="text-text-muted flex items-center gap-1.5 font-medium">
                <Phone className="size-3.5 text-primary" /> Mobile (Login ID)
              </span>
              <span className="font-mono tabular-nums font-bold text-text">+91 {phone}</span>
            </div>
          )}

          {email && !email.includes(".local") && (
            <div className="flex items-center justify-between text-xs border-b border-border/30 pb-2">
              <span className="text-text-muted flex items-center gap-1.5 font-medium">
                <Mail className="size-3.5 text-primary" /> Email
              </span>
              <span className="font-mono text-text">{email}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs border-b border-border/30 pb-2">
            <span className="text-text-muted flex items-center gap-1.5 font-medium">
              <Shield className="size-3.5 text-primary" /> Assigned Role
            </span>
            <UIBadge variant="soft" color="primary" size="xs">
              {roleName || "Staff"}
            </UIBadge>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-text-muted flex items-center gap-1.5 font-medium">
              <Lock className="size-3.5 text-primary" /> Temporary Password
            </span>
            <span className="font-mono tabular-nums font-extrabold text-success bg-surface px-3 py-1 rounded-lg border border-border shadow-2xs text-sm">
              {password}
            </span>
          </div>
        </div>

        {/* Action Buttons: WhatsApp & Copy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <UIButton
            type="button"
            variant="primary"
            size="md"
            startIcon={<MessageSquare className="size-4" />}
            onClick={handleShareWhatsApp}
            className="justify-center font-semibold"
          >
            Share on WhatsApp
          </UIButton>

          <UIButton
            type="button"
            variant="outline"
            size="md"
            startIcon={copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
            onClick={handleCopy}
            className="justify-center font-semibold"
          >
            {copied ? "Copied Details!" : "Copy Details"}
          </UIButton>
        </div>
      </UIModalBody>

      {/* Footer */}
      <UIModalFooter className="bg-surface-alt/40 border-t border-border/40 py-3 flex justify-end">
        <UIButton
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
        >
          Done & Return to Workspace
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default CredentialSuccessModal;
