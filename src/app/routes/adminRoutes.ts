import { Route } from "../../types/routes.type";


export const adminRoutes: Route[] = [
  {
    title: "Admin Management",
    items: [
      {
        title: "Dashboard",
        url: "/admin-dashboard",
      },
      {
        title: "Profile",
        url: "/admin-dashboard/admin-profile",
      },
      {
        title: "Manage Users",
        url: "/admin-dashboard/manage-users",
      },
      {
        title: "Manage Category",
        url: "/admin-dashboard/manage-categories",
      },
      {
        title: "Manage Bookings",
        url: "/admin-dashboard/manage-bookings",
      },
    ],
  },
];