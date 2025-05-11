import ForgotPasswordForm from "@/app/components/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | The Solace Manor",
  description: "Reset your password for The Solace Manor",
};

export default function ForgotPasswordPage() {
  return (
    <main className="w-full">
      <ForgotPasswordForm />
    </main>
  );
} 