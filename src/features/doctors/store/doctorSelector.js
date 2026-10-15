export const selectDoctorState = (state) => state.doctor;
export const selectDoctors = (state) => state.doctor?.doctors || [];
export const selectDoctorTotal = (state) => state.doctor?.total || 0;
export const selectDoctorPage = (state) => state.doctor?.page || 1;
export const selectDoctorLimit = (state) => state.doctor?.limit || 20;
export const selectDoctorTotalPages = (state) => state.doctor?.totalPages || 1;
export const selectDoctorSummary = (state) => state.doctor?.summary || {
  totalDoctors: 0,
  activeDoctors: 0,
  hospitalsCount: 0,
  specialtiesCount: 0,
};
export const selectCurrentDoctor = (state) => state.doctor?.currentDoctor;
export const selectDoctorLoading = (state) =>
  state.doctor?.getDoctorsStatus === "pending";
export const selectDoctorError = (state) => state.doctor?.error;
export const selectDoctorMessage = (state) => state.doctor?.message;
