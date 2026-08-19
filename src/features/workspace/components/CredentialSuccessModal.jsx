// src/features/workspace/components/CredentialSuccessModal.jsx

import { useState } from "react";
import {
  FiCheck,
  FiCopy,
  FiUser,
  FiLock,
  FiPhone,
  FiMail,
  FiShield,
  FiExternalLink,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import {
  AppDialog,
  AppButton,
  AppCard,
  AppHeading,
  AppText,
} from "@/components";

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
    <AppDialog
      open={open}
      onClose={onClose}
      title="Staff Account Created Successfully!"
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1">
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-center">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
            Immediate Store Activation
          </span>
          <p className="text-xs text-text-muted mt-1">
            <strong>{fullName}</strong> has been created and assigned to your
            store. You can now share their login credentials directly.
          </p>
        </div>

        {/* Credentials Card */}
        <AppCard
          variant="default"
          rounded="md"
          bordered
          shadow="none"
          className="p-4 space-y-2.5 bg-surface-alt/40"
        >
          <div className="flex items-center justify-between text-xs border-b border-border/60 pb-2">
            <span className="text-text-muted flex items-center gap-1.5 font-medium">
              <FiUser className="text-primary text-xs" /> Full Name
            </span>
            <span className="font-bold text-text">{fullName}</span>
          </div>

          {phone && (
            <div className="flex items-center justify-between text-xs border-b border-border/60 pb-2">
              <span className="text-text-muted flex items-center gap-1.5 font-medium">
                <FiPhone className="text-primary text-xs" /> Mobile (Login ID)
              </span>
              <span className="font-mono font-bold text-text">+91 {phone}</span>
            </div>
          )}

          {email && !email.includes(".local") && (
            <div className="flex items-center justify-between text-xs border-b border-border/60 pb-2">
              <span className="text-text-muted flex items-center gap-1.5 font-medium">
                <FiMail className="text-primary text-xs" /> Email
              </span>
              <span className="font-mono text-text">{email}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs border-b border-border/60 pb-2">
            <span className="text-text-muted flex items-center gap-1.5 font-medium">
              <FiShield className="text-primary text-xs" /> Assigned Role
            </span>
            <span className="font-semibold text-primary">{roleName || "Staff"}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-0.5">
            <span className="text-text-muted flex items-center gap-1.5 font-medium">
              <FiLock className="text-primary text-xs" /> Password / PIN
            </span>
            <span className="font-mono font-bold text-emerald-500 bg-surface px-2.5 py-0.5 rounded border border-border">
              {password}
            </span>
          </div>
        </AppCard>

        {/* Action Buttons: WhatsApp & Copy */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <AppButton
            type="button"
            variant="contained"
            colorVariant="success"
            rounded="md"
            size="medium"
            startIcon={<FaWhatsapp className="text-base" />}
            onClick={handleShareWhatsApp}
          >
            Share on WhatsApp
          </AppButton>

          <AppButton
            type="button"
            variant="outlined"
            colorVariant="primary"
            rounded="md"
            size="medium"
            startIcon={copied ? <FiCheck /> : <FiCopy />}
            onClick={handleCopy}
          >
            {copied ? "Copied to Clipboard!" : "Copy Details"}
          </AppButton>
        </div>

        <div className="pt-2 text-center">
          <AppButton
            type="button"
            variant="text"
            colorVariant="neutral"
            size="small"
            onClick={onClose}
          >
            Done & Return to Members
          </AppButton>
        </div>
      </div>
    </AppDialog>
  );
};

export default CredentialSuccessModal;
