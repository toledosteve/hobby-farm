import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function AuthCard({ children, title, subtitle, onBack }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      {/* Glassmorphic Card */}
      <div className="backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl p-8">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {/* Header */}
        <div className="mb-6 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <svg
                width="24"
                height="24"
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
          
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        {children}
      </div>
    </div>
  );
}
