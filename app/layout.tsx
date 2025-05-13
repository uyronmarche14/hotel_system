'use client';

import "./globals.css";
import { Inter, Cinzel_Decorative } from "next/font/google";
import { Geist } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";

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
  weight: ["700"], // Only include weights you need
  variable: "--font-cinzel",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`inter w-full min-h-screen overflow-x-hidden ${geistSans.variable} ${inter.variable} ${cinzelDecorative.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
