import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RecurrenceSettings, RecurrenceType } from "../../lib/calendar-utils";

interface RecurringTaskSettingsProps {
  recurrence?: RecurrenceSettings;
  onChange: (recurrence: RecurrenceSettings) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

export function RecurringTaskSettings({ recurrence, onChange }: RecurringTaskSettingsProps) {
  const settings: RecurrenceSettings = recurrence || {
    type: 'weekly',
    interval: 1,
    daysOfWeek: [1], // Monday by default
  };

  const updateSettings = (updates: Partial<RecurrenceSettings>) => {
    onChange({ ...settings, ...updates });
  };

  const toggleDayOfWeek = (day: number) => {
    const current = settings.daysOfWeek || [];
    const newDays = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day].sort();
    updateSettings({ daysOfWeek: newDays.length > 0 ? newDays : [day] });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center gap-2">
        <Label className="min-w-[60px]">Repeat</Label>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm">every</span>
          <Input
            type="number"
            min="1"
            value={settings.interval}
            onChange={(e) => updateSettings({ interval: parseInt(e.target.value) || 1 })}
            className="w-20"
          />
          <Select
            value={settings.type}
            onValueChange={(value: RecurrenceType) => updateSettings({ type: value })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">day(s)</SelectItem>
              <SelectItem value="weekly">week(s)</SelectItem>
              <SelectItem value="monthly">month(s)</SelectItem>
              <SelectItem value="custom">custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Days of Week (for weekly recurrence) */}
      {settings.type === 'weekly' && (
        <div className="flex items-start gap-2">
          <Label className="min-w-[60px] pt-2">On</Label>
          <div className="flex gap-2 flex-wrap">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDayOfWeek(day.value)}
                className={`
                  w-10 h-10 rounded-full text-sm transition-colors
                  ${settings.daysOfWeek?.includes(day.value)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* End Condition */}
      <div className="space-y-3">
        <Label>Ends</Label>
        <RadioGroup
          value={settings.endDate ? 'date' : settings.occurrences ? 'occurrences' : 'never'}
          onValueChange={(value) => {
            if (value === 'never') {
              updateSettings({ endDate: undefined, occurrences: undefined });
            } else if (value === 'date') {
              updateSettings({ occurrences: undefined });
            } else if (value === 'occurrences') {
              updateSettings({ endDate: undefined, occurrences: 10 });
            }
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="never" />
            <Label htmlFor="never" className="font-normal cursor-pointer">
              Never
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="date" id="endDate" />
            <Label htmlFor="endDate" className="font-normal cursor-pointer">
              On date
            </Label>
            {(!settings.occurrences || settings.endDate) && (
              <Input
                type="date"
                value={settings.endDate || ''}
                onChange={(e) => updateSettings({ endDate: e.target.value })}
                className="ml-2 w-[160px]"
              />
            )}
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="occurrences" id="occurrences" />
            <Label htmlFor="occurrences" className="font-normal cursor-pointer">
              After
            </Label>
            {settings.occurrences !== undefined && (
              <>
                <Input
                  type="number"
                  min="1"
                  value={settings.occurrences}
                  onChange={(e) => updateSettings({ occurrences: parseInt(e.target.value) || 1 })}
                  className="ml-2 w-20"
                />
                <span className="text-sm text-muted-foreground">occurrences</span>
              </>
            )}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
