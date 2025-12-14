import { X, Calendar as CalendarIcon, Clock, Repeat, Flag, CheckSquare, Copy, Trash2, Edit, MoreHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Task, MODULE_COLORS, formatDate, formatModuleName, PRIORITY_COLORS } from "../../lib/calendar-utils";
import { cn } from "../ui/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface TaskDetailDrawerProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}

export function TaskDetailDrawer({
  task,
  open,
  onOpenChange,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleComplete,
}: TaskDetailDrawerProps) {
  if (!task) return null;

  const moduleColors = MODULE_COLORS[task.module];
  const priorityColors = PRIORITY_COLORS[task.priority];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <SheetTitle className="flex-1 pr-8">
              {task.title}
            </SheetTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(task)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(task)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Module & Priority Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn(moduleColors.bg, moduleColors.text, "border-0")}>
              {moduleColors.icon} {formatModuleName(task.module)}
            </Badge>
            {task.priority !== 'medium' && (
              <Badge className={cn(priorityColors.bg, priorityColors.text, "border-0")}>
                <Flag className="w-3 h-3 mr-1" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </Badge>
            )}
            {task.recurrence && (
              <Badge variant="outline">
                <Repeat className="w-3 h-3 mr-1" />
                Recurring
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Status */}
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task)}
              className="w-5 h-5"
            />
            <div className="flex-1">
              <div className="font-medium">
                {task.completed ? 'Completed' : 'Mark as complete'}
              </div>
              <div className="text-sm text-muted-foreground">
                {task.completed 
                  ? `Completed on ${formatDate(task.updatedAt, 'short')}`
                  : 'Click to mark this task as done'}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">Date</div>
                <div className="text-sm">{formatDate(task.date, 'long')}</div>
              </div>
            </div>

            {task.time && !task.allDay && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium text-sm mb-1">Time</div>
                  <div className="text-sm">{task.time}</div>
                </div>
              </div>
            )}

            {task.allDay && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium text-sm mb-1">All Day</div>
                  <div className="text-sm text-muted-foreground">This task runs all day</div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <div className="font-medium text-sm mb-2">Description</div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Recurrence Info */}
          {task.recurrence && (
            <div>
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <Repeat className="w-4 h-4" />
                Recurrence
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-sm">
                <div className="space-y-1">
                  <div>
                    Repeats every {task.recurrence.interval} {task.recurrence.type}
                    {task.recurrence.interval > 1 ? 's' : ''}
                  </div>
                  {task.recurrence.daysOfWeek && task.recurrence.daysOfWeek.length > 0 && (
                    <div className="text-muted-foreground">
                      On: {task.recurrence.daysOfWeek.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}
                    </div>
                  )}
                  {task.recurrence.endDate && (
                    <div className="text-muted-foreground">
                      Ends: {formatDate(task.recurrence.endDate, 'long')}
                    </div>
                  )}
                  {task.recurrence.occurrences && (
                    <div className="text-muted-foreground">
                      Ends after: {task.recurrence.occurrences} occurrences
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div>
              <div className="font-medium text-sm mb-2 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
              </div>
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2 p-2 rounded border">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => {}}
                      className="w-4 h-4"
                    />
                    <span className={cn(
                      "text-sm flex-1",
                      subtask.completed && "line-through text-muted-foreground"
                    )}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity History */}
          <div className="pt-6 border-t">
            <div className="font-medium text-sm mb-3">Activity</div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>Created on {formatDate(task.createdAt, 'long')}</div>
              <div>Last updated on {formatDate(task.updatedAt, 'long')}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6 pt-6 border-t">
          <Button onClick={() => onEdit(task)} className="flex-1">
            <Edit className="w-4 h-4 mr-2" />
            Edit Task
          </Button>
          <Button
            variant="outline"
            onClick={() => onDelete(task)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
