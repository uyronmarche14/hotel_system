import ForgotPasswordForm from "@/app/components/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | The Anetos Palace",
  description: "Reset your password for The Anetos Palace",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen">
      <div className="flex flex-1">
        <ForgotPasswordForm />
      </div>
    </main>
  );
} 