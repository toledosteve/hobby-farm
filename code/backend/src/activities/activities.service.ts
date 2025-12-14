import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  /**
   * Create a new activity record
   */
  async create(
    userId: string,
    projectId: string,
    createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    const activity = new this.activityModel({
      ...createActivityDto,
      userId: new Types.ObjectId(userId),
      projectId: new Types.ObjectId(projectId),
    });
    return activity.save();
  }

  /**
   * Get activities for a specific project
   */
  async findByProject(
    userId: string,
    projectId: string,
    limit = 20,
  ): Promise<Activity[]> {
    return this.activityModel
      .find({
        userId: new Types.ObjectId(userId),
        projectId: new Types.ObjectId(projectId),
      })
      .sort({ createdAt: -1 })
      .limit(Math.min(limit, 100))
      .exec();
  }

  /**
   * Get recent activities across all projects for a user
   */
  async findRecent(userId: string, limit = 10): Promise<Activity[]> {
    return this.activityModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(Math.min(limit, 100))
      .exec();
  }

  /**
   * Delete all activities for a specific entity (used when entity is deleted)
   */
  async deleteByEntity(entityType: string, entityId: string): Promise<number> {
    const result = await this.activityModel.deleteMany({
      entityType,
      entityId,
    });
    return result.deletedCount;
  }

  /**
   * Delete all activities for a project (used when project is deleted)
   */
  async deleteByProject(projectId: string): Promise<number> {
    const result = await this.activityModel.deleteMany({
      projectId: new Types.ObjectId(projectId),
    });
    return result.deletedCount;
  }

  /**
   * Delete all activities for a user (used when user account is deleted)
   */
  async deleteByUser(userId: string): Promise<number> {
    const result = await this.activityModel.deleteMany({
      userId: new Types.ObjectId(userId),
    });
    return result.deletedCount;
  }

  /**
   * Helper to log task-related activities
   */
  async logTaskActivity(
    userId: string,
    projectId: string,
    action: string,
    taskId: string,
    metadata?: Record<string, any>,
  ): Promise<Activity> {
    return this.create(userId, projectId, {
      action,
      category: 'task',
      entityType: 'task',
      entityId: taskId,
      metadata,
    });
  }

  /**
   * Helper to log subtask-related activities
   */
  async logSubtaskActivity(
    userId: string,
    projectId: string,
    action: string,
    subtaskId: string,
    metadata?: Record<string, any>,
  ): Promise<Activity> {
    return this.create(userId, projectId, {
      action,
      category: 'task',
      entityType: 'subtask',
      entityId: subtaskId,
      metadata,
    });
  }

  /**
   * Helper to log module-related activities
   */
  async logModuleActivity(
    userId: string,
    projectId: string,
    action: string,
    moduleName: string,
  ): Promise<Activity> {
    return this.create(userId, projectId, {
      action,
      category: 'module',
      entityType: 'module',
      entityId: moduleName,
      metadata: { module: moduleName },
    });
  }

  /**
   * Helper to log settings-related activities
   */
  async logSettingsActivity(
    userId: string,
    projectId: string,
    action: string,
    metadata?: Record<string, any>,
  ): Promise<Activity> {
    return this.create(userId, projectId, {
      action,
      category: 'settings',
      entityType: 'project',
      entityId: projectId,
      metadata,
    });
  }

  /**
   * Helper to log project-related activities
   */
  async logProjectActivity(
    userId: string,
    projectId: string,
    action: string,
    metadata?: Record<string, any>,
  ): Promise<Activity> {
    return this.create(userId, projectId, {
      action,
      category: 'project',
      entityType: 'project',
      entityId: projectId,
      metadata,
    });
  }
}
