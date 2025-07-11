import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CtreateUserDto } from './dtos/create-user.dto';

@ApiTags('User APIS')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new vmap' })
  @Post()
  createUser(@Body() dto: CtreateUserDto) {
    return this.userService.createUser(dto);
  }
}
