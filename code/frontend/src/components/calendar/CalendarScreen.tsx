import { useState, useEffect } from "react";
import { Plus, Calendar as CalendarIcon, List, Clock, Grid3x3 } from "lucide-react";
import { Button } from "../ui/button";
import { DashboardCard } from "../ui/DashboardCard";
import { Task, ViewType, getTaskStats, getUpcomingTasks, dateToString } from "@/lib/calendar-utils";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { ListView } from "./ListView";
import { TaskModal } from "./TaskModal";
import { TaskDetailDrawer } from "./TaskDetailDrawer";
import { cn } from "../ui/utils";
import { toast } from "sonner";
import { taskService } from "@/services/task.service";
import { useProjects } from "@/contexts/ProjectContext";

interface CalendarScreenProps {
  onAddTask?: () => void;
}

export function CalendarScreen({ onAddTask }: CalendarScreenProps) {
  const { currentProject } = useProjects();
  const [currentView, setCurrentView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [initialDate, setInitialDate] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Load tasks from backend
  useEffect(() => {
    loadTasks();
  }, [currentProject?.id]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      // Load tasks for current project (or all if no project selected)
      const data = await taskService.getTasks(currentProject?.id);
      const validData = (data || []).filter(t => t != null && t.id != null);
      setTasks(validData);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter out invalid tasks
  const validTasks = (tasks || []).filter(t => t != null && t.id != null);

  const stats = getTaskStats(validTasks);
  const upcomingTasks = getUpcomingTasks(validTasks, 5);

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

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        // Update existing task
        const updated = await taskService.updateTask(editingTask.id, taskData);
        setTasks(tasks.map(t => t?.id === updated.id ? updated : t).filter(t => t != null));
        toast.success('Task updated successfully');
      } else {
        // Create new task - include projectId if we have a current project
        const createData = {
          ...taskData,
          ...(currentProject?.id && { projectId: currentProject.id }),
        };
        const newTask = await taskService.createTask(createData);
        if (newTask) {
          setTasks([...tasks.filter(t => t != null), newTask]);
          toast.success('Task created successfully');
        }
      }
    } catch (error) {
      console.error('Failed to save task:', error);
      toast.error('Failed to save task');
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

  const handleDuplicateTask = async (task: Task) => {
    if (!task?.id) {
      toast.error('Invalid task');
      return;
    }
    try {
      const { id, createdAt, updatedAt, ...taskData } = task;
      const newTask = await taskService.createTask({
        ...taskData,
        title: `${task.title} (Copy)`,
        completed: false,
      });
      if (newTask) {
        setTasks([...tasks.filter(t => t != null && t.id != null), newTask]);
        toast.success('Task duplicated successfully');
        setIsDetailDrawerOpen(false);
      }
    } catch (error) {
      console.error('Failed to duplicate task:', error);
      toast.error('Failed to duplicate task');
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!task?.id) {
      toast.error('Invalid task');
      return;
    }
    try {
      await taskService.deleteTask(task.id);
      setTasks(tasks.filter(t => t?.id !== task.id));

      // Clear selected task if it's the one being deleted
      if (selectedTask?.id === task.id) {
        setSelectedTask(null);
      }

      toast.success('Task deleted successfully');
      setIsDetailDrawerOpen(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    if (!task?.id) {
      toast.error('Invalid task');
      return;
    }
    try {
      const updated = await taskService.toggleComplete(task.id);
      setTasks(tasks.map(t => t?.id === updated.id ? updated : t).filter(t => t != null && t.id != null));

      // Update the selected task if it's the one being toggled
      if (selectedTask?.id === updated.id) {
        setSelectedTask(updated);
      }

      toast.success(updated.completed ? 'Task completed!' : 'Task marked as incomplete');
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      toast.error('Failed to update task');
    }
  };

  const handleToggleSubtask = async (task: Task, subtaskId: string) => {
    if (!task?.id || !subtaskId || !task.subtasks) {
      toast.error('Invalid task or subtask');
      return;
    }
    try {
      // Update the subtask completion status
      const updatedSubtasks = task.subtasks.map(subtask =>
        subtask.id === subtaskId
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      );

      // Update the task with the new subtasks array
      const updated = await taskService.updateTask(task.id, { subtasks: updatedSubtasks });
      setTasks(tasks.map(t => t?.id === updated.id ? updated : t).filter(t => t != null && t.id != null));

      // Update the selected task if it's the one being modified
      if (selectedTask?.id === updated.id) {
        setSelectedTask(updated);
      }

      const toggledSubtask = updatedSubtasks.find(s => s.id === subtaskId);
      toast.success(toggledSubtask?.completed ? 'Subtask completed!' : 'Subtask marked as incomplete');
    } catch (error) {
      console.error('Failed to toggle subtask completion:', error);
      toast.error('Failed to update subtask');
    }
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
                  <span>{view.label}</span>
                </button>
              );
            })}
          </div>

          {/* Calendar View */}
          <div className="flex-1 min-h-0">
            {currentView === 'month' && (
              <MonthView
                currentDate={currentDate}
                tasks={validTasks}
                onDateChange={setCurrentDate}
                onTaskClick={handleTaskClick}
                onDateClick={handleDateClick}
                onAddTask={handleAddTaskForDate}
              />
            )}
            {currentView === 'week' && (
              <WeekView
                currentDate={currentDate}
                tasks={validTasks}
                onDateChange={setCurrentDate}
                onTaskClick={handleTaskClick}
                onTimeSlotClick={handleTimeSlotClick}
              />
            )}
            {currentView === 'day' && (
              <DayView
                currentDate={currentDate}
                tasks={validTasks}
                onDateChange={setCurrentDate}
                onTaskClick={handleTaskClick}
                onTimeSlotClick={handleTimeSlotClick}
              />
            )}
            {currentView === 'list' && (
              <div className="h-full overflow-auto pr-2">
                <ListView
                  tasks={validTasks}
                  onTaskClick={handleTaskClick}
                  onToggleComplete={handleToggleComplete}
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
                        onClick={(e) => e.stopPropagation()}
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
        onToggleSubtask={handleToggleSubtask}
      />
    </div>
  );
}
