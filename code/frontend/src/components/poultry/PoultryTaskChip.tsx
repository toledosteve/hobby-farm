import { LucideIcon, Egg, Bird, Home, AlertCircle } from "lucide-react";
import { Badge } from "../ui/badge";

interface PoultryTaskChipProps {
  type: 'clean-coop' | 'replace-bedding' | 'check-mites' | 'log-eggs';
  label?: string;
}

const taskConfig = {
  'clean-coop': {
    icon: Home,
    label: 'Clean coop',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  'replace-bedding': {
    icon: Home,
    label: 'Replace bedding',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  'check-mites': {
    icon: AlertCircle,
    label: 'Check for mites',
    color: 'bg-red-100 text-red-700 border-red-200',
  },
  'log-eggs': {
    icon: Egg,
    label: 'Log eggs',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
};

export function PoultryTaskChip({ type, label }: PoultryTaskChipProps) {
  const config = taskConfig[type];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs ${config.color}`}>
      <Icon className="w-3 h-3" />
      <span>{label || config.label}</span>
    </div>
  );
}
