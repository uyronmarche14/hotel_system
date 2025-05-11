"use client";

import { ReactNode } from "react";
import AuthHeader from "@/app/components/auth/header";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white w-full">
      <AuthHeader />
      <div className="flex-1 flex items-stretch w-full">
        {children}
      </div>
    </div>
  );
} 