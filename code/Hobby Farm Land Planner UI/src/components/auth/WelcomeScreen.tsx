import { Button } from "../ui/button";
import { AuthLayout } from "./AuthLayout";
import { Sprout, MapPin, TrendingUp } from "lucide-react";

interface WelcomeScreenProps {
  onSignIn: () => void;
  onCreateAccount: () => void;
}

export function WelcomeScreen({ onSignIn, onCreateAccount }: WelcomeScreenProps) {
  return (
    <AuthLayout>
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl ring-4 ring-white/20">
              <svg
                width="32"
                height="32"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 8L19 14H16V20H12V14H9L14 8Z"
                  fill="white"
                />
                <path
                  d="M8 20H20"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Main Heading with Strong Shadow */}
          <h1 className="text-5xl md:text-6xl font-semibold text-white mb-4 tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            Welcome to Hobby Farm Planner
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Map your land. Understand your soil. Plan your future.
          </p>

          {/* Glass Card with Action Buttons - Enhanced backdrop */}
          <div className="max-w-md mx-auto backdrop-blur-2xl bg-white/15 border border-white/30 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col gap-3 mb-6">
              <Button
                onClick={onCreateAccount}
                size="lg"
                className="w-full text-base h-12 bg-primary hover:bg-primary/90 shadow-lg"
              >
                Create Account
              </Button>
              <Button
                onClick={onSignIn}
                variant="outline"
                size="lg"
                className="w-full text-base h-12 bg-white/90 hover:bg-white text-foreground border-0 shadow-lg"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Pills with Enhanced Background */}
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white shadow-lg">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium drop-shadow-md">Interactive Maps</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white shadow-lg">
            <Sprout className="w-4 h-4" />
            <span className="text-sm font-medium drop-shadow-md">Crop Planning</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white shadow-lg">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium drop-shadow-md">Track Progress</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}