import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class RecurringTasksService {
  private readonly logger = new Logger(RecurringTasksService.name);

  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  /**
   * Runs daily at midnight to generate recurring task instances
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateRecurringTasks() {
    this.logger.log('Starting recurring task generation...');

    try {
      // Find all tasks with recurrence settings
      const recurringTasks = await this.taskModel
        .find({ recurrence: { $exists: true, $ne: null } })
        .exec();

      this.logger.log(`Found ${recurringTasks.length} recurring tasks`);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let generatedCount = 0;

      for (const task of recurringTasks) {
        if (!task.recurrence) continue;

        // Check if we should generate a new instance today
        if (await this.shouldGenerateInstance(task, today)) {
          await this.createTaskInstance(task, today);
          generatedCount++;
        }
      }

      this.logger.log(`Generated ${generatedCount} new task instances`);
    } catch (error) {
      this.logger.error('Error generating recurring tasks:', error);
    }
  }

  /**
   * Determines if a new task instance should be generated for today
   */
  private async shouldGenerateInstance(
    task: Task,
    targetDate: Date,
  ): Promise<boolean> {
    const recurrence = task.recurrence;
    if (!recurrence) return false;

    // Check if recurrence has ended
    if (recurrence.endDate) {
      const endDate = new Date(recurrence.endDate);
      if (targetDate > endDate) return false;
    }

    // Check if max occurrences reached (would need tracking - skip for now)
    // TODO: Track occurrence count if using occurrences limit

    // Get the original task date
    const originalDate = new Date(task.date);

    // Calculate if today matches the recurrence pattern
    switch (recurrence.type) {
      case 'daily':
        return this.shouldGenerateDaily(originalDate, targetDate, recurrence.interval);

      case 'weekly':
        return this.shouldGenerateWeekly(
          originalDate,
          targetDate,
          recurrence.interval,
          recurrence.daysOfWeek,
        );

      case 'monthly':
        return this.shouldGenerateMonthly(originalDate, targetDate, recurrence.interval);

      default:
        return false;
    }
  }

  private shouldGenerateDaily(
    originalDate: Date,
    targetDate: Date,
    interval: number,
  ): boolean {
    const daysDiff = Math.floor(
      (targetDate.getTime() - originalDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysDiff > 0 && daysDiff % interval === 0;
  }

  private shouldGenerateWeekly(
    originalDate: Date,
    targetDate: Date,
    interval: number,
    daysOfWeek?: number[],
  ): boolean {
    const weeksDiff = Math.floor(
      (targetDate.getTime() - originalDate.getTime()) / (1000 * 60 * 60 * 24 * 7),
    );

    // Check if we're on the right week interval
    if (weeksDiff <= 0 || weeksDiff % interval !== 0) {
      return false;
    }

    // Check if today is one of the specified days of week
    if (daysOfWeek && daysOfWeek.length > 0) {
      const targetDayOfWeek = targetDate.getDay();
      return daysOfWeek.includes(targetDayOfWeek);
    }

    // If no specific days, use the original day of week
    return targetDate.getDay() === originalDate.getDay();
  }

  private shouldGenerateMonthly(
    originalDate: Date,
    targetDate: Date,
    interval: number,
  ): boolean {
    const monthsDiff =
      (targetDate.getFullYear() - originalDate.getFullYear()) * 12 +
      (targetDate.getMonth() - originalDate.getMonth());

    // Check if we're on the right month interval and same day of month
    return (
      monthsDiff > 0 &&
      monthsDiff % interval === 0 &&
      targetDate.getDate() === originalDate.getDate()
    );
  }

  /**
   * Creates a new task instance for the target date
   */
  private async createTaskInstance(task: Task, targetDate: Date): Promise<void> {
    // Check if instance already exists for this date
    const dateString = targetDate.toISOString().split('T')[0];
    const existingInstance = await this.taskModel
      .findOne({
        userId: task.userId,
        title: task.title,
        date: dateString,
      })
      .exec();

    if (existingInstance) {
      this.logger.debug(
        `Task instance already exists for ${task.title} on ${dateString}`,
      );
      return;
    }

    // Create new task instance
    const newTask = new this.taskModel({
      userId: task.userId,
      projectId: task.projectId,
      title: task.title,
      description: task.description,
      module: task.module,
      date: dateString,
      endDate: task.endDate,
      time: task.time,
      allDay: task.allDay,
      completed: false,
      priority: task.priority,
      subtasks: task.subtasks.map((st) => ({
        id: st.id,
        title: st.title,
        completed: false, // Reset subtask completion for new instance
      })),
      // Don't copy recurrence to instances - only the parent template has it
    });

    await newTask.save();
    this.logger.debug(`Created new task instance: ${task.title} on ${dateString}`);
  }
}
