import { ReactNode } from "react";
import type { Metadata } from "next";
import Navbar from "@/app/components/normal/navbar";
import Footer from "@/app/components/normal/footer";

export const metadata: Metadata = {
  title: "The Solace Manor - Rooms & Suites",
  description: "Explore our luxurious rooms and suites",
};

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
} 