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
        title: "Profile",
        url: "/tutor-dashboard/tutor-profile",
      },
      {
        title: "Manage Courses",
        url: "/tutor-dashboard/manage-courses",
      },
      {
        title: "Manage Bookings",
        url: "/tutor-dashboard/manage-bookings",
      },
    ],
  },
];