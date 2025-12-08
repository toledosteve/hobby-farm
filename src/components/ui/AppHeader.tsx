import { UserDropdown } from "../layouts/UserDropdown";

interface AppHeaderProps {
  onLogout?: () => void;
}

export function AppHeader({ onLogout }: AppHeaderProps) {
  return (
    <nav className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <svg
          width="28"
          height="28"
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
        <h1 className="text-lg text-foreground">Hobby Farm Planner</h1>
      </div>

      <UserDropdown
        onManageAccount={() => {
          console.log('Navigate to settings - not available on this screen');
        }}
        onLogout={onLogout}
        onHelpCenter={() => {
          window.open('https://help.hobbyfarmplanner.com', '_blank');
        }}
        onContactSupport={() => {
          window.open('mailto:support@hobbyfarmplanner.com', '_blank');
        }}
        onSubmitFeedback={() => {
          console.log('Submit feedback');
        }}
      />
    </nav>
  );
}
