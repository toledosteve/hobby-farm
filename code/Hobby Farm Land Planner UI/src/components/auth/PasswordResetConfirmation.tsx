import { Button } from "../ui/button";
import { AuthLayout } from "./AuthLayout";
import { CheckCircle } from "lucide-react";

interface PasswordResetConfirmationProps {
  onReturnToSignIn: () => void;
}

export function PasswordResetConfirmation({ onReturnToSignIn }: PasswordResetConfirmationProps) {
  return (
    <AuthLayout>
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Message */}
        <h1 className="mb-3">Check Your Email</h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          We&apos;ve sent a password reset link to your inbox. Click the link in the email to create a new password.
        </p>

        {/* Action */}
        <Button onClick={onReturnToSignIn} size="lg" className="min-w-[200px]">
          Return to Sign In
        </Button>

        {/* Additional Help */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive an email?{" "}
            <button className="text-primary hover:underline">
              Resend link
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
