# Settings Page & Desktop Redesign Design Document (v2.0)

## 1. Overview
The Settings module provides a unified hub for managing account profile, appearance, notifications, security, billing, and third-party integrations. This redesign implements the Universal Design Standards (`DESIGN_STANDARDS.md`, `UI_GUIDE.md`), utilizing 100% semantic CSS theme tokens (`var(--app-color-*)`), a top-level page header with a horizontal tab navigation bar, and a dedicated **Appearance** tab for real-time mode and color theme switching.

## 2. Universal Standards Compliance
- **Typography:** Exact type scale from `DESIGN_STANDARDS.md §3.2`:
  - `<h1>` Page Title: `text-[28px] font-extrabold leading-tight text-text`
  - `<h2>` Section Title: `text-xl font-bold text-text`
  - `<h3>` Card Title: `text-base font-bold text-text`
  - `<label>` Form Label: `text-[13px] font-medium text-text`
  - Body Text: `text-sm text-text-muted`
  - Tabular Numerics: `tabular-nums`
- **Shape Consistency Lock:**
  - Buttons: `rounded-[8px]`
  - Inputs: `rounded-[12px]`
  - Cards & Shells: `rounded-[16px]`
  - Status Pills / Badges: `rounded-full`
- **Zero Hardcoded Colors:**
  - Canvas: `bg-bg`
  - Cards: `bg-surface border-border`
  - Inputs / Sub-surfaces: `bg-surface-alt border-border`
  - Text: `text-text`, `text-text-muted`, `text-text-disabled`
  - Primary Accent: `bg-primary`, `text-primary`, `bg-primary-soft`, `text-primary-contrast`, `hover:bg-primary-hover`
  - Success / Error: `text-success bg-success-soft`, `text-error bg-error-soft`
- **Layout Architecture:**
  - Top: Page header (`<h1>Settings</h1>` + descriptive subtitle).
  - Sub-header: Single-row horizontal tabs bar with smooth sliding active pill indicator (`layoutId`).
  - Body: Responsive container (`max-w-[1200px] mx-auto`) rendering active tab content with Framer Motion spring physics.

## 3. Tab Structure (6 Tabs)
1. **Profile Tab (`profile`)**: Profile Information (avatar photo badge with change photo trigger, name, surname, email, phone, role) & Change Password.
2. **Appearance Tab (`appearance`)**: Theme Mode (Light / Dark / System), Brand Accent Color (Emerald Care, Classic Blue, Indigo Pro, Slate Office, Warm Care), Display & Motion preferences.
3. **Notifications Tab (`notifications`)**: Orders & Customers, Reports & Marketing, System notifications toggles.
4. **Security Tab (`security`)**: Two-factor authentication, Active Sessions roster, Danger zone delete account with modal.
5. **Billing Tab (`billing`)**: Plan information, Payment Methods list with Add modal, Invoices table.
6. **Integrations Tab (`integrations`)**: Connected Apps roster (Stripe, Mailchimp, Shopify, Slack, Zapier) with Connect/Disconnect toggles.
