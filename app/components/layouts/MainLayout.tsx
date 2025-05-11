import { ReactNode } from "react";
import Navbar from "@/app/components/normal/navbar";
import Footer from "@/app/components/normal/footer";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
} 