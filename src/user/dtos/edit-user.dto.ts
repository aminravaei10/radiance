import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Role } from '../enum/role.enum';

export class EditUserDto {
  @ApiProperty()
  @IsString()
  fName: string;

  @ApiProperty()
  @IsString()
  lName: string;

  @ApiProperty()
  @IsString()
  mobile: string;

  @ApiProperty()
  @IsString()
  role: Role;
}
