import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SoilCacheDocument = HydratedDocument<SoilCache>;

@Schema({ timestamps: true })
export class SoilCache {
  @Prop({ required: true, unique: true, index: true })
  cacheKey: string;  // Hash of polygon coordinates

  @Prop({ required: true })
  provider: string;  // e.g., "usda-ssurgo"

  @Prop({ type: Object, required: true })
  polygon: {
    type: string;
    coordinates: number[][][];
  };

  @Prop({ type: Object, required: true })
  summary: Record<string, any>;  // SoilSummary data

  @Prop({ required: true })
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const SoilCacheSchema = SchemaFactory.createForClass(SoilCache);

// TTL index for automatic cache expiration
SoilCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Transform for JSON responses
SoilCacheSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
