import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OperatorLoginDto {
  @ApiProperty()
  @IsString()
  aiHash: string;
}

export class AdminLoginDto {
  @ApiProperty()
  @IsString()
  username: string;
  @ApiProperty()
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  @ApiProperty()
  refreshToken: string;
}
