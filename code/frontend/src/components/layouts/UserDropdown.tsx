import { useState } from "react";
import {
  User,
  Settings,
  LogOut,
  HelpCircle,
  MessageSquare,
  Send,
  Moon,
  Sun,
  ChevronRight,
  Sprout,
  Plus,
} from "lucide-react";
import { useTheme } from "@/contexts";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../ui/utils";

interface Farm {
  id: string;
  name: string;
}

interface UserDropdownProps {
  userName?: string;
  userEmail?: string;
  userInitials?: string;
  profilePhotoUrl?: string;
  farms?: Farm[];
  currentFarmId?: string;
  onManageAccount?: () => void;
  onSwitchFarm?: (farmId: string) => void;
  onAddNewFarm?: () => void;
  onViewAllFarms?: () => void;
  onHelpCenter?: () => void;
  onContactSupport?: () => void;
  onSubmitFeedback?: () => void;
  onLogout?: () => void;
  onTabChange?: (tab: "settings") => void;
}

export function UserDropdown({
  userName,
  userEmail,
  userInitials,
  profilePhotoUrl,
  farms = [],
  currentFarmId,
  onManageAccount,
  onSwitchFarm,
  onAddNewFarm,
  onViewAllFarms,
  onHelpCenter,
  onContactSupport,
  onSubmitFeedback,
  onLogout,
  onTabChange,
}: UserDropdownProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full p-0 hover:bg-muted"
        >
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
            {profilePhotoUrl ? (
              <img
                src={profilePhotoUrl}
                alt={userName || 'User'}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm text-primary">{userInitials || <User className="h-4 w-4" />}</span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[320px] p-0 z-[1200]">
        {/* User Identity Block */}
        <div className="p-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 flex-shrink-0 overflow-hidden">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt={userName || 'User'}
                  className="h-full w-full object-cover"
                />
              ) : userInitials ? (
                <span className="text-base text-primary">{userInitials}</span>
              ) : (
                <User className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate">{userName || 'Loading...'}</div>
              <div className="text-sm text-muted-foreground truncate">
                {userEmail || 'Loading...'}
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator key="separator-1" className="my-0" />

        {/* Account Management Section */}
        <div className="p-1.5">
          <DropdownMenuItem
            key="manage-account"
            className="cursor-pointer py-2.5 px-3 rounded-lg"
            onClick={onManageAccount}
          >
            <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
            <span>Manage Account</span>
          </DropdownMenuItem>

          {/* Switch Farm - Submenu */}
          {farms && farms.length > 0 && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer py-2.5 px-3 rounded-lg">
                <Sprout className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>Switch Farm</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-[240px] p-1.5">
                <>
                  {farms.map((farm) => (
                    <DropdownMenuItem
                      key={farm.id}
                      className={cn(
                        "cursor-pointer py-2.5 px-3 rounded-lg",
                        currentFarmId === farm.id && "bg-primary/5 text-primary"
                      )}
                      onClick={() => onSwitchFarm?.(farm.id)}
                    >
                      <span>{farm.name}</span>
                      {currentFarmId === farm.id && (
                        <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator key="farm-separator" className="my-1.5" />
                  <DropdownMenuItem
                    key="add-new-farm"
                    className="cursor-pointer py-2.5 px-3 rounded-lg text-primary"
                    onClick={onAddNewFarm}
                  >
                    <Plus className="mr-3 h-4 w-4" />
                    <span>Add New Farm</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    key="view-all-farms"
                    className="cursor-pointer py-2.5 px-3 rounded-lg"
                    onClick={onViewAllFarms}
                  >
                    <Sprout className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span>View All Farms</span>
                  </DropdownMenuItem>
                </>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
        </div>

        <DropdownMenuSeparator key="separator-2" className="my-0" />

        {/* Help & Support Section */}
        <div className="p-1.5">
          <DropdownMenuItem
            key="help-center"
            className="cursor-pointer py-2.5 px-3 rounded-lg"
            onClick={onHelpCenter}
          >
            <HelpCircle className="mr-3 h-4 w-4 text-muted-foreground" />
            <span>Help Center</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            key="contact-support"
            className="cursor-pointer py-2.5 px-3 rounded-lg"
            onClick={onContactSupport}
          >
            <MessageSquare className="mr-3 h-4 w-4 text-muted-foreground" />
            <span>Contact Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            key="submit-feedback"
            className="cursor-pointer py-2.5 px-3 rounded-lg"
            onClick={onSubmitFeedback}
          >
            <Send className="mr-3 h-4 w-4 text-muted-foreground" />
            <span>Submit Feedback</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator key="separator-3" className="my-0" />

        {/* Preferences Section */}
        <div className="p-1.5">
          <div
            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted cursor-pointer"
            onClick={toggleTheme}
          >
            <div className="flex items-center">
              {isDark ? (
                <Moon className="mr-3 h-4 w-4 text-muted-foreground" />
              ) : (
                <Sun className="mr-3 h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">Dark Mode</span>
            </div>
            <button
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                isDark ? "bg-primary" : "bg-muted-foreground/20"
              )}
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
                  isDark ? "translate-x-5" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
        </div>

        <DropdownMenuSeparator key="separator-4" className="my-0" />

        {/* Logout Section */}
        <div className="p-1.5">
          <DropdownMenuItem
            key="logout"
            className="cursor-pointer py-2.5 px-3 rounded-lg text-destructive focus:text-destructive"
            onClick={onLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}