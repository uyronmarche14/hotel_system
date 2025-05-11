import { ReactNode } from "react";
import type { Metadata } from "next";
import MainLayout from "@/app/components/layouts/MainLayout";

export const metadata: Metadata = {
  title: "The Anetos Palace",
  description: "Experience luxury beyond comparison at The Anetos Palace",
};

export default function MainRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
} 