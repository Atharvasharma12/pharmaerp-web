import { useDispatch, useSelector } from "react-redux";

import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceMembers,
  updateWorkspaceMemberStatus,
  removeWorkspaceMember,
  inviteWorkspaceMember,
  getWorkspaceInvitations,
  cancelWorkspaceInvitation,
  resendWorkspaceInvitation,
  updateWorkspaceInvitation,
  acceptWorkspaceInvitation,
  acceptWorkspaceInvitationSignup,
  getPublicInvitationDetails,
  getIncomingUserInvitations,
  acceptIncomingInvitation,
} from "../store/workspaceThunk";

import {
  clearWorkspaceError,
  clearWorkspaceMessage,
  setCurrentWorkspace,
  clearCurrentWorkspace,
  clearWorkspaceMembers,
  clearWorkspaceInvitations,
  clearIncomingInvitations,
} from "../store/workspaceSlice";

import {
  selectWorkspaces,
  selectCurrentWorkspace,
  selectWorkspaceMembers,
  selectWorkspaceInvitations,
  selectWorkspaceStatus,
  selectWorkspaceError,
  selectWorkspaceMessage,
  selectCreateWorkspaceStatus,
  selectGetMyWorkspacesStatus,
  selectGetWorkspaceStatus,
  selectUpdateWorkspaceStatus,
  selectDeleteWorkspaceStatus,
  selectGetWorkspaceMembersStatus,
  selectUpdateWorkspaceMemberStatus,
  selectRemoveWorkspaceMemberStatus,
  selectInviteWorkspaceMemberStatus,
  selectGetWorkspaceInvitationsStatus,
  selectCancelWorkspaceInvitationStatus,
  selectResendWorkspaceInvitationStatus,
  selectUpdateWorkspaceInvitationStatus,
  selectAcceptWorkspaceInvitationStatus,
  selectAcceptWorkspaceInvitationSignupStatus,
  selectGetPublicInvitationDetailsStatus,
  selectPublicInvitationDetails,
  selectIncomingInvitations,
  selectGetIncomingUserInvitationsStatus,
  selectAcceptIncomingInvitationStatus,
} from "../store/workspaceSelector";

const useWorkspace = () => {
  const dispatch = useDispatch();

  const workspaces = useSelector(selectWorkspaces);
  const currentWorkspace = useSelector(selectCurrentWorkspace);
  const members = useSelector(selectWorkspaceMembers);
  const invitations = useSelector(selectWorkspaceInvitations);

  const status = useSelector(selectWorkspaceStatus);
  const error = useSelector(selectWorkspaceError);
  const message = useSelector(selectWorkspaceMessage);

  const createWorkspaceStatus = useSelector(selectCreateWorkspaceStatus);
  const getMyWorkspacesStatus = useSelector(selectGetMyWorkspacesStatus);
  const getWorkspaceStatus = useSelector(selectGetWorkspaceStatus);
  const updateWorkspaceStatus = useSelector(selectUpdateWorkspaceStatus);
  const deleteWorkspaceStatus = useSelector(selectDeleteWorkspaceStatus);

  const getWorkspaceMembersStatus = useSelector(
    selectGetWorkspaceMembersStatus,
  );

  const updateWorkspaceMemberStatusValue = useSelector(
    selectUpdateWorkspaceMemberStatus,
  );

  const removeWorkspaceMemberStatus = useSelector(
    selectRemoveWorkspaceMemberStatus,
  );

  const inviteWorkspaceMemberStatus = useSelector(
    selectInviteWorkspaceMemberStatus,
  );

  const getWorkspaceInvitationsStatus = useSelector(
    selectGetWorkspaceInvitationsStatus,
  );

  const cancelWorkspaceInvitationStatus = useSelector(
    selectCancelWorkspaceInvitationStatus,
  );

  const resendWorkspaceInvitationStatus = useSelector(
    selectResendWorkspaceInvitationStatus,
  );

  const updateWorkspaceInvitationStatus = useSelector(
    selectUpdateWorkspaceInvitationStatus,
  );

  const acceptWorkspaceInvitationStatus = useSelector(
    selectAcceptWorkspaceInvitationStatus,
  );

  const acceptWorkspaceInvitationSignupStatus = useSelector(
    selectAcceptWorkspaceInvitationSignupStatus,
  );

  const getPublicInvitationDetailsStatus = useSelector(
    selectGetPublicInvitationDetailsStatus,
  );

  const publicInvitationDetails = useSelector(
    selectPublicInvitationDetails,
  );

  // --- NEW USER INBOX SELECTORS ---
  const incomingInvitations = useSelector(selectIncomingInvitations);
  const getIncomingUserInvitationsStatus = useSelector(
    selectGetIncomingUserInvitationsStatus,
  );
  const acceptIncomingInvitationStatus = useSelector(
    selectAcceptIncomingInvitationStatus,
  );

  const submitCreateWorkspace = (payload) => {
    return dispatch(createWorkspace(payload)).unwrap();
  };

  const fetchMyWorkspaces = () => {
    return dispatch(getMyWorkspaces()).unwrap();
  };

  const fetchWorkspaceById = (workspaceId) => {
    return dispatch(getWorkspaceById(workspaceId)).unwrap();
  };

  const submitUpdateWorkspace = (workspaceId, payload) => {
    return dispatch(updateWorkspace({ workspaceId, payload })).unwrap();
  };

  const submitDeleteWorkspace = (workspaceId) => {
    return dispatch(deleteWorkspace(workspaceId)).unwrap();
  };

  const fetchWorkspaceMembers = (workspaceId) => {
    return dispatch(getWorkspaceMembers(workspaceId)).unwrap();
  };

  const submitUpdateWorkspaceMemberStatus = (
    workspaceId,
    memberUserId,
    status,
  ) => {
    return dispatch(
      updateWorkspaceMemberStatus({
        workspaceId,
        memberUserId,
        status,
      }),
    ).unwrap();
  };

  const submitRemoveWorkspaceMember = (workspaceId, memberUserId) => {
    return dispatch(
      removeWorkspaceMember({
        workspaceId,
        memberUserId,
      }),
    ).unwrap();
  };

  const submitInviteWorkspaceMember = (workspaceId, payload) => {
    return dispatch(
      inviteWorkspaceMember({
        workspaceId,
        payload,
      }),
    ).unwrap();
  };

  const fetchWorkspaceInvitations = (workspaceId) => {
    return dispatch(getWorkspaceInvitations(workspaceId)).unwrap();
  };

  const submitCancelWorkspaceInvitation = (workspaceId, invitationId) => {
    return dispatch(
      cancelWorkspaceInvitation({
        workspaceId,
        invitationId,
      }),
    ).unwrap();
  };

  const submitResendWorkspaceInvitation = (workspaceId, invitationId) => {
    return dispatch(
      resendWorkspaceInvitation({
        workspaceId,
        invitationId,
      }),
    ).unwrap();
  };

  const submitUpdateWorkspaceInvitation = (workspaceId, invitationId, payload) => {
    return dispatch(
      updateWorkspaceInvitation({
        workspaceId,
        invitationId,
        payload,
      }),
    ).unwrap();
  };

  const submitAcceptWorkspaceInvitation = (token) => {
    return dispatch(acceptWorkspaceInvitation(token)).unwrap();
  };

  const submitAcceptWorkspaceInvitationSignup = (token, payload) => {
    return dispatch(
      acceptWorkspaceInvitationSignup({
        token,
        payload,
      }),
    ).unwrap();
  };

  const fetchPublicInvitationDetails = (token) => {
    return dispatch(getPublicInvitationDetails(token)).unwrap();
  };

  // --- NEW USER INBOX DISPATCH METHODS ---
  const fetchIncomingUserInvitations = () => {
    return dispatch(getIncomingUserInvitations()).unwrap();
  };

  const submitAcceptIncomingInvitation = (token) => {
    return dispatch(acceptIncomingInvitation(token)).unwrap();
  };

  const clearError = () => {
    dispatch(clearWorkspaceError());
  };

  const clearMessage = () => {
    dispatch(clearWorkspaceMessage());
  };

  const saveCurrentWorkspace = (payload) => {
    dispatch(setCurrentWorkspace(payload));
  };

  const removeCurrentWorkspace = () => {
    dispatch(clearCurrentWorkspace());
  };

  const removeWorkspaceMembers = () => {
    dispatch(clearWorkspaceMembers());
  };

  const removeWorkspaceInvitations = () => {
    dispatch(clearWorkspaceInvitations());
  };

  const removeIncomingInvitations = () => {
    dispatch(clearIncomingInvitations());
  };

  return {
    workspaces,
    currentWorkspace,
    members,
    invitations,

    status,
    error,
    message,

    createWorkspaceStatus,
    getMyWorkspacesStatus,
    getWorkspaceStatus,
    updateWorkspaceStatus,
    deleteWorkspaceStatus,

    getWorkspaceMembersStatus,
    updateWorkspaceMemberStatus: updateWorkspaceMemberStatusValue,
    removeWorkspaceMemberStatus,

    inviteWorkspaceMemberStatus,
    getWorkspaceInvitationsStatus,
    cancelWorkspaceInvitationStatus,
    resendWorkspaceInvitationStatus,
    updateWorkspaceInvitationStatus,
    acceptWorkspaceInvitationStatus,
    acceptWorkspaceInvitationSignupStatus,
    getPublicInvitationDetailsStatus,
    publicInvitationDetails,

    // --- NEW INBOX STATES EXPOSED ---
    incomingInvitations,
    getIncomingUserInvitationsStatus,
    acceptIncomingInvitationStatus,

    createWorkspace: submitCreateWorkspace,
    getMyWorkspaces: fetchMyWorkspaces,
    getWorkspaceById: fetchWorkspaceById,
    updateWorkspace: submitUpdateWorkspace,
    deleteWorkspace: submitDeleteWorkspace,

    getWorkspaceMembers: fetchWorkspaceMembers,
    updateWorkspaceMemberStatus: submitUpdateWorkspaceMemberStatus,
    removeWorkspaceMember: submitRemoveWorkspaceMember,

    inviteWorkspaceMember: submitInviteWorkspaceMember,
    getWorkspaceInvitations: fetchWorkspaceInvitations,
    cancelWorkspaceInvitation: submitCancelWorkspaceInvitation,
    resendWorkspaceInvitation: submitResendWorkspaceInvitation,
    updateWorkspaceInvitation: submitUpdateWorkspaceInvitation,
    acceptWorkspaceInvitation: submitAcceptWorkspaceInvitation,
    acceptWorkspaceInvitationSignup: submitAcceptWorkspaceInvitationSignup,
    getPublicInvitationDetails: fetchPublicInvitationDetails,

    // --- NEW INBOX METHOD DISPATCHERS EXPOSED ---
    getIncomingUserInvitations: fetchIncomingUserInvitations,
    acceptIncomingInvitation: submitAcceptIncomingInvitation,

    clearError,
    clearMessage,

    setCurrentWorkspace: saveCurrentWorkspace,
    clearCurrentWorkspace: removeCurrentWorkspace,
    clearWorkspaceMembers: removeWorkspaceMembers,
    clearWorkspaceInvitations: removeWorkspaceInvitations,
    clearIncomingInvitations: removeIncomingInvitations,
  };
};

export default useWorkspace;
