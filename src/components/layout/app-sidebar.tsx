import * as React from "react";

import { SearchForm } from "@/components/layout/search-form";
import { VersionSwitcher } from "@/components/layout/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

import { Route } from "@/types/routes.type";
import { adminRoutes } from "@/app/routes/adminRoutes";
import { userRoutes } from "@/app/routes/userRoutes";
import { tutorRoutes } from "@/app/routes/tutorRoutes";
import { ModeToggle } from "./ModeToggle";


export function AppSidebar({
  user,
  ...props
}: {
  user: { role: string } & React.ComponentProps<typeof Sidebar>;
}) {
  let routes: Route[] = [];

  switch (user.role) {
    case "ADMIN":
      routes = adminRoutes;
      break;
    case "STUDENT":
      routes = userRoutes;
      break;
      case "TUTOR":
      routes = tutorRoutes;
      break;
    default:
      routes = [];
      break;
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader >
       <div className="flex justify-between items-center pb-2 border-b border-gray-200">
         <Link href="/" className="flex items-center gap-3">
            <img
              src="/brainy_logo-removebg-preview.png"
              alt="Brainy Logo"
              className="h-8 w-8 sm:h-10 sm:w-10"
            />
            <span className="text-2xl font-bold tracking-tight sm:text-3xl">
              Brainy
            </span>
          </Link>
            <div className="justify-end">
               <ModeToggle/>
             </div>
       </div>
      </SidebarHeader>
  
      <SidebarContent>
        {routes.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem className="" key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}