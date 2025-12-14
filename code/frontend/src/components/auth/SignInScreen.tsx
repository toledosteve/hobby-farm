import { useState } from "react";
import { Button } from "../ui/button";
import { AuthLayout } from "./AuthLayout";
import { AuthCard } from "./AuthCard";
import { AuthInput } from "./AuthInput";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/routes/routes";
import { toast } from "sonner";

export function SignInScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await login(formData.email, formData.password);
        toast.success("Welcome back!");
        navigate(ROUTES.PROJECTS);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to sign in");
      }
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <AuthLayout>
      <AuthCard title="Sign In" subtitle="Welcome back.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="sarah@example.com"
            value={formData.email}
            onChange={handleChange("email")}
            error={errors.email}
            required
          />

          <AuthInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange("password")}
            error={errors.password}
            required
          />

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => navigate(ROUTES.AUTH.FORGOT_PASSWORD)}
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account? </span>
          <button
            type="button"
            onClick={() => navigate(ROUTES.AUTH.SIGNUP)}
            className="text-primary hover:underline"
          >
            Create one
          </button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
