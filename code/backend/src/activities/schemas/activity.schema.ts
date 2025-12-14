import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityDocument = Activity & Document;

export type ActivityCategory =
  | 'task'
  | 'module'
  | 'settings'
  | 'project'
  | 'maple'
  | 'poultry'
  | 'garden'
  | 'general';

@Schema({ timestamps: true })
export class Activity {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true })
  action: string;

  @Prop({
    required: true,
    enum: ['task', 'module', 'settings', 'project', 'maple', 'poultry', 'garden', 'general'],
  })
  category: ActivityCategory;

  @Prop()
  entityType?: string;

  @Prop()
  entityId?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);

// Transform _id to id in JSON output
ActivitySchema.set('toJSON', {
  transform: (doc: any, ret: any) => {
    ret.id = ret._id.toString();
    ret.projectId = ret.projectId?.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.userId;
    return ret;
  },
});

// Index for efficient queries
ActivitySchema.index({ userId: 1, projectId: 1, createdAt: -1 });
ActivitySchema.index({ userId: 1, createdAt: -1 });
