import { Inject, Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { fileModel } from './schema/file.schema';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';

@Injectable()
export class FileService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase,
    private readonly configService: ConfigService,
    private readonly minioClient: Minio.Client,
  ) {}

  async uploadFile(userId: string, file: Express.Multer.File) {
    try {
      const fileInDb = await this.db
        .insert(fileModel)
        .values({
          logId: userId,
          url: '',
        })
        .returning({ id: fileModel.id });
      const bucket = this.configService.get<string>('BUCKET_NAME') as string;
      await this.minioClient.putObject(bucket, fileInDb[0].id, file.buffer);

      await this.db
        .update(fileModel)
        .set({
          url: `https://tanaglley.s3.ir-thr-at1.arvanstorage.ir/${fileInDb[0].id}`,
        })
        .where(eq(fileModel.id, fileInDb[0].id));
      return {
        url: `https://tanaglley.s3.ir-thr-at1.arvanstorage.ir/${fileInDb[0].id}`,
      };
    } catch (error) {
      console.log('file upload error: ', error);
      throw error;
    }
  }
}
