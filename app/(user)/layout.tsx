import { ReactNode } from "react";
import type { Metadata } from "next";
import UserLayout from "@/app/components/layouts/UserLayout";

export const metadata: Metadata = {
  title: "User Portal | The Solace Manor",
  description: "Your personal portal for The Solace Manor",
};

export default function UserRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
} 