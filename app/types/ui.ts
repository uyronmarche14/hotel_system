export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "info";

export type ALinkVariant = "primary" | "secondary" | "link";

export type Size = "sm" | "md" | "lg";

export interface BaseProps {
  className?: string;
  disabled?: boolean;
  size?: Size;
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
}

export const formFields: FormField[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter your name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your password",
  },
  {
    name: "studentId",
    label: "Student ID",
    type: "text",
    placeholder: "Enter your student ID",
  },
] as const;
