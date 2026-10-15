import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../store/doctorThunk";
import {
  clearDoctorError,
  clearDoctorMessage,
  setCurrentDoctor,
  resetDoctorState,
} from "../store/doctorSlice";
import {
  selectDoctors,
  selectDoctorTotal,
  selectDoctorPage,
  selectDoctorLimit,
  selectDoctorTotalPages,
  selectDoctorSummary,
  selectCurrentDoctor,
  selectDoctorLoading,
  selectDoctorError,
  selectDoctorMessage,
} from "../store/doctorSelector";

export const useDoctor = () => {
  const dispatch = useDispatch();

  const doctors = useSelector(selectDoctors);
  const total = useSelector(selectDoctorTotal);
  const page = useSelector(selectDoctorPage);
  const limit = useSelector(selectDoctorLimit);
  const totalPages = useSelector(selectDoctorTotalPages);
  const summary = useSelector(selectDoctorSummary);
  const currentDoctor = useSelector(selectCurrentDoctor);
  const isLoading = useSelector(selectDoctorLoading);
  const error = useSelector(selectDoctorError);
  const message = useSelector(selectDoctorMessage);

  const fetchDoctors = useCallback(
    (params = {}) => dispatch(getDoctors(params)).unwrap(),
    [dispatch]
  );

  const fetchDoctorById = useCallback(
    (id) => dispatch(getDoctorById(id)).unwrap(),
    [dispatch]
  );

  const handleCreateDoctor = useCallback(
    (payload) => dispatch(createDoctor(payload)).unwrap(),
    [dispatch]
  );

  const handleUpdateDoctor = useCallback(
    (id, payload) =>
      dispatch(updateDoctor({ doctorId: id, payload })).unwrap(),
    [dispatch]
  );

  const handleDeleteDoctor = useCallback(
    (id) => dispatch(deleteDoctor(id)).unwrap(),
    [dispatch]
  );

  const handleClearError = useCallback(
    () => dispatch(clearDoctorError()),
    [dispatch]
  );

  const handleClearMessage = useCallback(
    () => dispatch(clearDoctorMessage()),
    [dispatch]
  );

  const handleSetCurrentDoctor = useCallback(
    (doc) => dispatch(setCurrentDoctor(doc)),
    [dispatch]
  );

  const handleResetDoctorState = useCallback(
    () => dispatch(resetDoctorState()),
    [dispatch]
  );

  return {
    doctors,
    total,
    page,
    limit,
    totalPages,
    summary,
    currentDoctor,
    isLoading,
    error,
    message,
    getDoctors: fetchDoctors,
    getDoctorById: fetchDoctorById,
    createDoctor: handleCreateDoctor,
    updateDoctor: handleUpdateDoctor,
    deleteDoctor: handleDeleteDoctor,
    clearError: handleClearError,
    clearMessage: handleClearMessage,
    setCurrentDoctor: handleSetCurrentDoctor,
    resetDoctorState: handleResetDoctorState,
  };
};

export default useDoctor;
