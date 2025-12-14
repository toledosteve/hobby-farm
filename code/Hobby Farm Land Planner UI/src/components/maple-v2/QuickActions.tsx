import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Trees, Droplets, Beaker, Target } from "lucide-react";

interface QuickActionsProps {
  onAddTree: () => void;
  onAddTaps: () => void;
  onLogCollection: () => void;
  onLogBoil: () => void;
}

export function QuickActions({
  onAddTree,
  onAddTaps,
  onLogCollection,
  onLogBoil,
}: QuickActionsProps) {
  const actions = [
    {
      id: 'add-tree',
      label: 'Add Tree',
      icon: Trees,
      onClick: onAddTree,
      variant: 'outline' as const,
    },
    {
      id: 'add-taps',
      label: 'Add Tap(s)',
      icon: Target,
      onClick: onAddTaps,
      variant: 'outline' as const,
    },
    {
      id: 'log-collection',
      label: 'Log Collection',
      icon: Droplets,
      onClick: onLogCollection,
      variant: 'default' as const,
    },
    {
      id: 'log-boil',
      label: 'Log Boil',
      icon: Beaker,
      onClick: onLogBoil,
      variant: 'default' as const,
    },
  ];

  return (
    <Card className="p-5">
      <h3 className="font-medium mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant={action.variant}
              onClick={action.onClick}
              className={`h-auto flex-col gap-2 py-4 ${action.className}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}