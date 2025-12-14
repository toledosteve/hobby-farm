import { MapPin, MoreVertical, Pencil, Copy, Trash2 } from "lucide-react";
import { Card } from "./card";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface ProjectCardProps {
  name: string;
  city?: string;
  state?: string;
  acres?: number;
  onClick?: () => void;
  onDelete?: () => void;
  onRename?: () => void;
  onDuplicate?: () => void;
}

export function ProjectCard({ name, city, state, acres, onClick, onDelete, onRename, onDuplicate }: ProjectCardProps) {
  const displayLocation = [city, state].filter(Boolean).join(', ') || 'No location set';

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group relative"
      onClick={onClick}
    >
      {/* Menu Button */}
      {(onDelete || onRename || onDuplicate) && (
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={handleMenuClick}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-card/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onRename && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRename(); }}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Map preview placeholder */}
      <div className="h-40 bg-gradient-to-br from-secondary to-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          {acres && (
            <div className="px-2 py-1 bg-card/90 backdrop-blur-sm rounded text-xs">
              {acres} acres
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="mb-1 group-hover:text-primary transition-colors">{name}</h3>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <MapPin className="w-3.5 h-3.5" />
          <span>{displayLocation}</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 group-hover:bg-secondary"
        >
          Open Farm
        </Button>
      </div>
    </Card>
  );
}