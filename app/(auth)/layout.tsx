import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { Cinzel_Decorative } from "next/font/google";
import AuthLayout from "@/app/components/layouts/AuthLayout";
import type { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-inter",
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Authentication | The Solace Manor",
  description: "Login or register for The Solace Manor",
};

export default function AuthRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={`${geistSans.variable} ${inter.variable} ${cinzelDecorative.variable} font-sans antialiased`}>
      <AuthLayout>{children}</AuthLayout>
    </div>
  );
} 