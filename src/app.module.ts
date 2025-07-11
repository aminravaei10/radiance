import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, DrizzleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
