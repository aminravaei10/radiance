import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class ParseAndValidateJsonPipe implements PipeTransform {
  constructor(private readonly classType: any) {}

  transform(value: string) {
    console.log('are you here? ');
    let parsed;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      parsed = JSON.parse(value);
    } catch (err) {
      Logger.error('Invalid JSON format', err);
      throw new BadRequestException('Invalid JSON format');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const object = plainToInstance(this.classType, parsed, {
      enableImplicitConversion: true, // ✅ This solves the issue
    });

    const errors = validateSync(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return object;
  }
}
