import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Task, getWeekDates, dateToString, MODULE_COLORS, isToday, formatDate } from "../../lib/calendar-utils";
import { cn } from "../ui/utils";

interface WeekViewProps {
  currentDate: Date;
  tasks: Task[];
  onDateChange: (date: Date) => void;
  onTaskClick: (task: Task) => void;
  onTimeSlotClick: (date: string, hour: number) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function WeekView({ 
  currentDate, 
  tasks, 
  onDateChange, 
  onTaskClick,
  onTimeSlotClick 
}: WeekViewProps) {
  const weekDates = getWeekDates(new Date(currentDate));
  
  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    onDateChange(newDate);
  };
  
  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    onDateChange(newDate);
  };
  
  const goToToday = () => {
    onDateChange(new Date());
  };

  const getTasksForDateAndHour = (date: Date, hour: number) => {
    const dateStr = dateToString(date);
    return tasks.filter(task => {
      if (task.date !== dateStr) return false;
      if (task.allDay) return false;
      if (!task.time) return false;
      
      const taskHour = parseInt(task.time.split(':')[0]);
      return taskHour === hour;
    });
  };

  const getAllDayTasks = (date: Date) => {
    const dateStr = dateToString(date);
    return tasks.filter(task => task.date === dateStr && task.allDay);
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">
          {formatDate(dateToString(weekDates[0]), 'short')} - {formatDate(dateToString(weekDates[6]), 'short')}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={prevWeek}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextWeek}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="flex-1 border rounded-lg overflow-auto bg-card">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b sticky top-0 bg-card z-10">
            <div className="p-3 border-r bg-muted/30"></div>
            {weekDates.map((date) => {
              const dateStr = dateToString(date);
              const isTodayDate = isToday(dateStr);
              
              return (
                <div
                  key={dateStr}
                  className={cn(
                    "p-3 text-center border-r bg-muted/30",
                    isTodayDate && "bg-primary/10"
                  )}
                >
                  <div className="text-sm text-muted-foreground">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div
                    className={cn(
                      "text-lg font-medium mt-1",
                      isTodayDate && "text-primary"
                    )}
                  >
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* All Day Row */}
          <div className="grid grid-cols-8 border-b bg-muted/5">
            <div className="p-3 border-r text-sm text-muted-foreground">
              All Day
            </div>
            {weekDates.map((date) => {
              const dateStr = dateToString(date);
              const allDayTasks = getAllDayTasks(date);
              
              return (
                <div key={`allday-${dateStr}`} className="p-2 border-r min-h-[60px]">
                  <div className="space-y-1">
                    {allDayTasks.map((task) => {
                      const moduleColors = MODULE_COLORS[task.module];
                      return (
                        <div
                          key={task.id}
                          onClick={() => onTaskClick(task)}
                          className={cn(
                            "text-xs px-2 py-1 rounded cursor-pointer truncate",
                            moduleColors.bg,
                            moduleColors.text,
                            task.completed && "opacity-50 line-through"
                          )}
                          title={task.title}
                        >
                          {moduleColors.icon} {task.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Slots */}
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b">
              <div className="p-3 border-r text-xs text-muted-foreground">
                {formatHour(hour)}
              </div>
              {weekDates.map((date) => {
                const dateStr = dateToString(date);
                const hourTasks = getTasksForDateAndHour(date, hour);
                
                return (
                  <div
                    key={`${dateStr}-${hour}`}
                    className="p-2 border-r min-h-[60px] hover:bg-muted/20 cursor-pointer transition-colors"
                    onClick={() => onTimeSlotClick(dateStr, hour)}
                  >
                    <div className="space-y-1">
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
                              "text-xs px-2 py-1 rounded cursor-pointer",
                              moduleColors.bg,
                              moduleColors.text,
                              task.completed && "opacity-50 line-through"
                            )}
                          >
                            {moduleColors.icon} {task.time} {task.title}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
