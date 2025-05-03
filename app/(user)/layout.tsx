import { ReactNode } from "react";
import type { Metadata } from "next";
import "../globals.css";
import UserNavbar from "@/app/components/user/UserNavbar";
import Footer from "@/app/components/normal/footer";

export const metadata: Metadata = {
  title: "User Portal | The Anetos Palace",
  description: "Your personal portal for The Anetos Palace",
};

export default function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  // This layout uses the UserNavbar which has profile and notification elements
  return (
    <>
      <UserNavbar />
      {children}
      <Footer />
    </>
  );
} 