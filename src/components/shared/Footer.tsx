// components/ResponsiveFooter.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaAngleRight, 
  FaChevronUp 
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white pt-12 pb-8">
      {/* Main footer content */}
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Logo + Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img
                src="/brainy_logo-removebg-preview.png"
                alt="Brainy Logo"
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
              <span className="text-3xl sm:text-4xl font-bold tracking-tight">
                Brainy
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Brainy is a platform where parents, students and tutors can easily connect with each other. We provide qualified Home/Online tutors to help your child with studies and helping them perform
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link 
                  href="/" 
                  className="hover:text-[#1cb89e] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/services" 
                  className="hover:text-[#1cb89e] transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="hover:text-[#1cb89e] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="hover:text-[#1cb89e] transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>

            {/* Newsletter signup */}
            <div className="mt-10">
              <h4 className="text-lg font-medium mb-4">Stay Updated</h4>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md">
                <Input
                  type="email"
                  placeholder="Your email address"
                  required
                  className="bg-[#1f1f1f] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#1cb89e] focus:ring-[#c8f21d]/30"
                />
                <Button 
                  type="submit"
                  className="bg-[#1cb89e] hover:bg-white text-black font-medium whitespace-nowrap"
                >
                  Subscribe <FaAngleRight className="ml-2" />
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact</h3>
            <div className="space-y-4 text-gray-400">
              <p className="flex items-start">
                <FaMapMarkerAlt className="mr-3 mt-1 text-[#1cb89e] flex-shrink-0" />
                55 Main Street, 2nd block,<br className="sm:hidden" /> New York City
              </p>
              <p className="flex items-center">
                <FaEnvelope className="mr-3 text-[#1cb89e] flex-shrink-0" />
                abusayedkhan.pro@gmail.com
              </p>
              <p className="flex items-center">
                <FaPhoneAlt className="mr-3 text-[#1cb89e] flex-shrink-0" />
                +880 1627142598
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top + Copyright */}
      <div className="mt-16 border-t border-gray-800 pt-8">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400 text-sm">
            <p>
              © {new Date().getFullYear()} <span className="text-[#1cb89e]">Brainy</span>. 
              All rights reserved.
            </p>

            <div className="flex gap-6">
              <a 
                href="https://www.facebook.com/abu.ssayed.khan.2024" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#1cb89e] transition-colors"
              >
                Facebook
              </a>
              <a 
                href="https://github.com/sayed725" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#1cb89e] transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://www.linkedin.com/in/abu-sayed-khan-922801317" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#1cb89e] transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <div className="fixed bottom-8 right-8 z-50 md:bottom-12 md:right-12">
        <a 
          href="#top" 
          className="block"
          aria-label="Back to top"
        >
          <Button 
            size="icon" 
            className="rounded-full bg-[#1cb89e] hover:bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300 h-12 w-12"
          >
            <FaChevronUp className="h-5 w-5" />
          </Button>
        </a>
      </div>
    </footer>
  );
}