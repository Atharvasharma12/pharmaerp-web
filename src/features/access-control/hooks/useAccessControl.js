import { useDispatch, useSelector } from "react-redux";

import {
  createRole,
  getWorkspaceRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignRoleToMember,
  getAvailablePermissions,
  getWorkspaceMemberAccessList,
  getMemberAccess,
  updateMemberAccess,
  checkCompanyAccess,
  checkBranchAccess,
} from "../store/accessControlThunk";

import {
  clearAccessControlError,
  clearAccessControlMessage,
  clearCurrentRole,
  clearCurrentMemberAccess,
  clearMemberAccessCheck,
} from "../store/accessControlSlice";

import {
  selectRoles,
  selectCurrentRole,
  selectPermissions,
  selectMemberAccessList,
  selectCurrentMemberAccess,
  selectCompanyAccessCheck,
  selectBranchAccessCheck,
  selectAccessControlStatus,
  selectAccessControlError,
  selectAccessControlMessage,
  selectCreateRoleStatus,
  selectGetWorkspaceRolesStatus,
  selectGetRoleStatus,
  selectUpdateRoleStatus,
  selectDeleteRoleStatus,
  selectAssignRoleToMemberStatus,
  selectGetAvailablePermissionsStatus,
  selectGetWorkspaceMemberAccessListStatus,
  selectGetMemberAccessStatus,
  selectUpdateMemberAccessStatus,
  selectCheckCompanyAccessStatus,
  selectCheckBranchAccessStatus,
} from "../store/accessControlSelector";

const useAccessControl = () => {
  const dispatch = useDispatch();

  const roles = useSelector(selectRoles);
  const currentRole = useSelector(selectCurrentRole);
  const permissions = useSelector(selectPermissions);

  const memberAccessList = useSelector(selectMemberAccessList);
  const currentMemberAccess = useSelector(selectCurrentMemberAccess);

  const companyAccessCheck = useSelector(selectCompanyAccessCheck);
  const branchAccessCheck = useSelector(selectBranchAccessCheck);

  const status = useSelector(selectAccessControlStatus);
  const error = useSelector(selectAccessControlError);
  const message = useSelector(selectAccessControlMessage);

  const createRoleStatus = useSelector(selectCreateRoleStatus);
  const getWorkspaceRolesStatus = useSelector(selectGetWorkspaceRolesStatus);
  const getRoleStatus = useSelector(selectGetRoleStatus);
  const updateRoleStatus = useSelector(selectUpdateRoleStatus);
  const deleteRoleStatus = useSelector(selectDeleteRoleStatus);
  const assignRoleToMemberStatus = useSelector(selectAssignRoleToMemberStatus);
  const getAvailablePermissionsStatus = useSelector(
    selectGetAvailablePermissionsStatus,
  );

  const getWorkspaceMemberAccessListStatus = useSelector(
    selectGetWorkspaceMemberAccessListStatus,
  );
  const getMemberAccessStatus = useSelector(selectGetMemberAccessStatus);
  const updateMemberAccessStatus = useSelector(selectUpdateMemberAccessStatus);

  const checkCompanyAccessStatus = useSelector(selectCheckCompanyAccessStatus);
  const checkBranchAccessStatus = useSelector(selectCheckBranchAccessStatus);

  const submitCreateRole = (payload) => {
    return dispatch(createRole(payload)).unwrap();
  };

  const fetchWorkspaceRoles = () => {
    return dispatch(getWorkspaceRoles()).unwrap();
  };

  const fetchRoleById = (roleId) => {
    return dispatch(getRoleById(roleId)).unwrap();
  };

  const submitUpdateRole = (roleId, payload) => {
    return dispatch(updateRole({ roleId, payload })).unwrap();
  };

  const submitDeleteRole = (roleId) => {
    return dispatch(deleteRole(roleId)).unwrap();
  };

  const submitAssignRoleToMember = (payload) => {
    return dispatch(assignRoleToMember(payload)).unwrap();
  };

  const fetchAvailablePermissions = () => {
    return dispatch(getAvailablePermissions()).unwrap();
  };

  const fetchWorkspaceMemberAccessList = () => {
    return dispatch(getWorkspaceMemberAccessList()).unwrap();
  };

  const fetchMemberAccess = (memberUserId) => {
    return dispatch(getMemberAccess(memberUserId)).unwrap();
  };

  const submitUpdateMemberAccess = (memberUserId, payload) => {
    return dispatch(updateMemberAccess({ memberUserId, payload })).unwrap();
  };

  const verifyCompanyAccess = (companyId) => {
    return dispatch(checkCompanyAccess(companyId)).unwrap();
  };

  const verifyBranchAccess = (branchId) => {
    return dispatch(checkBranchAccess(branchId)).unwrap();
  };

  const clearError = () => {
    dispatch(clearAccessControlError());
  };

  const clearMessage = () => {
    dispatch(clearAccessControlMessage());
  };

  const removeCurrentRole = () => {
    dispatch(clearCurrentRole());
  };

  const removeCurrentMemberAccess = () => {
    dispatch(clearCurrentMemberAccess());
  };

  const removeMemberAccessCheck = () => {
    dispatch(clearMemberAccessCheck());
  };

  return {
    roles,
    currentRole,
    permissions,

    memberAccessList,
    currentMemberAccess,

    companyAccessCheck,
    branchAccessCheck,

    status,
    error,
    message,

    createRoleStatus,
    getWorkspaceRolesStatus,
    getRoleStatus,
    updateRoleStatus,
    deleteRoleStatus,
    assignRoleToMemberStatus,
    getAvailablePermissionsStatus,

    getWorkspaceMemberAccessListStatus,
    getMemberAccessStatus,
    updateMemberAccessStatus,
    checkCompanyAccessStatus,
    checkBranchAccessStatus,

    createRole: submitCreateRole,
    getWorkspaceRoles: fetchWorkspaceRoles,
    getRoleById: fetchRoleById,
    updateRole: submitUpdateRole,
    deleteRole: submitDeleteRole,
    assignRoleToMember: submitAssignRoleToMember,
    getAvailablePermissions: fetchAvailablePermissions,

    getWorkspaceMemberAccessList: fetchWorkspaceMemberAccessList,
    getMemberAccess: fetchMemberAccess,
    updateMemberAccess: submitUpdateMemberAccess,

    checkCompanyAccess: verifyCompanyAccess,
    checkBranchAccess: verifyBranchAccess,

    clearError,
    clearMessage,
    clearCurrentRole: removeCurrentRole,
    clearCurrentMemberAccess: removeCurrentMemberAccess,
    clearMemberAccessCheck: removeMemberAccessCheck,
  };
};

export default useAccessControl;
