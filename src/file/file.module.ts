import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { MinioProvider } from './minio.provider';

@Module({
  imports: [DrizzleModule],
  providers: [FileService, MinioProvider],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
