import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseAndValidateJsonPipe } from 'src/pipes/parse-and-validate-json.pipe';
// import type { Response } from 'express';
// import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('User APIS')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new vmap' })
  @Post()
  @ApiOperation({ summary: 'Create user with JSON and file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User data and avatar',
    type: CreateUserDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  createUser(
    @UploadedFile() file: Express.Multer.File,
    @Body('userData', new ParseAndValidateJsonPipe(CreateUserDto))
    dto: unknown,
  ) {
    return this.userService.createUser(dto as CreateUserDto, file);
  }
}
