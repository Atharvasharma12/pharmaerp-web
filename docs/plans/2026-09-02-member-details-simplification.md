# Workspace Member Detail Page Simplification & Backend Alignment Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Simplify the Workspace Member Detail page by removing the back button, removing the dummy activity chart, eliminating fabricated placeholder data, and strictly displaying actual backend fields from the ERP backend schema.

**Architecture:** Update the parent controller (`WorkspaceMemberDetailsPage.jsx`) to supply verified backend fields (User Identity, Membership Status, Security Role, Access Scope, Timestamps, Notes) and redesign both the Desktop (`WorkspaceMemberDetailsDesktopPage.jsx`) and Mobile (`WorkspaceMemberDetailsMobilePage.jsx`) interfaces using clean, high-scanability card layouts adhering to `DESIGN_STANDARDS.md` and `UI_GUIDE.md`.

**Tech Stack:** React 19, Tailwind CSS v4 semantic tokens (`bg-surface`, `bg-surface-alt`, `text-text`, `text-text-muted`), Lucide React icons, UI design system (`UIButton`, `UIBadge`, `UISkeleton`, `UIConfirmDialog`).

---

### Task 1: Update Parent Page Controller with Exact Backend Fields
**Files:**
- Modify: `src/features/workspace/pages/WorkspaceMemberDetailsPage.jsx`

**Step 1:** Extract and pass only real backend fields from `member`, `user`, `role`, and `access`:
- Extract `userCode`, `emailVerified`, `phoneVerified`, `isPrimary`, `notes`, `joinedViaInvitationId`, `roleDescription`, `lastActiveAt`, `createdAt`.
- Remove unused mock activity states or dead handlers.

**Step 2:** Verify prop alignment and types.

---

### Task 2: Redesign Desktop Member Detail Surface (`WorkspaceMemberDetailsDesktopPage.jsx`)
**Files:**
- Modify: `src/features/workspace/pages/desktop/WorkspaceMemberDetailsDesktopPage.jsx`

**Step 1:** Remove the back button from the header.
**Step 2:** Remove the dummy activity chart (Weekly/Monthly/Daily bars and segmented period switcher).
**Step 3:** Remove all fabricated fields (fake Department, Supervisor, Tenure, Marketplace Access, dummy PIN status, fake coworkers avatar stack, fake 75% progress bar).
**Step 4:** Build a clean, structured 2-column Operate Mode layout:
- **Left Column (~33%):**
  - Member Avatar, Full Name, Role Badge, Status Badge, User Code.
  - Quick action copy buttons for Email & Phone.
  - Primary Action Button: "Manage Access & Branches".
- **Right Column (~67%):**
  - **Card 1: Member & Account Information:** Full Name, Email (with verified badge), Phone (with verified badge), User Code, Account Type, Joined Date, Last Active.
  - **Card 2: Security Role & Clearance:** Role Name, Role Description, Primary Member status, Onboarding Origin (Direct / Invited), Member Notes.
  - **Card 3: Authorized Store & Facility Scope:** Company Access summary & list, Branch Access summary & list, quick Edit button.

---

### Task 3: Redesign Mobile Member Detail Surface (`WorkspaceMemberDetailsMobilePage.jsx`)
**Files:**
- Modify: `src/features/workspace/pages/mobile/WorkspaceMemberDetailsMobilePage.jsx`

**Step 1:** Remove the back button from the top navigation bar.
**Step 2:** Remove the dummy activity tab and chart.
**Step 3:** Remove all fabricated dummy fields.
**Step 4:** Implement a clean, touch-friendly tabbed/stacked card interface (Profile Card, General Details, Security & Role, Facility Clearance) with min 44px touch targets and bottom sticky action bar.

---

### Task 4: Verification & Build Validation
**Files:**
- Verification: Run `npm run build`

**Step 1:** Execute `npm run build` in powershell.
**Step 2:** Ensure zero build errors, zero missing imports, and zero lint issues.
