import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string;
  @ApiProperty()
  @IsString()
  fName: string;

  @ApiProperty()
  @IsString()
  lName: string;

  @ApiProperty()
  @IsString()
  aiHash: string;
}
