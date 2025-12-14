import { useState } from "react";
import { VideoBackground } from "./VideoBackground";

interface AuthLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function AuthLayout({ children, showFooter = true }: AuthLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleVideoReady = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Full-screen Video Background with overlay */}
      <VideoBackground onReady={handleVideoReady} />

      {/* Content */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-12 z-10">
        {children}
      </div>

      {/* Footer */}
      {showFooter && (
        <footer className="relative z-10 py-6 text-center text-sm text-white backdrop-blur-sm">
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="hover:text-white/80 transition-colors">
              Privacy
            </a>
            <span>·</span>
            <a href="#" className="hover:text-white/80 transition-colors">
              Terms
            </a>
            <span>·</span>
            <a href="#" className="hover:text-white/80 transition-colors">
              Support
            </a>
          </div>
        </footer>
      )}

      {/* Full-page loading overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917] transition-opacity duration-500 ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-[#2D5F3F] rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </div>
    </div>
  );
}
