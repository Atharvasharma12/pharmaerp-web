import ShiftsPage from "../shifts/pages/ShiftsPage";
import BusinessDaysPage from "../business-days/pages/BusinessDaysPage";

const operationsRoutes = [
  {
    path: "/operations/shifts",
    element: <ShiftsPage />,
  },
  {
    path: "/operations/business-days",
    element: <BusinessDaysPage />,
  },
];

export default operationsRoutes;
