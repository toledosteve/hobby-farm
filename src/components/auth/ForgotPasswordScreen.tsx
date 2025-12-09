import { useState } from "react";
import { Button } from "../ui/button";
import { AuthLayout } from "./AuthLayout";
import { AuthCard } from "./AuthCard";
import { AuthInput } from "./AuthInput";
import { Alert, AlertDescription } from "../ui/alert";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/routes/routes";
import { toast } from "sonner";

export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    try {
      await requestPasswordReset(email);
      setSubmitted(true);
      toast.success("Password reset instructions sent!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send reset email");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError("");
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Reset Password"
        subtitle="Enter your email and we'll send you reset instructions."
      >
        {submitted ? (
          <div className="space-y-4">
            <Alert className="border-primary/50 bg-primary/5">
              <Mail className="h-4 w-4 text-primary" />
              <AlertDescription>
                Check your email for reset instructions.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => navigate(ROUTES.AUTH.SIGNIN)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Return to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="sarah@example.com"
              value={email}
              onChange={handleChange}
              error={error}
              required
            />

            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg">
                Send Reset Link
              </Button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate(ROUTES.AUTH.SIGNIN)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
