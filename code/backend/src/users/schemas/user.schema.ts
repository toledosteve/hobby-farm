import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  phoneNumber?: string;

  @Prop()
  timezone?: string;

  @Prop()
  preferredUnits?: string;

  @Prop()
  profilePhotoUrl?: string;

  // Stripe customer ID for billing
  @Prop({ unique: true, sparse: true })
  stripeCustomerId?: string;

  @Prop({
    type: Object,
    default: () => ({
      landingPage: 'dashboard',
      darkMode: 'light',
      language: 'en',
      emailNotifications: true,
      pushNotifications: false,
      weeklySummary: true,
      temperature: 'fahrenheit',
      distance: 'miles',
      volume: 'gallons',
      weight: 'pounds',
    }),
  })
  preferences?: {
    landingPage?: string;
    darkMode?: string;
    language?: string;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    weeklySummary?: boolean;
    temperature?: string;
    distance?: string;
    volume?: string;
    weight?: string;
  };

  createdAt: Date;

  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
