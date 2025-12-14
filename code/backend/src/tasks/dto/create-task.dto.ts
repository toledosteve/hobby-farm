import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class SubtaskDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  completed: boolean;
}

class RecurrenceSettingsDto {
  @IsEnum(['daily', 'weekly', 'monthly', 'custom'])
  @IsNotEmpty()
  type: 'daily' | 'weekly' | 'monthly' | 'custom';

  @IsNumber()
  @Min(1)
  interval: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  daysOfWeek?: number[];

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  occurrences?: number;
}

export class CreateTaskDto {
  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['maple', 'poultry', 'garden', 'greenhouse', 'livestock', 'general'])
  @IsNotEmpty()
  module: 'maple' | 'poultry' | 'garden' | 'greenhouse' | 'livestock' | 'general';

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsBoolean()
  @IsOptional()
  allDay?: boolean;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsEnum(['low', 'medium', 'high'])
  @IsOptional()
  priority?: 'low' | 'medium' | 'high';

  @ValidateNested()
  @Type(() => RecurrenceSettingsDto)
  @IsOptional()
  recurrence?: RecurrenceSettingsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubtaskDto)
  @IsOptional()
  subtasks?: SubtaskDto[];
}
