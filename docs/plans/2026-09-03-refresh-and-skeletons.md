# Refresh & Loading Skeletons Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Force all beautifully crafted UI Skeletons to mount and display over stale data whenever a user clicks the "Refresh" button or data loads across the major CRM modules.

**Architecture:** Currently, all pages contain custom UI skeletons built for them, but they are wrapped in an `isLoading && !hasData` condition, meaning they only show up if the store is completely empty. We will modify the rendering condition to rely solely on `isLoading`. This guarantees that a skeleton state overlays the UI during any manual refresh or background refetch.

**Tech Stack:** React, Tailwind CSS

---

### Task 1: Company Page Skeleton Condition

**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\company\pages\desktop\CompaniesDesktopPage.jsx`

**Step 1:** Change rendering condition `isLoading && !hasCompanies` to `isLoading`.

### Task 2: Branch Page Skeleton Condition

**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\branch\pages\desktop\BranchesDesktopPage.jsx`

**Step 1:** Change rendering condition `isLoading && !hasBranches` to `isLoading`.

### Task 3: Roles Page Skeleton Condition

**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\access-control\pages\desktop\RolesDesktopPage.jsx`

**Step 1:** Change rendering condition `isLoading && !hasRoles` to `isLoading`.

### Task 4: Workspace Member Skeleton Condition

**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\workspace\pages\desktop\WorkspaceMembersDesktopPage.jsx`

**Step 1:** Change rendering condition `isLoading && !hasMembers` to `isLoading`.

### Task 5: Customer Page Skeleton Condition

**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\parties\customers\pages\desktop\CustomersDesktopPage.jsx`

**Step 1:** Change rendering condition `isLoading && !hasCustomers` to `isLoading`.

### Task 6: Supplier Page Skeleton Condition

**Files:**
- Modify: `c:\Users\Intel\Desktop\erp\erp-frontend\src\features\parties\suppliers\pages\desktop\SuppliersDesktopPage.jsx`

**Step 1:** Change rendering condition `isLoading && !hasSuppliers` to `isLoading`.
