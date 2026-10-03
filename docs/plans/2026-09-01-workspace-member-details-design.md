# Workspace Member Details Blueprint Design (PharmaERP)

**Date**: 2026-09-01  
**Status**: Approved / Ready for Implementation  
**Topic**: Workspace Member Details Page Transformation from Reference Wireframe

---

## 1. Goal & Context

Transform the Workspace Member Details page (`/workspace/members/:memberId`) in PharmaERP to faithfully replicate the structural wireframe blueprint of the reference image while integrating seamlessly with PharmaERP's backend data model (`WorkspaceMember`, `User`, `MemberAccess`, `Company`, `Branch`, `Role`) and our `UI*` component design system.

---

## 2. Backend Data Integration (ERP Pharmacy)

From `erp-backend`:
- **User Record (`User`)**: `fullName`, `email`, `phone`, `userCode`, `avatar`, `lastLoginAt`, `emailVerified`, `phoneVerified`, `createdAt`.
- **Member Record (`WorkspaceMember`)**: `roleId` (populated `Role`), `status` (`active`, `inactive`, `suspended`), `isOwner`, `isPrimary`, `lastActiveAt`, `createdAt`, `notes`.
- **Access Records (`MemberAccess`)**: `accessAllCompanies`, `accessAllBranches`, `companyIds` (`Company[]`), `branchIds` (`Branch[]`), `branchAccess` (`{ branchId, roleId, canOperateMarketplaceStore }[]`).

---

## 3. Spatial Architecture & Component Breakdown

### 3.1 Layout Grid
- Max boundary: `max-w-[1440px] mx-auto`
- Responsive 2-column split on desktop: `grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5`
  - **Left Rail (lg:col-span-4 / ~32%)**: Profile Identity, Quick Actions, Contact & Workspace Hierarchy.
  - **Right Rail (lg:col-span-8 / ~68%)**: 3-Column Member Information Grid + Bottom Split (Activity Chart + Store Facility Assignments).

### 3.2 Left Rail Elements
1. **Member Profile Summary Card**:
   - Centered large circular avatar with status ring.
   - Display Name (`text-lg font-bold text-text`)
   - Role Title (`text-xs text-text-muted`) + User Code badge (`#USR-XXXXXX` in `font-mono tabular-nums`)
   - 3 Quick Icon Action Buttons:
     - ✉️ Email (Click to copy / mailto)
     - 📞 Phone (Click to copy / tel)
     - 🔑 Reset Password / PIN trigger
2. **Hierarchy & Organization Card**:
   - `Workspace Scope`: Current Workspace Name
   - `Clearance Level`: Role Name with interactive badge
   - `Supervisor / Lead`: Workspace Owner
3. **Contact Information Card**:
   - Email with copy-to-clipboard button
   - Phone with copy-to-clipboard button
   - User System Code
4. **Primary Action**:
   - Full-width `UIButton variant="primary" size="lg"`: `Manage Access & Stores` (opens facility access modal)

### 3.3 Right Rail Elements
1. **Top Container: Staff & Pharmacy Member Information (3 Columns)**:
   - **Column 1 (General Information)**: Full Name, User Code, Email Address, Contact Phone, Joined Date.
   - **Column 2 (Employment & Clearance)**: Role Title, Workspace, Start Date, Tenure/Duration, Account Status (`Active` in green text with pulse dot).
   - **Column 3 (Facility & Security Clearance)**: Company Clearance, Branch Clearance, Marketplace Operations, Security PIN, Member UUID.
2. **Bottom Left: Activity Chart (~60% / lg:col-span-7)**:
   - Header with title `Activity Chart` + Segmented period switcher (`Monthly`, `Weekly`, `Daily`).
   - Animated vertical SVG/HTML capsule bars (Mon to Sun) showing login/dispense throughput with hover value tooltips and Y-axis scale.
3. **Bottom Right: Facility & Branch Operations (~40% / lg:col-span-5)**:
   - Authorized Companies & Branches list with branch type badges, tax IDs, and store operational flags.
   - Progress bar indicating Store Clearance status (e.g. `100% Authorized`).

---

## 4. Multi-Device Ergonomics

- **Desktop (1024px+)**: Dual-column asymmetric split layout matching reference image.
- **Tablet (768px - 1023px)**: Single column with 2-column info cards.
- **Mobile (360px - 480px)**: Compact single-column card stack with touch targets ≥ 44px, sticky header actions, and touch-friendly drawers.

---

## 5. Verification Plan

1. Build code without legacy `App*` components.
2. Verify with `npm run build` (Exit Code 0).
3. Validate interactive controls (Reset Password, Manage Access, Status Toggle, Activity Chart period switch).
