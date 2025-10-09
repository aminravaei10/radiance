import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './../env' }),
    UserModule,
    DrizzleModule,
    FileModule,
    AuthModule,
    AiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
