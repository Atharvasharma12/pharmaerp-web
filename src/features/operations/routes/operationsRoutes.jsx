import ShiftsPage from "../shifts/pages/ShiftsPage";
import DayClosingsPage from "../day-closings/pages/DayClosingsPage";
import BusinessDaysPage from "../business-days/pages/BusinessDaysPage";
const operationsRoutes = [
  {
    path: "/operations/shifts",
    element: <ShiftsPage />,
  },
  {
    path: "/operations/day-closings",
    element: <DayClosingsPage />,
  },
  {
    path: "/operations/business-days",
    element: <BusinessDaysPage />,
  },
];

export default operationsRoutes;
