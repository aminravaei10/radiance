import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseAndValidateJsonPipe } from 'src/pipes/parse-and-validate-json.pipe';
import { AuthGuard } from 'src/auth/auth.guard';
import { EditUserDto } from './dtos/edit-user.dto';
import { UUID } from 'crypto';
import { AddUserLogDto } from './dtos/unknown-log.dto';

@ApiTags('User APIS')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('/:id')
  @ApiBody({
    description: 'edit one user by id',
    type: EditUserDto,
  })
  @ApiOperation({ summary: 'edit a user by id' })
  updateUserById(@Body() body: EditUserDto, @Param('id') id: UUID) {
    return this.userService.updateUserById(id, body);
  }

  @Post('/log')
  @ApiOperation({ summary: 'add a log' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'add log of an unknown person with image file and a known log without image',
    type: AddUserLogDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  addUnknownUser(
    @UploadedFile() file: Express.Multer.File,
    @Body('body', new ParseAndValidateJsonPipe(AddUserLogDto))
    dto: unknown,
  ) {
    return this.userService.addUserLog(dto as AddUserLogDto, file);
  }

  @ApiOperation({ summary: 'Get logs with pagination' })
  @Get('/logs')
  getLogs() {
    return this.userService.getLogs();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/upgrade/log/:id')
  @ApiBody({
    description: 'upgrade a unknown log to a known user',
    type: EditUserDto,
  })
  @ApiOperation({ summary: 'upgrade a log to an user' })
  upgradeLogToUser(@Body() body: EditUserDto, @Param('id') id: UUID) {
    return this.userService.upgradeLogToUser(id, body);
  }
}
