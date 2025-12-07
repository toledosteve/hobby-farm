import { Button } from "../ui/button";
import { AuthLayout } from "./AuthLayout";

interface WelcomeScreenProps {
  onSignIn: () => void;
  onCreateAccount: () => void;
}

export function WelcomeScreen({ onSignIn, onCreateAccount }: WelcomeScreenProps) {
  return (
    <AuthLayout>
      <div className="w-full max-w-2xl text-center">
        {/* Logo and Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Main logo */}
            <div className="flex items-center justify-center mb-6">
              <svg
                width="64"
                height="64"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="28" height="28" rx="6" fill="#2D5F3F" />
                <path
                  d="M14 8L19 14H16V20H12V14H9L14 8Z"
                  fill="#84A98C"
                />
                <path
                  d="M8 20H20"
                  stroke="#E8F0E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Abstract landscape shapes */}
            <div className="absolute -top-4 -left-20 w-32 h-32 opacity-20">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" fill="#84A98C" />
                <path d="M30 60 Q50 40 70 60 L70 80 L30 80 Z" fill="#2D5F3F" />
              </svg>
            </div>
            <div className="absolute -top-4 -right-20 w-32 h-32 opacity-20">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" fill="#84A98C" />
                <path d="M35 65 L50 45 L65 65 Z" fill="#2D5F3F" />
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-4">Welcome to Hobby Farm Planner</h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
          Map your land. Understand your soil. Plan your future.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-sm mx-auto">
          <Button
            onClick={onSignIn}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto min-w-[160px]"
          >
            Sign In
          </Button>
          <Button
            onClick={onCreateAccount}
            size="lg"
            className="w-full sm:w-auto min-w-[160px]"
          >
            Create Account
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
