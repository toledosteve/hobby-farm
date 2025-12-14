import { Button } from "../ui/button";
import { AuthLayout } from "./AuthLayout";
import { Sprout, MapPin, TrendingUp } from "lucide-react";

interface WelcomeScreenAltProps {
  onSignIn: () => void;
  onCreateAccount: () => void;
}

/**
 * Alternative Welcome Screen Design
 * 
 * This version uses a solid dark semi-transparent panel behind the content
 * for MAXIMUM text contrast on any video background.
 * 
 * To use this version instead of the default:
 * 1. In App.tsx, import WelcomeScreenAlt instead of WelcomeScreen
 * 2. Replace <WelcomeScreen> with <WelcomeScreenAlt>
 */
export function WelcomeScreenAlt({ onSignIn, onCreateAccount }: WelcomeScreenAltProps) {
  return (
    <AuthLayout>
      <div className="w-full max-w-5xl">
        {/* Solid Dark Panel for Maximum Contrast */}
        <div className="backdrop-blur-3xl bg-black/70 border border-white/20 rounded-3xl p-12 md:p-16 shadow-2xl">
          <div className="text-center">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-2xl ring-4 ring-white/30">
                <svg
                  width="40"
                  height="40"
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

            {/* Main Heading - No shadow needed on dark background */}
            <h1 className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tight">
              Welcome to Hobby Farm Planner
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
              Map your land. Understand your soil. Plan your future.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-8">
              <Button
                onClick={onCreateAccount}
                size="lg"
                className="w-full sm:w-auto min-w-[200px] text-base h-12 bg-primary hover:bg-primary/90 shadow-lg"
              >
                Create Account
              </Button>
              <Button
                onClick={onSignIn}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[200px] text-base h-12 bg-white/95 hover:bg-white text-foreground border-0 shadow-lg"
              >
                Sign In
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto pt-6 border-t border-white/20">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Interactive Maps</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                <Sprout className="w-4 h-4" />
                <span className="text-sm font-medium">Crop Planning</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Track Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
