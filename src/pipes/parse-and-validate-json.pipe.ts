/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

  transform(value: any): any {
    let parsed;

    console.log(value);
    try {
      if (typeof value !== 'string') {
        parsed = value;
      } else {
        parsed = JSON.parse(value);
      }
    } catch (err) {
      Logger.error('Invalid JSON format', err);
      throw new BadRequestException('Invalid JSON format');
    }

    const object = plainToInstance(this.classType, parsed, {
      enableImplicitConversion: true,
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
