import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ActivitiesService } from '../activities/activities.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private activitiesService: ActivitiesService,
  ) {}

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const taskData: any = {
      ...createTaskDto,
      userId: new Types.ObjectId(userId),
    };

    if (createTaskDto.projectId) {
      taskData.projectId = new Types.ObjectId(createTaskDto.projectId);
    }

    const task = new this.taskModel(taskData);
    const savedTask = await task.save();

    // Log activity
    if (createTaskDto.projectId) {
      await this.activitiesService.logTaskActivity(
        userId,
        createTaskDto.projectId,
        `Created task: ${savedTask.title}`,
        savedTask._id.toString(),
        { module: savedTask.module },
      );
    }

    return savedTask;
  }

  async findAll(userId: string, projectId?: string): Promise<Task[]> {
    const query: any = { userId: new Types.ObjectId(userId) };

    if (projectId) {
      query.projectId = new Types.ObjectId(projectId);
    }

    return this.taskModel
      .find(query)
      .sort({ date: 1, time: 1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Task not found');
    }

    const task = await this.taskModel.findById(id).exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const existingTask = await this.findOne(id, userId); // Verify ownership

    const updateData: any = { ...updateTaskDto };

    if (updateTaskDto.projectId) {
      updateData.projectId = new Types.ObjectId(updateTaskDto.projectId);
    }

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    // Log subtask activities if subtasks were updated
    if (updateTaskDto.subtasks && existingTask.projectId) {
      const projectId = existingTask.projectId.toString();
      const oldSubtasks = existingTask.subtasks || [];
      const newSubtasks = updateTaskDto.subtasks || [];

      // Find newly completed subtasks
      for (const newSt of newSubtasks) {
        const oldSt = oldSubtasks.find(s => s.id === newSt.id);
        if (oldSt && !oldSt.completed && newSt.completed) {
          await this.activitiesService.logSubtaskActivity(
            userId,
            projectId,
            `Completed subtask: ${newSt.title}`,
            newSt.id,
            { parentTaskId: id, parentTaskTitle: existingTask.title },
          );
        }
      }

      // Find newly added subtasks
      for (const newSt of newSubtasks) {
        const exists = oldSubtasks.find(s => s.id === newSt.id);
        if (!exists) {
          await this.activitiesService.logSubtaskActivity(
            userId,
            projectId,
            `Added subtask: ${newSt.title}`,
            newSt.id,
            { parentTaskId: id, parentTaskTitle: existingTask.title },
          );
        }
      }
    }

    return updatedTask;
  }

  async toggleComplete(id: string, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(
        id,
        { completed: !task.completed },
        { new: true }
      )
      .exec();

    // Log activity
    if (task.projectId) {
      const action = updatedTask.completed
        ? `Completed task: ${task.title}`
        : `Reopened task: ${task.title}`;
      await this.activitiesService.logTaskActivity(
        userId,
        task.projectId.toString(),
        action,
        id,
        { module: task.module },
      );
    }

    return updatedTask;
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId); // Verify ownership

    // Log activity before deletion
    if (task.projectId) {
      await this.activitiesService.logTaskActivity(
        userId,
        task.projectId.toString(),
        `Deleted task: ${task.title}`,
        id,
        { module: task.module },
      );
    }

    await this.taskModel.findByIdAndDelete(id).exec();
  }

  async getTaskStats(userId: string, projectId?: string): Promise<any> {
    const query: any = { userId: new Types.ObjectId(userId) };

    if (projectId) {
      query.projectId = new Types.ObjectId(projectId);
    }

    const tasks = await this.taskModel.find(query).exec();

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      overdue: tasks.filter(t => !t.completed && t.date < today).length,
      byModule: {
        maple: tasks.filter(t => t.module === 'maple').length,
        poultry: tasks.filter(t => t.module === 'poultry').length,
        garden: tasks.filter(t => t.module === 'garden').length,
        greenhouse: tasks.filter(t => t.module === 'greenhouse').length,
        livestock: tasks.filter(t => t.module === 'livestock').length,
        general: tasks.filter(t => t.module === 'general').length,
      },
      byPriority: {
        low: tasks.filter(t => t.priority === 'low').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        high: tasks.filter(t => t.priority === 'high').length,
      },
    };

    return stats;
  }
}
