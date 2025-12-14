import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

export type TaskModule = 'maple' | 'poultry' | 'garden' | 'greenhouse' | 'livestock' | 'general';
export type TaskPriority = 'low' | 'medium' | 'high';
export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'custom';

@Schema({ _id: false })
export class Subtask {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: false })
  completed: boolean;
}

const SubtaskSchema = SchemaFactory.createForClass(Subtask);

@Schema({ _id: false })
export class RecurrenceSettings {
  @Prop({ required: true, enum: ['daily', 'weekly', 'monthly', 'custom'] })
  type: RecurrenceType;

  @Prop({ required: true, default: 1 })
  interval: number;

  @Prop({ type: [Number] })
  daysOfWeek?: number[];

  @Prop()
  endDate?: string;

  @Prop()
  occurrences?: number;
}

const RecurrenceSettingsSchema = SchemaFactory.createForClass(RecurrenceSettings);

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: false })
  projectId?: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: ['maple', 'poultry', 'garden', 'greenhouse', 'livestock', 'general'] })
  module: TaskModule;

  @Prop({ required: true })
  date: string;

  @Prop()
  endDate?: string;

  @Prop()
  time?: string;

  @Prop({ default: true })
  allDay: boolean;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ required: true, enum: ['low', 'medium', 'high'], default: 'medium' })
  priority: TaskPriority;

  @Prop({ type: RecurrenceSettingsSchema })
  recurrence?: RecurrenceSettings;

  @Prop({ type: [SubtaskSchema], default: [] })
  subtasks: Subtask[];

  createdAt: Date;
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// Transform _id to id for JSON responses
TaskSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
