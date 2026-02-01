// components/Navbar.tsx
"use client";

import { useState } from "react";
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
import { Menu, LogOut, LayoutDashboard } from "lucide-react";
import { ModeToggle } from "@/components/layout/ModeToggle"; // Adjust path if needed

// Optional: Replace with real user data later
const isAuthenticated = false; // Set dynamically based on auth state
const userInitial = "A"; // e.g., from user.name or email

const menuItems = [
  { title: "Home", href: "/" },
  { title: "Tutors", href: "/tutor" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    console.log("Logging out...");
    // router.push("/login");
  };

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-0 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
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
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-[#1cb89e]",
                  pathname === item.href
                    ? "text-[#1cb89e]"
                    : "text-foreground/80",
                  "after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[#1cb89e] after:transition-all after:duration-300 hover:after:w-full"
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            <ModeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#1cb89e] text-black font-bold">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-black">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <ModeToggle />
            {isAuthenticated && (
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
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Main Navigation Menu</SheetTitle>
                <SheetHeader className="mb-8">
                  <Link href="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
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
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "text-lg font-medium transition-colors",
                        pathname === item.href
                          ? "text-[#1cb89e]"
                          : "text-foreground/80 hover:text-[#1cb89e]"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}

                  <div className="border-t pt-6 mt-6 space-y-3">
                    {isAuthenticated ? (
                      <>
                        <Link
                          href="/dashboard"
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
                          className="flex items-center gap-3 text-lg text-red-600 w-full"
                        >
                          <LogOut className="h-5 w-5" />
                          Log Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/login" onClick={closeMobileMenu}>
                            Login
                          </Link>
                        </Button>
                        <Button asChild className="w-full bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-black">
                          <Link href="/register" onClick={closeMobileMenu}>
                            Register
                          </Link>
                        </Button>
                      </>
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