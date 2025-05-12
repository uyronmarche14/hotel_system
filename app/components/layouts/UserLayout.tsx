import { ReactNode } from "react";
import UserNavbar from "@/app/components/user/UserNavbar";
import Footer from "@/app/components/normal/footer";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative z-40">
        <UserNavbar />
      </div>
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
} 