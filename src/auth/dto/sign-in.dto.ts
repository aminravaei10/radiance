import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AdminLogin {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  pass: string;
}

export class UserLogIn {
  @ApiProperty()
  @IsString()
  aiHash: string;
}
