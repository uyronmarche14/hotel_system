import { ReactNode } from "react";
import type { Metadata } from "next";
import UserLayout from "@/app/components/layouts/UserLayout";

export const metadata: Metadata = {
  title: "User Portal | The Anetos Palace",
  description: "Your personal portal for The Anetos Palace",
};

export default function UserRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
} 