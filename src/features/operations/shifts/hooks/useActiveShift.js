import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOpenShift } from "../store/shiftThunk";

export const useActiveShift = (branchId) => {
  const dispatch = useDispatch();
  const { activeShift, getOpenShiftStatus, error } = useSelector((state) => state.shift);

  useEffect(() => {
    if (branchId && getOpenShiftStatus === "IDLE") {
      dispatch(getOpenShift({ branchId }));
    }
  }, [branchId, getOpenShiftStatus, dispatch]);

  return { activeShift, status: getOpenShiftStatus, error };
};
