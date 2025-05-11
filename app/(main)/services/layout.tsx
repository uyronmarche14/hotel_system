import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | The Anetos Palace",
  description: "Explore our wide range of luxury accommodations and services at The Anetos Palace.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col">
      {children}
    </main>
  );
} 