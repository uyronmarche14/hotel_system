import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/normal/footer";
import Navbar from "@/app/components/normal/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
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
  title: "Authentication",
  description: "Login and registration pages",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`inter w-full min-h-screen overflow-x-hidden ${geistSans.variable} ${inter.variable} ${cinzelDecorative.variable} font-sans antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
