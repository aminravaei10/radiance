import { Inject, Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { fileModel } from './schema/file.schema';

@Injectable()
export class FileService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase,
  ) {}
  private minioClient: Minio.Client;

  async uploadFile(userId: string, bucket: string, file: Express.Multer.File) {
    console.log('file: ', file);
    console.log('bucket: ', bucket);
    await this.minioClient.putObject(bucket, file.originalname, file.buffer);
    await this.insertFile(userId, `${bucket}/${file.originalname}`);
    return {
      url: `${bucket}/${file.originalname}`,
    };
  }

  async insertFile(userId: string, url: string) {
    await this.db.insert(fileModel).values({
      userId,
      url,
    });
  }
}
