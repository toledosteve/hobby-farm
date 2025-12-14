import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { RecurringTasksService } from './recurring-tasks.service';
import { Task, TaskSchema } from './schemas/task.schema';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    ActivitiesModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, RecurringTasksService],
  exports: [TasksService],
})
export class TasksModule {}
