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
        url: "/dashboard/student-profile",
      },
      {
        title: "Manage Bookings",
        url: "/dashboard/manage-bookings",
      },
      {
        title: "Upgrade To Tutor",
        url: "/dashboard/upgrade-to-tutor",
      },
      {
        title: "ManageCourses",
        url: "/dashboard/manage-courses",
      },
    ],
  },
];