interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10 pointer-events-none" />
      
      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>

      {/* Footer */}
      <footer className="relative py-6 text-center text-sm text-muted-foreground border-t border-border/50">
        <div className="flex items-center justify-center gap-4">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <span>·</span>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms
          </a>
        </div>
      </footer>
    </div>
  );
}
