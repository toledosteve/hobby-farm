import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Task, dateToString, MODULE_COLORS, formatDate } from "@/lib/calendar-utils";
import { cn } from "../ui/utils";

interface DayViewProps {
  currentDate: Date;
  tasks: Task[];
  onDateChange: (date: Date) => void;
  onTaskClick: (task: Task) => void;
  onTimeSlotClick: (date: string, hour: number) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function DayView({
  currentDate,
  tasks,
  onDateChange,
  onTaskClick,
  onTimeSlotClick
}: DayViewProps) {
  const dateStr = dateToString(currentDate);

  const prevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    onDateChange(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const dayTasks = tasks.filter(task => task.date === dateStr);
  const allDayTasks = dayTasks.filter(task => task.allDay);
  const timedTasks = dayTasks.filter(task => !task.allDay && task.time);

  const getTasksForHour = (hour: number) => {
    return timedTasks.filter(task => {
      if (!task.time) return false;
      const taskHour = parseInt(task.time.split(':')[0]);
      return taskHour === hour;
    });
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    if (hour < 12) return `${hour}:00 AM`;
    return `${hour - 12}:00 PM`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">
          {formatDate(dateStr, 'full')}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={prevDay}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextDay}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Day Content */}
      <div className="flex-1 border rounded-lg overflow-auto bg-card">
        <div className="min-w-[600px]">
          {/* All Day Section */}
          {allDayTasks.length > 0 && (
            <div className="border-b bg-muted/5">
              <div className="p-4">
                <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  All Day
                </div>
                <div className="space-y-2">
                  {allDayTasks.map((task) => {
                    const moduleColors = MODULE_COLORS[task.module];
                    return (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className={cn(
                          "p-3 rounded-lg cursor-pointer border",
                          moduleColors.bg,
                          moduleColors.text,
                          moduleColors.border,
                          task.completed && "opacity-50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => e.stopPropagation()}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className={cn("font-medium", task.completed && "line-through")}>
                              {moduleColors.icon} {task.title}
                            </div>
                            {task.description && (
                              <p className="text-sm mt-1 opacity-80">{task.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Hourly Schedule */}
          <div>
            {HOURS.map((hour) => {
              const hourTasks = getTasksForHour(hour);

              return (
                <div
                  key={hour}
                  className="grid border-b hover:bg-muted/10"
                  style={{ gridTemplateColumns: '100px 1fr' }}
                >
                  <div className="p-4 border-r text-sm text-muted-foreground">
                    {formatHour(hour)}
                  </div>
                  <div
                    className="p-4 min-h-[80px] cursor-pointer"
                    onClick={() => onTimeSlotClick(dateStr, hour)}
                  >
                    <div className="space-y-2">
                      {hourTasks.map((task) => {
                        const moduleColors = MODULE_COLORS[task.module];
                        return (
                          <div
                            key={task.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskClick(task);
                            }}
                            className={cn(
                              "p-3 rounded-lg cursor-pointer border",
                              moduleColors.bg,
                              moduleColors.text,
                              moduleColors.border,
                              task.completed && "opacity-50"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={(e) => e.stopPropagation()}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    {task.time}
                                  </span>
                                  <span className={cn("font-medium", task.completed && "line-through")}>
                                    {moduleColors.icon} {task.title}
                                  </span>
                                </div>
                                {task.description && (
                                  <p className="text-sm mt-1 opacity-80">{task.description}</p>
                                )}
                                {task.subtasks && task.subtasks.length > 0 && (
                                  <div className="mt-2 text-xs opacity-70">
                                    {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks completed
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
