import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SoilController } from './soil.controller';
import { SoilService } from './soil.service';
import { SoilCache, SoilCacheSchema } from './schemas/soil-cache.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SoilCache.name, schema: SoilCacheSchema },
    ]),
  ],
  controllers: [SoilController],
  providers: [SoilService],
  exports: [SoilService],
})
export class SoilModule {}
