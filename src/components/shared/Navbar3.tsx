"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LogOut, LayoutDashboard, ChevronDown, GraduationCap, BookOpen, User, Users, Search, Flame, Package, ChevronRight } from "lucide-react";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  image?: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const {
    data: session,
    isPending, // loading state
    error,
    refetch,
  } = authClient.useSession();

  const { data: categories = [] } = useQuery({
    queryKey: ["navbarCategories"],
    queryFn: async () => {
      const result = await fetchApi<any>("/api/v1/categories", {
        params: { limit: 6, sortBy: "id", sortOrder: "asc", isActive: true }
      });
      const data = result?.data?.data || result?.data || result;
      return Array.isArray(data) ? (data as Category[]) : [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const menuItems = [
    { title: "Home", href: "/" },
    { 
      title: "Tutors", 
      href: "/tutors",
      subItems: categories.length > 0 ? categories.map(cat => ({
        title: cat.name,
        href: `/tutors?categoryName=${cat.name}`,
        icon: GraduationCap,
        description: `Explore tutors in ${cat.name}`,
        image: cat.image
      })) : [
        { title: "Web Development", href: "/tutors?categoryName=Web Development", icon: GraduationCap, description: "Learn math from experts", image: undefined },
        { title: "React.js", href: "/tutors?categoryName=React.js", icon: GraduationCap, description: "Master physics concepts", image: undefined },
        { title: "Next.js", href: "/tutors?categoryName=Next.js", icon: GraduationCap, description: "Master physics concepts", image: undefined },
        
      ]
    },
    ...(mounted && session?.user
      ? [
          {
            title: "Dashboard",
            href:
              session.user.role === "admin"
                ? "/admin-dashboard"
                : session.user.role === "tutor"
                ? "/tutor-dashboard"
                : "/dashboard",
          },
        ]
      : []),
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // console.log("Session in Navbar", session, isPending, error);

  const isAuthenticated = !!session?.user;
  const userInitial =
    session?.user?.name?.charAt(0)?.toUpperCase() ||
    session?.user?.email?.charAt(0)?.toUpperCase() ||
    "?";

  const handleLogout = async () => {
    await authClient.signOut();
    // Optional: refetch(); // if you want to force refresh
    // router.push("/login"); // if you have useRouter
  };

  // console.log("Fresh session after refetch:", session?.user);

  const closeMobileMenu = () => setIsOpen(false);

  // if (isPending) {
  //   return (
  //     <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
  //       <div className="container mx-auto px-4 lg:px-0 py-3">
  //         <div className="h-10 flex items-center justify-between">
  //           <div className="w-24 h-8 bg-muted animate-pulse rounded" />
  //           <div className="hidden lg:flex gap-8">
  //             <div className="w-16 h-5 bg-muted animate-pulse rounded" />
  //             <div className="w-16 h-5 bg-muted animate-pulse rounded" />
  //             <div className="w-16 h-5 bg-muted animate-pulse rounded" />
  //           </div>
  //           <div className="flex gap-4">
  //             <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
  //             <div className="w-24 h-10 bg-muted animate-pulse rounded" />
  //           </div>
  //         </div>
  //       </div>
  //     </nav>
  //   );
  // }

  return (
    <nav className="sticky  top-0 z-50 border-b bg-gray-100 dark:bg-gray-950 backdrop-blur-md">
      <div className="container mx-auto w-11/12 lg:w-full px-0 py-3">
        <div className="flex items-center justify-between">
          {/* Logo – unchanged */}
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center h-full">
            {menuItems.map((item) => (
              item.subItems ? (
                <div key={item.title} className="group/navItem relative flex items-center h-full py-4">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#1cb89e]",
                      pathname.startsWith(item.href) ? "text-[#1cb89e]" : "text-foreground/80"
                    )}
                  >
                    {item.title}
                    {/* <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover/navItem:rotate-180" /> */}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 translate-y-2 pointer-events-none group-hover/navItem:opacity-100 group-hover/navItem:translate-y-0 group-hover/navItem:pointer-events-auto transition-all duration-300 z-50">
                    <div className="w-[750px] rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col">
                      {/* <div className="p-4 bg-[#1cb89e]/5 dark:bg-[#1cb89e]/10 border-b border-[#1cb89e]/10 dark:border-slate-800">
                        <p className="font-bold text-[#1cb89e]">Browse Categories</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Find the perfect mentor for your learning journey</p>
                      </div> */}
                      <div className="grid grid-cols-3 gap-2 p-4">
                        {item.subItems.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <Link
                              key={sub.title}
                              href={sub.href}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#1cb89e]/5 dark:hover:bg-[#1cb89e]/10 transition-colors group/sub"
                            >
                              <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-[#1cb89e]/10 dark:border-[#1cb89e]/20">
                                {sub.image ? (
                                  <Image 
                                    src={sub.image} 
                                    alt={sub.title} 
                                    fill 
                                    sizes="48px"
                                    className="object-cover group-hover/sub:scale-110 transition-transform duration-500" 
                                  />
                                ) : (
                                  <div className="w-full h-full bg-[#1cb89e]/10 dark:bg-[#1cb89e]/20 flex items-center justify-center text-[#1cb89e]">
                                    <SubIcon className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-slate-900 dark:text-white group-hover/sub:text-[#1cb89e] transition-colors truncate">{sub.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{sub.description}</p>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                        {/* <Link href={item.href} className="flex items-center gap-2 text-sm font-bold text-[#1cb89e] hover:text-[#1cb89e]/80 transition-colors">
                          View All {item.title} <ChevronRight className="w-4 h-4" />
                        </Link> */}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors hover:text-[#1cb89e]",
                    pathname === item.href
                      ? "text-[#1cb89e]"
                      : "text-foreground/80",
                    "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-[#1cb89e] after:transition-all after:duration-300 hover:after:w-full",
                  )}
                >
                  {item.title}
                </Link>
              )
            ))}
          </div>

          {/* Desktop Right Side – now uses real session */}
          <div className="hidden lg:flex items-center gap-4">
            <ModeToggle />

            {mounted ? (
              isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-[#1cb89e] text-black font-bold">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
                    <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={
                              session?.user?.role === "tutor"
                                ? "/tutor-dashboard"
                                : session?.user?.role === "admin"
                                  ? "/admin-dashboard"
                                  : "/dashboard"
                            }>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:bg-red-50 dark:focus:bg-red-500"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                  <Button
                    asChild
                    className="bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
              )
            ) : (
              <div className="flex gap-4">
                <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
                <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger – unchanged structure */}
          <div className="flex items-center gap-2 lg:hidden">
            <ModeToggle />
            {mounted && isAuthenticated && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#1cb89e] text-black text-sm font-bold">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            )}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-10 w-10" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-75] sm:w-100">
                <SheetTitle className="sr-only">
                  Main Navigation Menu
                </SheetTitle>
                <SheetHeader className="mb-8">
                  <Link
                    href="/"
                    className="flex items-center gap-3"
                    onClick={closeMobileMenu}
                  >
                    <img
                      src="/brainy_logo-removebg-preview.png"
                      alt="Brainy Logo"
                      className="h-10 w-10"
                    />
                    <span className="text-2xl font-bold">Brainy</span>
                  </Link>
                </SheetHeader>

                <nav className="flex flex-col gap-6 ml-5">
                  {menuItems.map((item) => (
                    <div key={item.title} className="space-y-3">
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={cn(
                          "text-lg font-bold transition-colors flex items-center justify-between",
                          pathname === item.href
                            ? "text-[#1cb89e]"
                            : "text-foreground/80 hover:text-[#1cb89e]",
                        )}
                      >
                        {item.title}
                      </Link>
                      
                      {item.subItems && (
                        <div className="flex flex-col gap-3 ml-4 border-l pl-4">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={closeMobileMenu}
                              className="text-sm text-muted-foreground hover:text-[#1cb89e] transition-colors"
                            >
                              {subItem.title}
                            </Link>
                          ))}
                          <Link
                            href={item.href}
                            onClick={closeMobileMenu}
                            className="text-sm font-bold text-[#1cb89e]"
                          >
                            View All {item.title}
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="border-t pt-6 mt-6 space-y-3">
                    {mounted ? (
                      isAuthenticated ? (
                        <>
                          <Link
                            href={
                              session?.user?.role === "tutor"
                                ? "/tutor-dashboard"
                                : session?.user?.role === "admin"
                                  ? "/admin-dashboard"
                                  : "/dashboard"
                            }
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 text-lg"
                          >
                            <LayoutDashboard className="h-5 w-5" />
                            Dashboard
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              closeMobileMenu();
                            }}
                            className="flex items-center gap-3 text-lg text-red-600 w-full text-left"
                          >
                            <LogOut className="h-5 w-5" />
                            Log Out
                          </button>
                        </>
                      ) : (
                          <Button
                            asChild
                            className="w-full bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white"
                          >
                            <Link href="/login" onClick={closeMobileMenu}>
                              Login
                            </Link>
                          </Button>
                      )
                    ) : (
                      <div className="space-y-3">
                        <div className="w-full h-10 bg-muted animate-pulse rounded-md" />
                        <div className="w-full h-10 bg-muted animate-pulse rounded-md" />
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
