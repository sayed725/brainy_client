import { Route } from "../../types/routes.type";


export const adminRoutes: Route[] = [
  {
    title: "Admin Management",
    items: [
      {
        title: "Admin Dashboard",
        url: "/admin-dashboard",
      },
      {
        title: "Admin Profile",
        url: "/admin-profile",
      },
      {
        title: "Manage Users",
        url: "/manage-users",
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