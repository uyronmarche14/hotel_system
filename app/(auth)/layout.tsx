import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { Cinzel_Decorative } from "next/font/google";
import "../globals.css";

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
  title: "Authentication | The Anetos Palace",
  description: "Login or register for The Anetos Palace",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This layout doesn't include Navbar or Footer components
  return (
    <div className={`w-full min-h-screen ${geistSans.variable} ${inter.variable} ${cinzelDecorative.variable} font-sans antialiased`}>
      {children}
    </div>
  );
} 