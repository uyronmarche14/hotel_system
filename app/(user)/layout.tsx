import { ReactNode } from "react";
import type { Metadata } from "next";
import Navbar from "@/app/components/normal/navbar";
import Footer from "@/app/components/normal/footer";

export const metadata: Metadata = {
  title: "User Portal | The Solace Manor",
  description: "Your personal portal for The Solace Manor",
};

export default function UserRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
} 