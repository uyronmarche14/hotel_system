import { ReactNode } from "react";
import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/app/components/normal/navbar";
import Footer from "@/app/components/normal/footer";

export const metadata: Metadata = {
  title: "The Anetos Palace",
  description: "Experience luxury beyond comparison at The Anetos Palace",
};

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Add navbar and footer only for main pages
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
} 