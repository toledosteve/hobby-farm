# Recurring Tasks Feature

## Overview

The recurring tasks feature automatically generates new task instances based on recurrence patterns. This is implemented using NestJS's `@nestjs/schedule` package with a cron job that runs daily at midnight.

## How It Works

### 1. **Recurrence Settings**

When creating a task, you can optionally add recurrence settings with the following options:

```typescript
{
  type: 'daily' | 'weekly' | 'monthly' | 'custom',
  interval: number,  // e.g., every 2 days, every 3 weeks
  daysOfWeek?: number[],  // For weekly: [0,1,2,3,4,5,6] where 0 = Sunday
  endDate?: string,  // When to stop generating instances
  occurrences?: number  // Max number of occurrences (not yet implemented)
}
```

### 2. **Automatic Generation**

- A cron job runs **every day at midnight** (`@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)`)
- The job searches for all tasks with `recurrence` settings
- For each recurring task, it checks if a new instance should be created for today
- If yes, it creates a new task instance with:
  - All the same properties as the original task
  - `completed: false` (fresh instance)
  - All subtasks reset to `completed: false`
  - **No recurrence settings** (only the "parent" task has recurrence)
  - Today's date

### 3. **Recurrence Types**

#### Daily
- Generates a task every N days
- Example: `interval: 2` creates a task every 2 days

#### Weekly
- Generates a task every N weeks
- Can specify specific days of the week
- Example: `interval: 1, daysOfWeek: [1, 3, 5]` creates tasks every Monday, Wednesday, Friday

#### Monthly
- Generates a task every N months on the same day of the month
- Example: `interval: 1` on the 15th creates a task on the 15th of every month

### 4. **Duplicate Prevention**

The system checks if a task instance already exists before creating a new one by matching:
- Same `userId`
- Same `title`
- Same `date`

This prevents accidental duplicates if the cron runs multiple times.

## Architecture

### Files

1. **`recurring-tasks.service.ts`** - Main service with cron job logic
2. **`app.module.ts`** - Registers `ScheduleModule.forRoot()`
3. **`tasks.module.ts`** - Provides `RecurringTasksService`
4. **`task.schema.ts`** - Defines recurrence settings schema

### Cron Job Flow

```
Midnight (every day)
  ↓
RecurringTasksService.generateRecurringTasks()
  ↓
Find all tasks with recurrence settings
  ↓
For each task:
  ↓
  Check if should generate instance for today
    ↓
    - Check end date hasn't passed
    - Calculate if today matches pattern
      ↓
      Create new task instance
        ↓
        - Reset completion status
        - Reset subtasks
        - Set today's date
        - No recurrence on instance
```

## Example Usage

### Create a Daily Task

```typescript
{
  title: "Feed chickens",
  module: "poultry",
  date: "2025-12-12",
  recurrence: {
    type: "daily",
    interval: 1  // Every day
  }
}
```

Result: A new "Feed chickens" task will be created every day.

### Create a Weekly Task

```typescript
{
  title: "Clean coop",
  module: "poultry",
  date: "2025-12-12",
  recurrence: {
    type: "weekly",
    interval: 1,
    daysOfWeek: [0, 3]  // Sunday and Wednesday
  }
}
```

Result: A new "Clean coop" task will be created every Sunday and Wednesday.

### Create a Monthly Task with End Date

```typescript
{
  title: "Soil test",
  module: "garden",
  date: "2025-12-15",  // 15th of the month
  recurrence: {
    type: "monthly",
    interval: 1,
    endDate: "2026-12-15"  // Stop after one year
  }
}
```

Result: A new "Soil test" task will be created on the 15th of every month until December 2026.

## Limitations & Future Enhancements

### Current Limitations

1. **Occurrence Limit Not Implemented** - The `occurrences` field is stored but not enforced (would need to track instance count)
2. **No Manual Trigger** - Can only run at midnight (could add manual trigger endpoint for testing)
3. **Fixed Schedule** - Always midnight (could make configurable)
4. **No Instance Tracking** - Instances are independent (can't link back to parent or edit all instances)

### Potential Enhancements

1. Add ability to edit/delete all future instances
2. Track which instance belongs to which recurring parent
3. Add "skip instance" functionality
4. Support more complex patterns (e.g., "last Friday of month")
5. Add manual trigger for testing: `POST /api/tasks/recurring/generate`
6. Add recurring task templates that don't create instances until enabled

## Testing

To test the recurring task generation without waiting until midnight:

### Option 1: Change Cron Schedule (Temporary)

In `recurring-tasks.service.ts`, change:
```typescript
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
```

To:
```typescript
@Cron('*/5 * * * *')  // Every 5 minutes for testing
```

### Option 2: Add Manual Trigger Endpoint

Add to `tasks.controller.ts`:
```typescript
@Post('recurring/generate')
@UseGuards(JwtAuthGuard)
async generateRecurringTasks(@Request() req) {
  await this.recurringTasksService.generateRecurringTasks();
  return { message: 'Recurring tasks generated' };
}
```

### Option 3: Manually Call in Backend Logs

The service logs when it runs:
```
[RecurringTasksService] Starting recurring task generation...
[RecurringTasksService] Found X recurring tasks
[RecurringTasksService] Generated Y new task instances
```

## Database Considerations

- The original task with recurrence settings remains in the database
- Each generated instance is a separate document
- Completing a recurring instance does NOT mark the parent as complete
- Deleting a recurring instance does NOT delete the parent or future instances
- Deleting the parent task does NOT delete already-created instances

## Production Deployment

The cron job will automatically start when the application starts. No additional configuration needed beyond:

1. Ensure `@nestjs/schedule` is in dependencies
2. `ScheduleModule.forRoot()` is registered in AppModule
3. `RecurringTasksService` is provided in TasksModule

The service will log to console when running, which can be monitored in production logs.
