"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { LogOut, Menu, CircleX, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "../layout/ModeToggle";

import { useState, useEffect } from "react";

export default function Navbar2() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogOut = () => {
    // logout();
    // setIsLoading(true);
    // if (protectedRoutes.some((route) => pathname.match(route))) {
    //   router.push("/");
    // }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isMegaMenuOpen) {
        setIsMegaMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMegaMenuOpen]);

  return (
    <header className="border-b bg-secondary w-full sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <CircleX className="text-primary" size={20} />
              ) : (
                <Menu className="text-primary" size={20} />
              )}
            </button>

            <Link href="/" className="shrink-0">
              <div className="relative w-30 h-10 md:w-40 md:h-16">
                <Image
                  src="/logo.png"
                  alt="SwiftCart Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 7rem, (max-width: 1024px) 10rem, 12rem"
                />
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="  ">
              Home
            </Link>

            <Link href="/blogs" className="text-primary font-medium ">
              Blogs
            </Link>

            <Link href="/about" className="text-primary font-medium ">
              About
            </Link>

            <Link href="/about" className="text-primary font-medium ">
              Dashboard
            </Link>
          </div>

          {/* Right Side Navigation */}
          <nav className="flex items-center gap-2">
            <div>
                <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarFallback className="text-2xl font-bold bg-indigo-500 text-white cursor-pointer">
                      X
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[200px]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/orders-details">Order Details</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/delivery">Delivery Address</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className=" cursor-pointer focus:bg-red-50"
                    onClick={handleLogOut}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 cursor-pointer focus:bg-red-50"
                    onClick={handleLogOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <Link href="/login">
                <Button
                  className="bg-primary text-secondary font-semibold hover:text-primary hover:bg-secondary hover:border-primary"
                  variant="outline"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="bg-primary text-secondary font-semibold hover:text-primary hover:bg-secondary hover:border-primary"
                  variant="outline"
                >
                  Register
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}