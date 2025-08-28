import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lName: string;

  @ApiProperty()
  @IsString()
  aiHash: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mobile: string;
}
