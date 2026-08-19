# Per-Branch Role & Access Control (PBAC) + Enhanced Invitation Lifecycle Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Upgrade the ERP User Invitation, Role Assignment, and Facility Access Control systems across backend and frontend to support per-branch role overrides (PBAC), automated MemberAccess provisioning, public invitation acceptance with integrated user signup, and full invitation lifecycle controls (Resend, Copy Link, Edit).

**Architecture:** Extend `WorkspaceInvitation` and `MemberAccess` models to store structured `branchAccess` with per-branch role IDs. Update `permission.middleware.js` to dynamically resolve permissions based on active branch context. Build dedicated public accept page and integrated store matrix management in the frontend.

**Tech Stack:** Node.js, Express, MongoDB (Mongoose), JWT, React 19, Vite, Redux Toolkit, Tailwind CSS.

---

### Task 1: Extend Backend Models for PBAC
- **Files to modify**:
  - `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/core/access-control/models/memberAccess.model.js`
  - `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/organization/workspaces/models/workspaceInvitation.model.js`

### Task 2: Update Backend Invitation & Access Services
- **Files to modify**:
  - `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/organization/workspaces/services/workspaceInvitation.service.js`
  - `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/core/access-control/services/memberAccess.service.js`
  - `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/organization/workspaces/validations/workspaceInvitation.validation.js`
  - `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/organization/workspaces/controllers/workspaceInvitation.controller.js`
  - `c:/Users/Intel/Desktop/erp/erp-backend/src/modules/organization/workspaces/routes/workspace.routes.js`

### Task 3: Implement Dynamic Per-Branch Role Resolution in Permission Middleware
- **Files to modify**:
  - `c:/Users/Intel/Desktop/erp/erp-backend/src/middlewares/permission.middleware.js`
  - `c:/Users/Intel/Desktop/erp/erp-backend/src/middlewares/branchContext.middleware.js`

### Task 4: Update Frontend API Endpoints & Redux Store
- **Files to modify**:
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/services/endpoints.js`
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/services/workspaceService.js`
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/store/workspaceThunk.js`
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/store/workspaceSlice.js`
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/hooks/useWorkspace.js`

### Task 5: Enhance InviteWorkspaceMemberPage with Multi-Branch Role Assignment
- **Files to modify**:
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/pages/InviteWorkspaceMemberPage.jsx`
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/pages/desktop/InviteWorkspaceMemberDesktopPage.jsx`
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/pages/mobile/InviteWorkspaceMemberMobilePage.jsx`

### Task 6: Create Dedicated Public Accept Invitation & Signup Page
- **Files to create/modify**:
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/auth/pages/AcceptInvitationPage.jsx`
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/auth/routes/authRoutes.jsx`
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/constants/routes.constant.js`

### Task 7: Update WorkspaceInvitationsPage with Resend, Copy Link & Store Preview
- **Files to modify**:
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/pages/WorkspaceInvitationsPage.jsx`
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/pages/desktop/WorkspaceInvitationsDesktopPage.jsx`
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/pages/mobile/WorkspaceInvitationsMobilePage.jsx`

### Task 8: Build Member Store Access Matrix Controls
- **Files to modify**:
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/pages/WorkspaceMembersPage.jsx`
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/pages/desktop/WorkspaceMembersDesktopPage.jsx`
  - `c:/Users/Intel/Desktop/erp/erp-frontend/src/features/workspace/pages/mobile/WorkspaceMembersMobilePage.jsx`

### Task 9: Verification & Testing
- Validate backend endpoints and run `npm run build` in `erp-frontend`.
