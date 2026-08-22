import { useState } from "react";
import {
  UIButton,
  UICard,
  UICardHeader,
  UICardTitle,
  UICardDescription,
  UICardContent,
} from "@/components/ui";

const INITIAL_INTEGRATIONS = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Payment processing, POS gateway, and subscriptions",
    connected: true,
    logoBg: "bg-[#635BFF]",
    logoSvg: (
      <svg className="size-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697.35 12.391.35 6.27.35 2.5 3.528 2.5 8.271c0 5.485 5.568 6.467 9.213 7.822 2.378.887 3.197 1.558 3.197 2.493 0 .979-.858 1.488-2.227 1.488-2.43 0-5.344-1.121-7.228-2.21l-.9 5.594c1.942 1.05 5.093 1.742 8.358 1.742 6.541 0 10.587-3.155 10.587-8.212 0-5.46-5.497-6.529-9.524-7.838z" />
      </svg>
    ),
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Email marketing automation and customer notifications",
    connected: true,
    logoBg: "bg-[#FFE01B]",
    logoSvg: (
      <svg className="size-4.5 text-[#241C15]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.5 8.2c-.3-.8-.9-1.4-1.7-1.7-.5-.2-1-.2-1.5-.2-.7 0-1.4.2-2 .5-.6.3-1.1.7-1.5 1.2-.4-.5-.9-.9-1.5-1.2-.6-.3-1.3-.5-2-.5-.5 0-1 .1-1.5.2-.8.3-1.4.9-1.7 1.7-.3.7-.3 1.5-.1 2.3.4 1.4 1.4 2.5 2.7 3.1.2.1.4.2.6.3-.1.5-.1 1.1 0 1.6.2 1.4.9 2.7 2 3.6 1.1.9 2.5 1.4 3.9 1.4s2.8-.5 3.9-1.4c1.1-.9 1.8-2.2 2-3.6.1-.5.1-1.1 0-1.6.2-.1.4-.2.6-.3 1.3-.6 2.3-1.7 2.7-3.1.2-.8.2-1.6-.1-2.3zm-7.5 7.8c-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1 3.1 1.4 3.1 3.1-1.4 3.1-3.1 3.1z" />
      </svg>
    ),
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "E-commerce catalog and multi-branch inventory sync",
    connected: false,
    logoBg: "bg-[#95BF47]",
    logoSvg: (
      <svg className="size-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.828 2.213a.625.625 0 0 0-.58-.198c-.14.02-.79.13-1.78.33-.99.2-2.31.5-3.69 1.05-1.38.54-2.61 1.31-3.23 2.11-.63.79-.69 1.7-.24 2.38.29.43.76.7 1.36.79.08.01.17.02.26.02.47 0 .96-.13 1.45-.37l.6-.29.44 1.42c.11.36.43.61.81.63.03 0 .07 0 .1 0 .39 0 .74-.24.87-.61l.46-1.31.62.24c.78.3 1.57.46 2.3.46.22 0 .44-.01.65-.05 1.06-.17 1.85-.75 2.17-1.6.31-.83.13-1.84-.52-2.78-.65-.95-1.67-1.83-2.91-2.49-.62-.33-1.15-.55-1.57-.7zm-1.07 14.887l-3.32-1.01-1.43 4.54 3.52.88 1.23-4.41zm3.89-9.15c-.22.6-.78 1.01-1.52 1.13-.15.02-.3.04-.46.04-.55 0-1.17-.13-1.8-.37l-1.05-.41.87-2.48c.84-.4 1.75-.72 2.65-.91.56-.12.98-.18 1.18-.21.28.61.35 1.4.13 2.21zm-6.19 1.85c-.09 0-.17 0-.25-.01-.39-.06-.69-.22-.85-.46-.22-.33-.18-.87.21-1.37.42-.54 1.34-1.14 2.45-1.58.55-.22 1.11-.39 1.64-.52l-.84 2.38-.41.2c-.41.2-.82.33-1.21.36-.25.02-.5.02-.74 0zm7.84 3.65l-1.35-4.32c-.08-.26-.3-.46-.57-.52-.27-.06-.55.02-.75.22l-4.14 4.14 4.88 3.51 1.93-3.03zm-11.83.6l-4.66 3.5 6.07 1.85 1.2-3.8-2.61-1.55z" />
      </svg>
    ),
  },
  {
    id: "slack",
    name: "Slack",
    description: "Pharmacy team operational notifications and stock alerts",
    connected: false,
    logoBg: "bg-[#4A154B]",
    logoSvg: (
      <svg className="size-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    ),
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automate custom pharmacy accounting and SMS workflows",
    connected: false,
    logoBg: "bg-[#FF4A00]",
    logoSvg: (
      <svg className="size-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.2 0H10.8V8.4H2.4V10.8H10.8V19.2H13.2V10.8H21.6V8.4H13.2V0Z" />
      </svg>
    ),
  },
];

const IntegrationsTab = () => {
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);

  const toggleConnection = (id) => {
    setIntegrations((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, connected: !app.connected } : app
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* ── CARD 1: Connected Apps ────────────────────────────── */}
      <UICard variant="default" padding="none" className="p-4 sm:p-5 shadow-[var(--app-shadow-sm)]">
        <UICardHeader className="pb-3 border-b border-border/60 mb-0">
          <UICardTitle as="h2" className="text-sm sm:text-base font-bold tracking-tight text-text">
            Connected Applications
          </UICardTitle>
          <UICardDescription className="mt-0.5 text-xs text-text-muted leading-relaxed">
            Manage third-party integrations, payment gateways, and communications for your pharmacy store
          </UICardDescription>
        </UICardHeader>
        <UICardContent className="pt-3.5 space-y-0">
          <div className="divide-y divide-border/60">
            {integrations.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                {/* Left Logo + Title + Description */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-9 items-center justify-center rounded-[10px] ${app.logoBg} shadow-2xs shrink-0`}
                  >
                    {app.logoSvg}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-text">
                      {app.name}
                    </h3>
                    <p className="text-[11px] text-text-muted leading-tight">
                      {app.description}
                    </p>
                  </div>
                </div>

                {/* Right Status + Action Button */}
                <div className="flex items-center gap-3">
                  {app.connected && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-success">
                      <span className="size-1.5 rounded-full bg-success" />
                      Connected
                    </span>
                  )}

                  <UIButton
                    type="button"
                    variant={app.connected ? "destructive" : "secondary"}
                    size="xs"
                    onClick={() => toggleConnection(app.id)}
                  >
                    {app.connected ? "Disconnect" : "Connect"}
                  </UIButton>
                </div>
              </div>
            ))}
          </div>
        </UICardContent>
      </UICard>
    </div>
  );
};

export default IntegrationsTab;
