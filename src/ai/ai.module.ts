import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { HttpModule } from '@nestjs/axios';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  providers: [AiService],
  imports: [HttpModule, DrizzleModule],
  exports: [AiService],
})
export class AiModule {}
