import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ActivityCategory } from '../schemas/activity.schema';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsEnum(['task', 'module', 'settings', 'project', 'maple', 'poultry', 'garden', 'general'])
  @IsNotEmpty()
  category: ActivityCategory;

  @IsString()
  @IsOptional()
  entityType?: string;

  @IsString()
  @IsOptional()
  entityId?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
