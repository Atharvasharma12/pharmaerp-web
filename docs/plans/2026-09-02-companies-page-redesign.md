# Companies Page Wireframe Redesign & Employee Access Integration Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Redesign the Companies Page across desktop and mobile to match the reference image wireframe (with Grid, Kanban, and Table views, interactive Employee Range, Redux/Service API for company employee access, and zero legacy `App*` components).

**Architecture:** Implement Redux thunks and services for company employee access in `src/features/company/`, build modular subcomponents (`CompanyCard`, `CompanyEmployeesDrawer`, `CompanyKanbanView`, `CompanyTableView`, `CompanyFilterToolbar`), and assemble `CompaniesDesktopPage` and `CompaniesMobilePage` using pure `UI*` primitives and semantic CSS tokens.

**Tech Stack:** React 19, Redux Toolkit, Tailwind CSS v4, Lucide React, Framer Motion, Radix UI primitives (`src/components/ui/`).

---

### Task 1: API Endpoints & Redux Store Extension for Company Employees

**Files:**
- Modify: `src/services/endpoints.js`
- Modify: `src/features/company/services/companyService.js`
- Modify: `src/features/company/store/companyThunk.js`
- Modify: `src/features/company/store/companySlice.js`
- Modify: `src/features/company/store/companySelector.js`
- Modify: `src/features/company/hooks/useCompany.js`

**Step 1: Update `endpoints.js` with company member endpoints**
Add `MEMBERS: (companyId) => `/organization/companies/${companyId}/members`` and `EMPLOYEES: (companyId) => `/organization/companies/${companyId}/employees``.

**Step 2: Add `getCompanyEmployees` method to `companyService.js`**
Support fetching employees for a company with fallback to workspace member access data.

**Step 3: Add `getCompanyEmployees` async thunk to `companyThunk.js`**
Dispatch and handle responses gracefully with error formatting.

**Step 4: Update `companySlice.js` and `companySelector.js`**
Add `companyEmployees: {}` dictionary, loading statuses, reducers, and memoized selectors.

**Step 5: Expose hooks in `useCompany.js`**
Export `companyEmployees`, `getCompanyEmployees`, and `getCompanyEmployeesStatus`.

---

### Task 2: Build `CompanyCard` Component

**Files:**
- Create: `src/features/company/components/CompanyCard.jsx`
- Create: `src/features/company/components/index.js`

**Step 1: Implement `CompanyCard.jsx`**
- Geometric brand avatar with dynamic harmonious color palette.
- Company name, industry/type subtitle, and `UIDropdown` action menu.
- 2x2 metadata grid with `Industry`, `Last Interaction`, `Employee Range` (clickable badge with hover feedback), and `Location`.
- Tactile hover and tap spring animations using Framer Motion.

---

### Task 3: Build `CompanyEmployeesDrawer` Component

**Files:**
- Create: `src/features/company/components/CompanyEmployeesDrawer.jsx`

**Step 1: Implement `CompanyEmployeesDrawer.jsx`**
- Slide-over `UIDrawer` with company header, employee search bar, and employee list.
- Display member avatars, names, roles, emails, status badges, and branch authorizations.
- "Manage in Access Control" CTA button.

---

### Task 4: Build `CompanyFilterToolbar`, `CompanyKanbanView`, and `CompanyTableView`

**Files:**
- Create: `src/features/company/components/CompanyFilterToolbar.jsx`
- Create: `src/features/company/components/CompanyKanbanView.jsx`
- Create: `src/features/company/components/CompanyTableView.jsx`

**Step 1: Implement `CompanyFilterToolbar.jsx`**
- `UISearchInput`, `⇅ Sort` dropdown, `⑂ Filter` dropdown, View Switcher dropdown (`Grid View`, `Kanban View`, `Table View`), active filter chips, and `+ Add Company` CTA.

**Step 2: Implement `CompanyKanbanView.jsx`**
- Status column board (`Active`, `Inactive`, `Suspended`) organizing company cards by status without upper prospect tabs.

**Step 3: Implement `CompanyTableView.jsx`**
- Native `UITable` with column headers, tabular numbers, status pills, staff count, owner contact, and row actions.

---

### Task 5: Assemble `CompaniesPage` Container & Replace Legacy Components

**Files:**
- Modify: `src/features/company/pages/CompaniesPage.jsx`

**Step 1: Refactor `CompaniesPage.jsx`**
- Replace `AppConfirmModal` with `UIConfirmDialog`.
- Add view switcher state (`'grid' | 'kanban' | 'table'`) and sorting logic.
- Add employee drawer state and handlers.
- Pass all unified props to Desktop and Mobile pages.

---

### Task 6: Redesign `CompaniesDesktopPage.jsx`

**Files:**
- Modify: `src/features/company/pages/desktop/CompaniesDesktopPage.jsx`

**Step 1: Complete overhaul of `CompaniesDesktopPage.jsx`**
- Eliminate all legacy `App*` components.
- Implement `UIPageHeader`, `CompanyFilterToolbar`, 3-column / 4-column responsive `CompanyCard` grid, `CompanyKanbanView`, `CompanyTableView`, `CompanyEmployeesDrawer`, `UIEmptyState`, and `UISkeleton`.
- Ensure multi-device responsive layout and short screen (< 700px height) compliance.

---

### Task 7: Redesign `CompaniesMobilePage.jsx`

**Files:**
- Modify: `src/features/company/pages/mobile/CompaniesMobilePage.jsx`

**Step 1: Complete overhaul of `CompaniesMobilePage.jsx`**
- Eliminate all legacy `App*` components.
- Implement mobile touch-friendly company cards (≥ 44px touch targets), search bar, filter bottom sheet, view switcher, and employee drawer.

---

### Task 8: Verification & Build Validation

**Files:**
- Test with `npm run build`

**Step 1: Validate build**
- Run `npm run build` to ensure 0 errors and full compliance with design system standards.
