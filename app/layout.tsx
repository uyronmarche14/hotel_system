import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { Cinzel_Decorative } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";

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
  weight: ["700"], // Only include weights you need
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Solace Manor",
  description: "Experience luxury beyond comparison at The Solace Manor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`w-full min-h-screen overflow-x-hidden ${geistSans.variable} ${inter.variable} ${cinzelDecorative.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
