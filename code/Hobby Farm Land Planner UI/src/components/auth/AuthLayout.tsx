import { VideoBackground } from "./VideoBackground";

interface AuthLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function AuthLayout({ children, showFooter = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Full-screen Video Background */}
      <VideoBackground />
      
      {/* Content */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-12 z-10">
        {children}
      </div>

      {/* Footer */}
      {showFooter && (
        <footer className="relative z-10 py-6 text-center text-sm text-white/70 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">
              Support
            </a>
          </div>
        </footer>
      )}
    </div>
  );
}
