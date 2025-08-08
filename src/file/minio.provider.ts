import { Provider } from '@nestjs/common';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';

export const MinioProvider: Provider = {
  provide: Client,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const endPoint = configService.get<string>('OBJECT_STORAGE_ENDPOINT')!;
    const useSSL = configService.get<string>('OBJECT_STORAGE_SSL') === 'true';
    const accessKey = configService.get<string>('OBJECT_STORAGE_ACCESS_KEY')!;
    const secretKey = configService.get<string>('OBJECT_STORAGE_SECRET_KEY')!;
    const port = useSSL ? 443 : 80;

    return new Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });
  },
};
