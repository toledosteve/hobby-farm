import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

// Embedded Season interface
export interface Season {
  id: string;
  name: string;
  year: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

// GeoJSON Polygon interface
export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][]; // [[[lng, lat], [lng, lat], ...]]
}

// Boundary interface for farm property outline
export interface Boundary {
  geojson: GeoJSONPolygon;
  acres: number;
  perimeterFeet: number;
}

// Map annotation types
export type MarkerType = 'tree' | 'barn' | 'sugar-shack' | 'water' | 'gate' | 'other';

export interface MapMarker {
  id: string;
  type: MarkerType;
  label?: string;
  coordinates: [number, number]; // [lat, lng]
  notes?: string;
  createdAt: Date;
}

export interface MapPath {
  id: string;
  name?: string;
  color?: string;
  coordinates: [number, number][]; // [[lat, lng], ...]
  lengthFeet?: number;
  notes?: string;
  createdAt: Date;
}

export interface MapZone {
  id: string;
  name?: string;
  color?: string;
  geojson: GeoJSONPolygon;
  acres?: number;
  zoneType?: 'pasture' | 'garden' | 'orchard' | 'woods' | 'wetland' | 'custom';
  notes?: string;
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Project {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  acres?: number;

  @Prop()
  description?: string;

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  zipCode?: string;

  @Prop({ type: [String], default: [] })
  enabledModules: string[];

  @Prop({ type: [Object], default: [] })
  seasons: Season[];

  @Prop()
  currentSeasonId?: string;

  @Prop({ type: Object, default: null })
  boundary?: Boundary;

  @Prop()
  latitude?: number;

  @Prop()
  longitude?: number;

  // Map annotations
  @Prop({ type: [Object], default: [] })
  markers: MapMarker[];

  @Prop({ type: [Object], default: [] })
  paths: MapPath[];

  @Prop({ type: [Object], default: [] })
  zones: MapZone[];

  createdAt: Date;

  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

// Transform _id to id for JSON responses
ProjectSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
