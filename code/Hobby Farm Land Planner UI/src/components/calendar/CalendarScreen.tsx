import { useState } from "react";
import { Plus, Calendar as CalendarIcon, List, Clock, Grid3x3 } from "lucide-react";
import { Button } from "../ui/button";
import { DashboardCard } from "../ui/DashboardCard";
import { Task, ViewType, getTaskStats, getUpcomingTasks, getOverdueTasks, dateToString } from "../../lib/calendar-utils";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { ListView } from "./ListView";
import { TaskModal } from "./TaskModal";
import { TaskDetailDrawer } from "./TaskDetailDrawer";
import { cn } from "../ui/utils";
import { toast } from "sonner@2.0.3";

interface CalendarScreenProps {
  onAddTask?: () => void;
}

// Mock data - in real app this would come from state management/API
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Tap maple trees',
    description: 'Begin tapping the sugar maples in the north section. Bring tapping equipment and buckets.',
    module: 'maple',
    date: '2025-03-08',
    time: '08:00',
    allDay: false,
    completed: false,
    priority: 'high',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
    subtasks: [
      { id: 's1', title: 'Prepare tapping equipment', completed: true },
      { id: 's2', title: 'Mark tree locations', completed: false },
      { id: 's3', title: 'Install collection buckets', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Check sap lines',
    description: 'Inspect all sap lines for leaks or damage',
    module: 'maple',
    date: '2025-03-12',
    time: '09:00',
    allDay: false,
    completed: false,
    priority: 'medium',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
    recurrence: {
      type: 'daily',
      interval: 1,
    },
  },
  {
    id: '3',
    title: 'Clean chicken coop',
    description: 'Weekly coop cleaning and fresh bedding',
    module: 'poultry',
    date: '2025-03-14',
    allDay: true,
    completed: false,
    priority: 'medium',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
    recurrence: {
      type: 'weekly',
      interval: 1,
      daysOfWeek: [5], // Friday
    },
  },
  {
    id: '4',
    title: 'Collect sap - morning run',
    module: 'maple',
    date: '2025-03-15',
    time: '07:00',
    allDay: false,
    completed: false,
    priority: 'high',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
  },
  {
    id: '5',
    title: 'Plant greenhouse tomatoes',
    description: 'Start tomato seedlings in greenhouse',
    module: 'greenhouse',
    date: '2025-03-20',
    allDay: true,
    completed: false,
    priority: 'medium',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
  },
];

export function CalendarScreen({ onAddTask }: CalendarScreenProps) {
  const [currentView, setCurrentView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 7)); // March 7, 2025
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [initialDate, setInitialDate] = useState<string | undefined>(undefined);

  const stats = getTaskStats(tasks);
  const upcomingTasks = getUpcomingTasks(tasks, 5);
  const overdueTasks = getOverdueTasks(tasks);

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setInitialDate(dateToString(currentDate));
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
    setIsDetailDrawerOpen(false);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...taskData } : t));
      toast.success('Task updated successfully');
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title || '',
        description: taskData.description,
        module: taskData.module || 'general',
        date: taskData.date || dateToString(new Date()),
        time: taskData.time,
        allDay: taskData.allDay || true,
        completed: false,
        priority: taskData.priority || 'medium',
        recurrence: taskData.recurrence,
        subtasks: taskData.subtasks,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks([...tasks, newTask]);
      toast.success('Task created successfully');
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailDrawerOpen(true);
  };

  const handleDateClick = (date: string) => {
    setInitialDate(date);
    // Could open day view or task modal
  };

  const handleAddTaskForDate = (date: string) => {
    setInitialDate(date);
    setEditingTask(undefined);
    setIsTaskModalOpen(true);
  };

  const handleTimeSlotClick = (date: string, hour: number) => {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    setInitialDate(date);
    setEditingTask(undefined);
    setIsTaskModalOpen(true);
  };

  const handleDuplicateTask = (task: Task) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      title: `${task.title} (Copy)`,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    toast.success('Task duplicated successfully');
    setIsDetailDrawerOpen(false);
  };

  const handleDeleteTask = (task: Task) => {
    setTasks(tasks.filter(t => t.id !== task.id));
    toast.success('Task deleted successfully');
    setIsDetailDrawerOpen(false);
  };

  const handleToggleComplete = (task: Task) => {
    setTasks(tasks.map(t => 
      t.id === task.id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t
    ));
    toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed!');
  };

  const views: { id: ViewType; label: string; icon: any }[] = [
    { id: 'month', label: 'Month', icon: Grid3x3 },
    { id: 'week', label: 'Week', icon: CalendarIcon },
    { id: 'day', label: 'Day', icon: Clock },
    { id: 'list', label: 'List', icon: List },
  ];

  return (
    <div className="p-6 max-w-[1800px] mx-auto h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mb-2">Calendar & Tasks</h1>
          <p className="text-muted-foreground">
            Manage your farm tasks and schedule
          </p>
        </div>
        <Button onClick={handleCreateTask} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Main Calendar Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* View Switcher */}
          <div className="flex items-center gap-1 mb-4 p-1 bg-muted rounded-lg w-fit">
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                    currentView === view.id
                      ? "bg-background shadow-sm"
                      : "hover:bg-background/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{view.label}</span>
                </button>
              );
            })}
          </div>

          {/* Calendar View */}
          <div className="flex-1 min-h-0">
            {currentView === 'month' && (
              <MonthView
                currentDate={currentDate}
                tasks={tasks}
                onDateChange={setCurrentDate}
                onTaskClick={handleTaskClick}
                onDateClick={handleDateClick}
                onAddTask={handleAddTaskForDate}
              />
            )}
            {currentView === 'week' && (
              <WeekView
                currentDate={currentDate}
                tasks={tasks}
                onDateChange={setCurrentDate}
                onTaskClick={handleTaskClick}
                onTimeSlotClick={handleTimeSlotClick}
              />
            )}
            {currentView === 'day' && (
              <DayView
                currentDate={currentDate}
                tasks={tasks}
                onDateChange={setCurrentDate}
                onTaskClick={handleTaskClick}
                onTimeSlotClick={handleTimeSlotClick}
              />
            )}
            {currentView === 'list' && (
              <div className="h-full overflow-auto pr-2">
                <ListView
                  tasks={tasks}
                  onTaskClick={handleTaskClick}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-4 hidden lg:block overflow-y-auto">
          {/* Task Summary */}
          <DashboardCard title="Task Summary">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Tasks</span>
                <span className="font-semibold">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {stats.completed}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {stats.pending}
                </span>
              </div>
              {stats.overdue > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overdue</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {stats.overdue}
                  </span>
                </div>
              )}
            </div>
          </DashboardCard>

          {/* Upcoming Tasks */}
          <DashboardCard title="Upcoming Tasks">
            <div className="space-y-3">
              {upcomingTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming tasks
                </p>
              ) : (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="p-3 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleComplete(task);
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{task.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-6 text-xs text-muted-foreground">
                      <span>{task.date}</span>
                      {task.time && <span>• {task.time}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        task={editingTask}
        initialDate={initialDate}
        onSave={handleSaveTask}
      />

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        open={isDetailDrawerOpen}
        onOpenChange={setIsDetailDrawerOpen}
        onEdit={handleEditTask}
        onDuplicate={handleDuplicateTask}
        onDelete={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
}
