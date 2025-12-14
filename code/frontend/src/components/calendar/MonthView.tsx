import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Task, getTasksForDate, MODULE_COLORS, isToday, dateToString } from "@/lib/calendar-utils";
import { cn } from "../ui/utils";

interface MonthViewProps {
  currentDate: Date;
  tasks: Task[];
  onDateChange: (date: Date) => void;
  onTaskClick: (task: Task) => void;
  onDateClick: (date: string) => void;
  onAddTask: (date: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthView({
  currentDate,
  tasks,
  onDateChange,
  onTaskClick,
  onDateClick,
  onAddTask
}: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    onDateChange(new Date(year, month - 1));
  };

  const nextMonth = () => {
    onDateChange(new Date(year, month + 1));
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  // Generate calendar grid
  const calendarDays: Array<{ date: string; day: number; isCurrentMonth: boolean }> = [];

  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day);
    calendarDays.push({
      date: dateToString(date),
      day,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    calendarDays.push({
      date: dateToString(date),
      day,
      isCurrentMonth: true,
    });
  }

  // Next month days
  const remainingDays = 42 - calendarDays.length; // 6 weeks
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    calendarDays.push({
      date: dateToString(date),
      day,
      isCurrentMonth: false,
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">
          {MONTH_NAMES[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 border rounded-lg overflow-hidden bg-card">
        <div className="grid grid-cols-7">
          {/* Day Headers */}
          {DAY_NAMES.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-muted-foreground border-b bg-muted/30"
            >
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {calendarDays.map((calDay, index) => {
            const dayTasks = getTasksForDate(tasks, calDay.date);
            const isTodayDate = isToday(calDay.date);
            const visibleTasks = dayTasks.slice(0, 3);
            const hasMoreTasks = dayTasks.length > 3;

            return (
              <div
                key={`${calDay.date}-${index}`}
                className={cn(
                  "min-h-[120px] p-2 border-b border-r relative group hover:bg-muted/20 transition-colors cursor-pointer",
                  !calDay.isCurrentMonth && "bg-muted/5",
                  index % 7 === 6 && "border-r-0"
                )}
                onClick={() => onDateClick(calDay.date)}
              >
                {/* Date Number */}
                <div className="flex items-start justify-between mb-1">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-7 h-7 text-sm rounded-full",
                      isTodayDate && "bg-primary text-primary-foreground font-medium",
                      !calDay.isCurrentMonth && !isTodayDate && "text-muted-foreground",
                      calDay.isCurrentMonth && !isTodayDate && "hover:bg-muted"
                    )}
                  >
                    {calDay.day}
                  </span>

                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddTask(calDay.date);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-primary/10 rounded"
                  >
                    <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>

                {/* Tasks */}
                <div className="space-y-1">
                  {visibleTasks.map((task) => {
                    const moduleColors = MODULE_COLORS[task.module];
                    return (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick(task);
                        }}
                        className={cn(
                          "text-xs px-2 py-1 rounded truncate cursor-pointer transition-all",
                          moduleColors.bg,
                          moduleColors.text,
                          "hover:shadow-sm hover:scale-[1.02]",
                          task.completed && "opacity-50 line-through"
                        )}
                        title={task.title}
                      >
                        <span className="mr-1">{moduleColors.icon}</span>
                        {task.time && <span className="mr-1">{task.time}</span>}
                        {task.title}
                      </div>
                    );
                  })}

                  {hasMoreTasks && (
                    <div className="text-xs text-muted-foreground px-2 py-0.5">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
