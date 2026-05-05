import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { cookies } from "next/headers";


import { headers } from "next/headers";

export default async function DashboardLayout({
  admin,
  user,
  tutor
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  user: React.ReactNode;
  tutor: React.ReactNode;
}) {
  

  const cookieStore = await cookies();
  const authUrl = process.env.AUTH_URL;
  let sessionData = null;

  if (authUrl) {
    try {
      const res = await fetch(`${authUrl}/get-session`, {
        method: "GET",
        headers: {
          Cookie: cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; "),
          Accept: "application/json",
        },
        cache: "no-store",
      });
      if (res.ok) {
        sessionData = await res.json();
      }
    } catch (err) {
      console.error("Failed to fetch session:", err);
    }
  }

  if (!sessionData || !sessionData.user) {
    return <div className="p-4">You must be logged in to access the dashboard.</div>;
  }
  
  const userInfo = { ...sessionData.user, role: sessionData.user.role || 'STUDENT' };

//  console.log(userInfo)

  return (
    <SidebarProvider>
      <AppSidebar user ={userInfo} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2  px-4">
          <SidebarTrigger className="-ml-1" />
          {/* <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          /> */}
          {/* <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {userInfo.role === 'STUDENT' ? user : userInfo.role === 'ADMIN' ? admin : userInfo.role === 'TUTOR' ? tutor : user}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}