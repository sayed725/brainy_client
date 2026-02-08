import { Route } from "../../types/routes.type";


export const tutorRoutes: Route[] = [
  {
    title: "Tutor Management",
    items: [
        {
        title: "Tutor Dashboard",
        url: "/tutor-dashboard",
      },
      {
        title: "Tutor Profile",
        url: "/tutor-profile",
      },
      {
        title: "Manage Courses",
        url: "/manage-courses",
      },
      {
        title: "Manage Bookings",
        url: "/manage-bookings",
      },
    ],
  },
];