import { Route } from "../../types/routes.type";


export const userRoutes: Route[] = [
  {
    title: "Student Management",
    items: [
      {
        title: "Student Dashboard",
        url: "/dashboard",
      },
      {
        title: "Student Profile",
        url: "/student-profile",
      },
      {
        title: "Manage Courses",
        url: "/manage-courses",
      },
      {
        title: "Manage Bookings",
        url: "/manage-bookings",
      }
    ],
  },
];