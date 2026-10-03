import { useCallback } from "react";
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
  directCreateWorkspaceMember,
  resetMemberPassword,
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
  clearLastCreatedMemberCredentials,
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
  selectDirectCreateWorkspaceMemberStatus,
  selectResetMemberPasswordStatus,
  selectLastCreatedMemberCredentials,
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

  const directCreateWorkspaceMemberStatus = useSelector(
    selectDirectCreateWorkspaceMemberStatus,
  );

  const resetMemberPasswordStatus = useSelector(
    selectResetMemberPasswordStatus,
  );

  const lastCreatedMemberCredentials = useSelector(
    selectLastCreatedMemberCredentials,
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

  const submitCreateWorkspace = useCallback(
    (payload) => dispatch(createWorkspace(payload)).unwrap(),
    [dispatch],
  );

  const fetchMyWorkspaces = useCallback(
    () => dispatch(getMyWorkspaces()).unwrap(),
    [dispatch],
  );

  const fetchWorkspaceById = useCallback(
    (workspaceId) => dispatch(getWorkspaceById(workspaceId)).unwrap(),
    [dispatch],
  );

  const submitUpdateWorkspace = useCallback(
    (workspaceId, payload) =>
      dispatch(updateWorkspace({ workspaceId, payload })).unwrap(),
    [dispatch],
  );

  const submitDeleteWorkspace = useCallback(
    (workspaceId) => dispatch(deleteWorkspace(workspaceId)).unwrap(),
    [dispatch],
  );

  const fetchWorkspaceMembers = useCallback(
    (workspaceId) => dispatch(getWorkspaceMembers(workspaceId)).unwrap(),
    [dispatch],
  );

  const submitUpdateWorkspaceMemberStatus = useCallback(
    (workspaceId, memberUserId, status) =>
      dispatch(
        updateWorkspaceMemberStatus({
          workspaceId,
          memberUserId,
          status,
        }),
      ).unwrap(),
    [dispatch],
  );

  const submitRemoveWorkspaceMember = useCallback(
    (workspaceId, memberUserId) =>
      dispatch(
        removeWorkspaceMember({
          workspaceId,
          memberUserId,
        }),
      ).unwrap(),
    [dispatch],
  );

  const submitDirectCreateWorkspaceMember = useCallback(
    (workspaceId, payload) =>
      dispatch(
        directCreateWorkspaceMember({
          workspaceId,
          payload,
        }),
      ).unwrap(),
    [dispatch],
  );

  const submitResetMemberPassword = useCallback(
    (workspaceId, memberUserId, password) =>
      dispatch(
        resetMemberPassword({
          workspaceId,
          memberUserId,
          password,
        }),
      ).unwrap(),
    [dispatch],
  );

  const submitInviteWorkspaceMember = useCallback(
    (workspaceId, payload) =>
      dispatch(
        inviteWorkspaceMember({
          workspaceId,
          payload,
        }),
      ).unwrap(),
    [dispatch],
  );

  const fetchWorkspaceInvitations = useCallback(
    (workspaceId) => dispatch(getWorkspaceInvitations(workspaceId)).unwrap(),
    [dispatch],
  );

  const submitCancelWorkspaceInvitation = useCallback(
    (workspaceId, invitationId) =>
      dispatch(
        cancelWorkspaceInvitation({
          workspaceId,
          invitationId,
        }),
      ).unwrap(),
    [dispatch],
  );

  const submitResendWorkspaceInvitation = useCallback(
    (workspaceId, invitationId) =>
      dispatch(
        resendWorkspaceInvitation({
          workspaceId,
          invitationId,
        }),
      ).unwrap(),
    [dispatch],
  );

  const submitUpdateWorkspaceInvitation = useCallback(
    (workspaceId, invitationId, payload) =>
      dispatch(
        updateWorkspaceInvitation({
          workspaceId,
          invitationId,
          payload,
        }),
      ).unwrap(),
    [dispatch],
  );

  const submitAcceptWorkspaceInvitation = useCallback(
    (token) => dispatch(acceptWorkspaceInvitation(token)).unwrap(),
    [dispatch],
  );

  const submitAcceptWorkspaceInvitationSignup = useCallback(
    (token, payload) =>
      dispatch(
        acceptWorkspaceInvitationSignup({
          token,
          payload,
        }),
      ).unwrap(),
    [dispatch],
  );

  const fetchPublicInvitationDetails = useCallback(
    (token) => dispatch(getPublicInvitationDetails(token)).unwrap(),
    [dispatch],
  );

  // --- NEW USER INBOX DISPATCH METHODS ---
  const fetchIncomingUserInvitations = useCallback(
    () => dispatch(getIncomingUserInvitations()).unwrap(),
    [dispatch],
  );

  const submitAcceptIncomingInvitation = useCallback(
    (token) => dispatch(acceptIncomingInvitation(token)).unwrap(),
    [dispatch],
  );

  const clearError = useCallback(() => {
    dispatch(clearWorkspaceError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearWorkspaceMessage());
  }, [dispatch]);

  const saveCurrentWorkspace = useCallback(
    (payload) => {
      dispatch(setCurrentWorkspace(payload));
    },
    [dispatch],
  );

  const removeCurrentWorkspace = useCallback(() => {
    dispatch(clearCurrentWorkspace());
  }, [dispatch]);

  const removeWorkspaceMembers = useCallback(() => {
    dispatch(clearWorkspaceMembers());
  }, [dispatch]);

  const removeWorkspaceInvitations = useCallback(() => {
    dispatch(clearWorkspaceInvitations());
  }, [dispatch]);

  const removeIncomingInvitations = useCallback(() => {
    dispatch(clearIncomingInvitations());
  }, [dispatch]);

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
    directCreateWorkspaceMemberStatus,
    resetMemberPasswordStatus,
    lastCreatedMemberCredentials,

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
    directCreateWorkspaceMember: submitDirectCreateWorkspaceMember,
    resetMemberPassword: submitResetMemberPassword,
    clearLastCreatedMemberCredentials: () =>
      dispatch(clearLastCreatedMemberCredentials()),

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
