import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UsageDocument = HydratedDocument<Usage>;

@Schema({ timestamps: true })
export class Usage {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  // Number of farm projects created
  @Prop({ default: 0 })
  projectCount: number;

  // Number of enabled modules across all projects
  @Prop({ default: 0 })
  moduleCount: number;

  // Storage used in bytes
  @Prop({ default: 0 })
  storageUsedBytes: number;

  // Last time usage was recalculated
  @Prop()
  lastCalculatedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const UsageSchema = SchemaFactory.createForClass(Usage);

// Index for faster lookups
UsageSchema.index({ userId: 1 });

// Transform for JSON responses
UsageSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
