import { Route } from "../../types/routes.type";


export const tutorRoutes: Route[] = [
  {
    title: "Tutor Management",
    items: [
      {
        title: "Tutor Profile",
        url: "/tutor-dashboard",
      },
      {
        title: "Manage Bookings",
        url: "/tutor-dashboard/manage-bookings",
      },
    ],
  },
];