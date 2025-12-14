import { Task, formatDate, MODULE_COLORS, sortTasksByDate, getUpcomingTasks, getOverdueTasks } from "../../lib/calendar-utils";
import { cn } from "../ui/utils";
import { Clock, Flag, Repeat, CheckSquare } from "lucide-react";

interface ListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function ListView({ tasks, onTaskClick }: ListViewProps) {
  const overdueTasks = getOverdueTasks(tasks);
  const upcomingTasks = getUpcomingTasks(tasks, 50);
  const completedTasks = sortTasksByDate(tasks.filter(t => t.completed));

  const renderTask = (task: Task) => {
    const moduleColors = MODULE_COLORS[task.module];
    
    return (
      <div
        key={task.id}
        onClick={() => onTaskClick(task)}
        className={cn(
          "p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all",
          moduleColors.bg,
          moduleColors.border,
          task.completed && "opacity-60"
        )}
      >
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => e.stopPropagation()}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className={cn(
                  "font-medium mb-1",
                  moduleColors.text,
                  task.completed && "line-through"
                )}>
                  {moduleColors.icon} {task.title}
                </div>
                
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
              
              {task.priority === 'high' && (
                <Flag className="w-4 h-4 text-red-500" />
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(task.date, 'short')}
                {task.time && ` at ${task.time}`}
              </div>
              
              {task.recurrence && (
                <div className="flex items-center gap-1">
                  <Repeat className="w-3.5 h-3.5" />
                  Recurring
                </div>
              )}
              
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5" />
                  {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400">
              Overdue ({overdueTasks.length})
            </h3>
          </div>
          <div className="space-y-3">
            {overdueTasks.map(renderTask)}
          </div>
        </div>
      )}

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <h3 className="text-lg font-medium">
              Upcoming ({upcomingTasks.length})
            </h3>
          </div>
          
          {/* Group by date */}
          {Object.entries(
            upcomingTasks.reduce((acc, task) => {
              if (!acc[task.date]) acc[task.date] = [];
              acc[task.date].push(task);
              return acc;
            }, {} as Record<string, Task[]>)
          ).map(([date, dateTasks]) => (
            <div key={date} className="mb-6">
              <div className="text-sm font-medium text-muted-foreground mb-3">
                {formatDate(date, 'long')}
              </div>
              <div className="space-y-3">
                {dateTasks.map(renderTask)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <h3 className="text-lg font-medium text-green-600 dark:text-green-400">
              Completed ({completedTasks.length})
            </h3>
          </div>
          <div className="space-y-3">
            {completedTasks.slice(0, 10).map(renderTask)}
          </div>
          {completedTasks.length > 10 && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Showing 10 of {completedTasks.length} completed tasks
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <CheckSquare className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get started by creating your first farm task. Click the "Add Task" button to begin.
          </p>
        </div>
      )}
    </div>
  );
}
