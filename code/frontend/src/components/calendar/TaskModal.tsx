import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Clock, Repeat, CheckSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Task, TaskModule, TaskPriority, MODULE_COLORS, formatModuleName } from "@/lib/calendar-utils";
import { RecurringTaskSettings } from "./RecurringTaskSettings";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  initialDate?: string;
  onSave: (task: Partial<Task>) => void;
}

export function TaskModal({ open, onOpenChange, task, initialDate, onSave }: TaskModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    module: 'general',
    date: initialDate || new Date().toISOString().split('T')[0],
    time: '',
    allDay: true,
    priority: 'medium',
    completed: false,
    recurrence: undefined,
    subtasks: [],
  });

  const [showRecurrence, setShowRecurrence] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData(task);
      setShowRecurrence(!!task.recurrence);
    } else if (initialDate) {
      setFormData(prev => ({ ...prev, date: initialDate }));
    }
  }, [task, initialDate, open]);

  const handleSave = () => {
    if (!formData.title?.trim()) return;

    // Remove timestamp fields - they're auto-managed by the backend
    const { createdAt, updatedAt, ...taskData } = formData;

    onSave(taskData);

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      module: 'general',
      date: new Date().toISOString().split('T')[0],
      time: '',
      allDay: true,
      priority: 'medium',
      completed: false,
      recurrence: undefined,
      subtasks: [],
    });
    setShowRecurrence(false);
  };

  const handleAddSubtask = () => {
    setFormData({
      ...formData,
      subtasks: [
        ...(formData.subtasks || []),
        { id: Date.now().toString(), title: '', completed: false },
      ],
    });
  };

  const updateSubtask = (index: number, title: string) => {
    const newSubtasks = [...(formData.subtasks || [])];
    newSubtasks[index].title = title;
    setFormData({ ...formData, subtasks: newSubtasks });
  };

  const removeSubtask = (index: number) => {
    setFormData({
      ...formData,
      subtasks: formData.subtasks?.filter((_, i) => i !== index),
    });
  };

  const modules: TaskModule[] = ['maple', 'poultry', 'garden', 'greenhouse', 'livestock', 'general'];
  const priorities: TaskPriority[] = ['low', 'medium', 'high'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Check sap lines"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details about this task..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          {/* Module & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="module">Module</Label>
              <Select
                value={formData.module}
                onValueChange={(value: TaskModule) => setFormData({ ...formData, module: value })}
              >
                <SelectTrigger id="module">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module} value={module}>
                      <div className="flex items-center gap-2">
                        <span>{MODULE_COLORS[module].icon}</span>
                        <span>{formatModuleName(module)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TaskPriority) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value, allDay: !e.target.value })}
                  className="pl-9"
                  disabled={formData.allDay}
                />
              </div>
            </div>
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="allDay" className="cursor-pointer">All Day Task</Label>
            <Switch
              id="allDay"
              checked={formData.allDay}
              onCheckedChange={(checked) => setFormData({ ...formData, allDay: checked, time: checked ? '' : formData.time })}
            />
          </div>

          {/* Recurrence Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="recurring" className="cursor-pointer">Recurring Task</Label>
            </div>
            <Switch
              id="recurring"
              checked={showRecurrence}
              onCheckedChange={setShowRecurrence}
            />
          </div>

          {/* Recurrence Settings */}
          {showRecurrence && (
            <RecurringTaskSettings
              recurrence={formData.recurrence}
              onChange={(recurrence) => setFormData({ ...formData, recurrence })}
            />
          )}

          {/* Subtasks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Subtasks</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddSubtask}>
                <CheckSquare className="w-4 h-4 mr-2" />
                Add Subtask
              </Button>
            </div>

            {formData.subtasks && formData.subtasks.length > 0 && (
              <div className="space-y-2">
                {formData.subtasks.map((subtask, index) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <Input
                      placeholder="Subtask name"
                      value={subtask.title}
                      onChange={(e) => updateSubtask(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubtask(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.title?.trim()}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
