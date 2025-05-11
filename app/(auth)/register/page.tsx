import RegisterForm from "@/app/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | The Solace Manor",
  description: "Register for a new account at The Solace Manor",
};

export default function RegisterPage() {
  return (
    <main className="w-full">
      <RegisterForm />
    </main>
  );
} 