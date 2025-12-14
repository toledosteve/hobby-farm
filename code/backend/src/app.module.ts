import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { SessionsModule } from './sessions/sessions.module';
import { TasksModule } from './tasks/tasks.module';
import { WeatherModule } from './weather/weather.module';
import { ActivitiesModule } from './activities/activities.module';
import { BillingModule } from './billing/billing.module';
import { SoilModule } from './soil/soil.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/hobby-farm',
    ),
    AuthModule,
    UsersModule,
    ProjectsModule,
    SessionsModule,
    TasksModule,
    WeatherModule,
    ActivitiesModule,
    BillingModule,
    SoilModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
