import LoginForm from "@/app/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | The Solace Manor",
  description: "Log in to your account at The Solace Manor",
};

export default function LoginPage() {
  return (
    <main className="w-full">
      <LoginForm />
    </main>
  );
} 