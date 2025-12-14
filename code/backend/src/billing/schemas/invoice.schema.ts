import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  stripeInvoiceId: string;

  @Prop({ required: true })
  stripeCustomerId: string;

  @Prop()
  stripeSubscriptionId?: string;

  @Prop({ required: true })
  amountDue: number; // in cents

  @Prop({ required: true })
  amountPaid: number; // in cents

  @Prop({ required: true })
  currency: string;

  @Prop({ type: String, required: true })
  status: InvoiceStatus;

  @Prop()
  invoiceNumber?: string;

  @Prop()
  invoicePdfUrl?: string;

  @Prop()
  hostedInvoiceUrl?: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  periodStart: Date;

  @Prop({ required: true })
  periodEnd: Date;

  @Prop()
  paidAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

// Indexes for faster lookups
InvoiceSchema.index({ userId: 1, createdAt: -1 });
InvoiceSchema.index({ stripeInvoiceId: 1 });
InvoiceSchema.index({ stripeCustomerId: 1 });

// Transform for JSON responses
InvoiceSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
