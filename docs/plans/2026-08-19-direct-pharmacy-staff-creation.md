# Direct Pharmacy Staff Creation & Phone Authentication Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement Direct User/Staff Creation with immediate password/PIN setup, WhatsApp/Copy credential sharing, instant store PBAC provisioning, Admin Password Reset, and Dual Phone/Email login tailored for Indian pharmacy operations.

**Architecture:** Single-step atomic user provisioning (`User` + `WorkspaceMember` + `MemberAccess`), dual-identifier login resolver (10-digit mobile or email), and admin password management for store staff.

**Tech Stack:** Node.js, Express, MongoDB/Mongoose, React, Vite, Redux Toolkit, Tailwind CSS.

---

### Task 1: Backend Dual Phone & Email Login Support
- Update `auth.repository.js` with `findUserByEmailOrPhone`.
- Update `auth.service.js` to authenticate via either 10-digit phone or email.
- Update `auth.validation.js` with `loginSchema` supporting `identifier` or `email`.

### Task 2: Backend Direct Member Creation API
- Create `directCreateWorkspaceMemberSchema` in `workspace.validation.js`.
- Implement `directCreateMember` in `workspace.service.js` (atomic creation of `User`, `WorkspaceMember`, and `MemberAccess` with PBAC).
- Mount route `POST /organization/workspaces/:workspaceId/members/direct-create`.

### Task 3: Backend Admin Member Password Reset API
- Implement `resetMemberPassword` in `workspace.service.js`.
- Mount route `POST /organization/workspaces/:workspaceId/members/:memberUserId/reset-password`.

### Task 4: Frontend Redux Store & Service Integration
- Add endpoints to `endpoints.js` and `workspaceService.js`.
- Add thunks to `workspaceThunk.js`, reducers to `workspaceSlice.js`, selectors to `workspaceSelector.js`, and methods to `useWorkspace.js`.

### Task 5: Frontend Direct Add Staff Page / Multi-Mode Onboarding
- Enhance `InviteWorkspaceMemberPage.jsx` with Mode Switch: **"Direct Add Staff (Instant)"** vs **"Email Invite Link"**.
- Add WhatsApp / Copy Credentials dialog upon creation.

### Task 6: Frontend Member Password Reset Modal in WorkspaceMembersPage
- Add "Reset Password / PIN" dialog to `WorkspaceMembersPage.jsx` (Desktop & Mobile).

### Task 7: Frontend Phone & Email Login Input
- Support email or 10-digit phone number in `LoginPage.jsx`.

### Task 8: Verification & Testing
- Backend syntax checks and frontend production build verification.
