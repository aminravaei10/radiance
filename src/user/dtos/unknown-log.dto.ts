import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Status } from '../enum/status.enum';

export class AddUserLogDto {
  @ApiProperty()
  @IsString()
  log_id: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  person_id: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  timestamp?: number;

  @ApiProperty({
    example: 'Known',
    enum: [Status.Known],
    description: 'Person type',
  })
  @IsEnum([Status.Known, Status.Unknown])
  person_type: Status.Known | Status.Unknown;
}
