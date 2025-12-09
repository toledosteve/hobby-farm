import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DashboardCard } from "../ui/DashboardCard";

interface Task {
  id: string;
  title: string;
  date: string;
  module?: string;
  completed: boolean;
}

export function CalendarScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2)); // March 2025

  const handleAddTask = () => {
    console.log('Add task - to be implemented with modal');
  };

  const tasks: Task[] = [
    { id: '1', title: 'Tap maple trees this weekend', date: '2025-03-08', module: 'Maple', completed: false },
    { id: '2', title: 'Check sap lines', date: '2025-03-12', module: 'Maple', completed: false },
    { id: '3', title: 'Clean chicken coop', date: '2025-03-14', completed: false },
    { id: '4', title: 'Collect sap - morning run', date: '2025-03-15', module: 'Maple', completed: false },
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const getTasksForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.date === dateStr);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Calendar & Tasks</h1>
          <p className="text-muted-foreground">
            Manage your farm tasks and schedule
          </p>
        </div>
        <Button onClick={handleAddTask}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <DashboardCard title="Calendar">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <h2>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm text-muted-foreground p-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2" />
              ))}

              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayTasks = getTasksForDate(day);
                const isToday = day === 7 && currentMonth.getMonth() === 2; // Mock today as March 7

                return (
                  <div
                    key={day}
                    className={`min-h-[80px] p-2 border rounded-lg ${
                      isToday ? 'border-primary bg-primary/5' : 'border-border'
                    } hover:border-primary/50 transition-colors cursor-pointer`}
                  >
                    <div className={`text-sm mb-1 ${isToday ? 'font-semibold text-primary' : ''}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded truncate"
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </DashboardCard>
        </div>

        {/* Upcoming Tasks Sidebar */}
        <div className="space-y-6">
          <DashboardCard title="Upcoming Tasks">
            <div className="space-y-3">
              {tasks.filter(t => !t.completed).map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      className="mt-1"
                      onChange={() => {}}
                    />
                    <div className="flex-1">
                      <p className="text-sm">{task.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    {task.module && (
                      <Badge variant="outline" className="text-xs">
                        {task.module}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Quick Stats */}
          <DashboardCard title="Task Summary">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Tasks</span>
                <span className="font-semibold">{tasks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="font-semibold text-green-600">
                  {tasks.filter(t => t.completed).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="font-semibold text-orange-600">
                  {tasks.filter(t => !t.completed).length}
                </span>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
