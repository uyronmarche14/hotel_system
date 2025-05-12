import { ReactNode } from "react";
import Navbar from "@/app/components/normal/navbar";
import Footer from "@/app/components/normal/footer";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative z-40">
        <Navbar />
      </div>
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
} 