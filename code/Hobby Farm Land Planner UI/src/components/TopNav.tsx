import { ChevronDown, User } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface TopNavProps {
  currentProject?: {
    name: string;
    acres: number;
  };
  onBackToDashboard: () => void;
  onLogout?: () => void;
}

export function TopNav({ currentProject, onBackToDashboard, onLogout }: TopNavProps) {
  return (
    <nav className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-2">
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
      </div>

      <div className="flex items-center gap-4">
        {currentProject && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span>{currentProject.name} – {currentProject.acres} acres</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{currentProject.name}</DropdownMenuItem>
              <DropdownMenuItem onClick={onBackToDashboard}>Switch Project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}