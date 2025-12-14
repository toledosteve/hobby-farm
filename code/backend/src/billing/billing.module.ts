import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

import { Subscription, SubscriptionSchema } from './schemas/subscription.schema';
import { Plan, PlanSchema } from './schemas/plan.schema';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { Usage, UsageSchema } from './schemas/usage.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Project, ProjectSchema } from '../projects/schemas/project.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Usage.name, schema: UsageSchema },
      { name: User.name, schema: UserSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
