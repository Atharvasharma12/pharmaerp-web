import { useDispatch, useSelector } from "react-redux";

import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceMembers,
  addWorkspaceMember,
  updateWorkspaceMemberStatus,
  removeWorkspaceMember,
} from "../store/workspaceThunk";

import {
  clearWorkspaceError,
  clearWorkspaceMessage,
  setCurrentWorkspace,
  clearCurrentWorkspace,
  clearWorkspaceMembers,
} from "../store/workspaceSlice";

import {
  selectWorkspaces,
  selectCurrentWorkspace,
  selectWorkspaceMembers,
  selectWorkspaceStatus,
  selectWorkspaceError,
  selectWorkspaceMessage,
  selectCreateWorkspaceStatus,
  selectUpdateWorkspaceStatus,
  selectDeleteWorkspaceStatus,
  selectGetWorkspaceMembersStatus,
  selectAddWorkspaceMemberStatus,
  selectUpdateWorkspaceMemberStatus,
  selectRemoveWorkspaceMemberStatus,
} from "../store/workspaceSelector";

const useWorkspace = () => {
  const dispatch = useDispatch();

  const workspaces = useSelector(selectWorkspaces);

  const currentWorkspace = useSelector(selectCurrentWorkspace);

  const members = useSelector(selectWorkspaceMembers);

  const status = useSelector(selectWorkspaceStatus);

  const error = useSelector(selectWorkspaceError);

  const message = useSelector(selectWorkspaceMessage);

  const createWorkspaceStatus = useSelector(selectCreateWorkspaceStatus);

  const updateWorkspaceStatus = useSelector(selectUpdateWorkspaceStatus);

  const deleteWorkspaceStatus = useSelector(selectDeleteWorkspaceStatus);

  const getWorkspaceMembersStatus = useSelector(
    selectGetWorkspaceMembersStatus,
  );

  const addWorkspaceMemberStatus = useSelector(selectAddWorkspaceMemberStatus);

  const updateWorkspaceMemberStatusStatus = useSelector(
    selectUpdateWorkspaceMemberStatus,
  );

  const removeWorkspaceMemberStatus = useSelector(
    selectRemoveWorkspaceMemberStatus,
  );

  const createNewWorkspace = (payload) => {
    return dispatch(createWorkspace(payload)).unwrap();
  };

  const fetchMyWorkspaces = () => {
    return dispatch(getMyWorkspaces()).unwrap();
  };

  const fetchWorkspaceById = (workspaceId) => {
    return dispatch(getWorkspaceById(workspaceId)).unwrap();
  };

  const submitUpdateWorkspace = (workspaceId, payload) => {
    return dispatch(
      updateWorkspace({
        workspaceId,
        payload,
      }),
    ).unwrap();
  };

  const submitDeleteWorkspace = (workspaceId) => {
    return dispatch(deleteWorkspace(workspaceId)).unwrap();
  };

  const fetchWorkspaceMembers = (workspaceId) => {
    return dispatch(getWorkspaceMembers(workspaceId)).unwrap();
  };

  const submitAddWorkspaceMember = (workspaceId, payload) => {
    return dispatch(
      addWorkspaceMember({
        workspaceId,
        payload,
      }),
    ).unwrap();
  };

  const submitUpdateWorkspaceMemberStatus = (
    workspaceId,
    memberUserId,
    payload,
  ) => {
    return dispatch(
      updateWorkspaceMemberStatus({
        workspaceId,
        memberUserId,
        payload,
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

  return {
    workspaces,
    currentWorkspace,
    members,

    status,
    error,
    message,

    createWorkspaceStatus,
    updateWorkspaceStatus,
    deleteWorkspaceStatus,

    getWorkspaceMembersStatus,
    addWorkspaceMemberStatus,
    updateWorkspaceMemberStatusStatus,
    removeWorkspaceMemberStatus,

    createWorkspace: createNewWorkspace,
    getMyWorkspaces: fetchMyWorkspaces,
    getWorkspaceById: fetchWorkspaceById,
    updateWorkspace: submitUpdateWorkspace,
    deleteWorkspace: submitDeleteWorkspace,

    getWorkspaceMembers: fetchWorkspaceMembers,
    addWorkspaceMember: submitAddWorkspaceMember,
    updateWorkspaceMemberStatus: submitUpdateWorkspaceMemberStatus,
    removeWorkspaceMember: submitRemoveWorkspaceMember,

    clearError,
    clearMessage,

    setCurrentWorkspace: saveCurrentWorkspace,
    clearCurrentWorkspace: removeCurrentWorkspace,

    clearWorkspaceMembers: removeWorkspaceMembers,
  };
};

export default useWorkspace;
