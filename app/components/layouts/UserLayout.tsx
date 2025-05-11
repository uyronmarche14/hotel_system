import { ReactNode } from "react";
import UserNavbar from "@/app/components/user/UserNavbar";
import Footer from "@/app/components/normal/footer";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <>
      <UserNavbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
} 