import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AlertCircle, Stethoscope, Skull, Activity } from "lucide-react";

interface HealthEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flocks?: Array<{ id: string; name: string }>;
  onSave?: (data: HealthEventData) => void;
}

export interface HealthEventData {
  date: string;
  flockId: string;
  eventType: 'illness' | 'injury' | 'treatment' | 'mortality';
  description: string;
  birdCount?: number;
}

const eventTypeIcons = {
  illness: AlertCircle,
  injury: Activity,
  treatment: Stethoscope,
  mortality: Skull,
};

const eventTypeLabels = {
  illness: 'Illness',
  injury: 'Injury',
  treatment: 'Treatment',
  mortality: 'Mortality',
};

export function HealthEventModal({ open, onOpenChange, flocks = [], onSave }: HealthEventModalProps) {
  const [formData, setFormData] = useState<HealthEventData>({
    date: new Date().toISOString().split('T')[0],
    flockId: '',
    eventType: 'illness',
    description: '',
    birdCount: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onOpenChange(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      flockId: '',
      eventType: 'illness',
      description: '',
      birdCount: undefined,
    });
  };

  const EventIcon = eventTypeIcons[formData.eventType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <EventIcon className="w-5 h-5 text-primary" />
              Log Health Event
            </DialogTitle>
            <DialogDescription>
              Record a health-related event for a flock
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="flock">Flock</Label>
              <Select
                value={formData.flockId}
                onValueChange={(value) =>
                  setFormData({ ...formData, flockId: value })
                }
                required
              >
                <SelectTrigger id="flock">
                  <SelectValue placeholder="Select a flock" />
                </SelectTrigger>
                <SelectContent>
                  {flocks.map((flock) => (
                    <SelectItem key={flock.id} value={flock.id}>
                      {flock.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <Select
                value={formData.eventType}
                onValueChange={(value: HealthEventData['eventType']) =>
                  setFormData({ ...formData, eventType: value })
                }
              >
                <SelectTrigger id="eventType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(eventTypeLabels).map(([key, label]) => {
                    const Icon = eventTypeIcons[key as keyof typeof eventTypeIcons];
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {(formData.eventType === 'illness' || formData.eventType === 'injury' || formData.eventType === 'mortality') && (
              <div>
                <Label htmlFor="birdCount">
                  Number of Birds Affected {formData.eventType !== 'mortality' && '(optional)'}
                </Label>
                <Input
                  id="birdCount"
                  type="number"
                  min="1"
                  placeholder="e.g., 2"
                  value={formData.birdCount || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, birdCount: parseInt(e.target.value) || undefined })
                  }
                  required={formData.eventType === 'mortality'}
                />
              </div>
            )}

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the event, symptoms, treatment, or outcome..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
