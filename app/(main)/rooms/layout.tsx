import { ReactNode } from "react";
import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Rooms | The Anetos Palace",
  description: "Explore our luxurious rooms and suites at The Anetos Palace",
};

export default function RoomsLayout({
  children,
}: {
  children: ReactNode;
}) {
  // This layout inherits navbar and footer from the root layout
  return (
    <>
      {children}
    </>
  );
} 