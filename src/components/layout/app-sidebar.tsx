"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { Route } from "@/types/routes.type";
import { adminRoutes } from "@/app/routes/adminRoutes";
import { userRoutes } from "@/app/routes/userRoutes";
import { tutorRoutes } from "@/app/routes/tutorRoutes";
import { ModeToggle } from "./ModeToggle";

export function AppSidebar({
  user,
  ...props
}: {
  user: { role: string; name?: string; email?: string };
} & React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
 
  React.useEffect(() => {
    setMounted(true);
  }, []);
 
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

  if (!mounted) {
    return <Sidebar collapsible="icon" {...props} />;
  }
 
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/brainy_logo-removebg-preview.png"
              alt="Brainy Logo"
              className="h-8 w-8 sm:h-10 sm:w-10"
            />
            <span className="text-2xl font-bold tracking-tight sm:text-3xl group-data-[collapsible=icon]:hidden">
              Brainy
            </span>
          </Link>
          <div className="justify-end group-data-[collapsible=icon]:hidden">
            <ModeToggle />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {routes.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild tooltip={subItem.title}>
                      <Link href={subItem.url} className="flex items-center gap-2">
                         <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-200 text-slate-700 font-bold text-xs shrink-0">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-foreground">
                      {user.name || user.email?.split("@")[0]}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-200 text-slate-700 font-bold">
                      {user.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-foreground">
                        My Account
                      </span>
                      <span className="truncate text-sm text-muted-foreground capitalize">
                        {user.role?.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await authClient.signOut();
                    router.push("/");
                    toast.success("Logged out successfully");
                    router.refresh();
                  }}
                  className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="mr-0.5 size-4 mt-0.5" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}