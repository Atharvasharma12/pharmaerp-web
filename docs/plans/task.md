| Task | Status | Notes |
| --- | --- | --- |
| Task 1: Extend Backend Models for PBAC | done | Updated memberAccess.model.js and workspaceInvitation.model.js with branchAccess & facility scoping |
| Task 2: Update Backend Invitation & Access Services | done | Implemented atomic MemberAccess provisioning, accept-signup, resend, update, and validations |
| Task 3: Dynamic Per-Branch Role Resolution in Permission Middleware | done | Integrated branchAccess role override resolution in permission.middleware.js |
| Task 4: Update Frontend API Endpoints & Redux Store | done | Updated endpoints, workspaceService, thunks, slices, selectors, and useWorkspace hook |
| Task 5: Enhance InviteWorkspaceMemberPage with Multi-Branch Role Assignment | done | Built branch & company facility selector with per-branch role matrix & marketplace toggles |
| Task 6: Create Dedicated Public Accept Invitation & Signup Page | done | Created AcceptInvitationPage.jsx with PBAC previews and integrated seamless signup flow |
| Task 7: Update WorkspaceInvitationsPage with Resend, Copy Link & Store Preview | done | Added Resend action, Copy link, and Store Footprint indicators in desktop & mobile pages |
| Task 8: Build Member Store Access Matrix Controls in WorkspaceMembersPage | done | Integrated Store & Role Access management actions into members roster |
| Task 9: Verification & Testing | done | Verified with node --check on backend files and full vite production build on frontend |
