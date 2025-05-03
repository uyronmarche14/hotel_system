import LoginForm from "@/app/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | The Anetos Palace",
  description: "Log in to your account at The Anetos Palace",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      <div className="flex flex-1">
        <LoginForm />
      </div>
    </main>
  );
} 