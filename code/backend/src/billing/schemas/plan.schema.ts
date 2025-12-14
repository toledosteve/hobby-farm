import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlanDocument = HydratedDocument<Plan>;

// Feature limits for each plan
export interface PlanLimits {
  maxProjects: number | null; // null = unlimited
  maxModules: number | null; // null = unlimited
  maxStorageBytes: number; // in bytes
  hasWeatherForecasting: boolean;
  hasPrioritySupport: boolean;
  hasMobileAccess: boolean;
  hasAdvancedFeatures: boolean;
}

// Feature display info
export interface PlanFeature {
  text: string;
  included: boolean;
}

@Schema({ timestamps: true })
export class Plan {
  @Prop({ required: true, unique: true })
  stripePriceId: string;

  @Prop({ required: true })
  stripeProductId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  priceMonthly: number; // in cents

  @Prop({ default: 'month' })
  billingInterval: 'month' | 'year';

  @Prop({ type: Object, required: true })
  limits: PlanLimits;

  @Prop({ type: [Object], default: [] })
  features: PlanFeature[];

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFree: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);

// Transform for JSON responses
PlanSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
