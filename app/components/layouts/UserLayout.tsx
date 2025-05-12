import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image 
              src="/images/hotel-logo.png" 
              alt="The Solace Manor Logo" 
              width={40} 
              height={40}
              className="rounded-full"
            />
            <span className="font-cinzel text-xl">The Solace Manor</span>
          </Link>
          
          <nav>
            <ul className="flex gap-6">
              <li>
                <Link href="/dashboard" className="hover:text-amber-300 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="hover:text-amber-300 transition">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-amber-300 transition">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/logout" className="hover:text-amber-300 transition">
                  Logout
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-zinc-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} The Solace Manor. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center gap-4 text-sm">
            <Link href="/terms" className="hover:text-amber-300 transition">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-amber-300 transition">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-amber-300 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 