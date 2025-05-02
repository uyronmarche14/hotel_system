"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/components/normal/navbar";
import Footer from "@/app/components/normal/footer";
import { useEffect, useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    const hideNavbarPaths = [
      "/login",
      "/register",
      "/emailVerification",
      "/forgetPassword",
      "/resetPassword",
    ];

    // Check if current path exactly matches or starts with any of the hide paths
    const shouldHide = hideNavbarPaths.some(
      (path) => pathname === path || pathname?.startsWith(`${path}/`),
    );

    // For debugging - you can remove this after confirming it works
    console.log("Current path:", pathname);
    console.log("Should hide navbar:", shouldHide);

    setShowNavbar(!shouldHide);
  }, [pathname]);

  return (
    <>
      {showNavbar ? <Navbar /> : null}
      {children}
      {showNavbar ? <Footer /> : null}
    </>
  );
}
