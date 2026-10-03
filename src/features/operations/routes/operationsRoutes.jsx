import ShiftsPage from "../shifts/pages/ShiftsPage";
import DayClosingsPage from "../day-closings/pages/DayClosingsPage";

const operationsRoutes = [
  {
    path: "/operations/shifts",
    element: <ShiftsPage />,
  },
  {
    path: "/operations/day-closings",
    element: <DayClosingsPage />,
  },
];

export default operationsRoutes;
