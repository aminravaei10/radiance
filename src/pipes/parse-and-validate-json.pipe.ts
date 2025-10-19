/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

    try {
      console.log('value type', typeof value);
      console.log('value body type', typeof value.body);
      if (typeof value !== 'string') {
        console.log('object value: ', value.body);
        parsed = value.body;
      } else {
        console.log('string value', value);
        parsed = JSON.parse(value);
        console.log('parsed: ', parsed);
      }
    } catch (err) {
      Logger.error('Invalid JSON format', err);
      throw new BadRequestException('Invalid JSON format');
    }

    const object = plainToInstance(this.classType, parsed, {
      enableImplicitConversion: true,
    });
    console.log('object: ', object);

    const errors = validateSync(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    console.log('errors: ', errors);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    console.log('final object: ', object);
    return object;
  }
}
