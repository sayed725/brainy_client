import { Route } from "../../types/routes.type";


export const userRoutes: Route[] = [
  {
    title: "Student Management",
    items: [
      {
        title: "Student Profile",
        url: "/dashboard",
      },
      {
        title: "Manage Bookings",
        url: "/dashboard/manage-bookings",
      },
      {
        title: "Upgrade To Tutor",
        url: "/dashboard/upgrade-to-tutor",
      },
    ],
  },
];