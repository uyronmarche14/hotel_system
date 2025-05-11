import RegisterForm from "@/app/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | The Anetos Palace",
  description: "Register for a new account at The Anetos Palace",
};

export default function RegisterPage() {
  return (
    <main className="w-full">
      <RegisterForm />
    </main>
  );
} 