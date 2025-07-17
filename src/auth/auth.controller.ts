import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminLoginDto, OperatorLoginDto } from './dtos/login.dto';

@ApiTags('Admin-Auth')
@ApiBearerAuth()
@Controller('/auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/oprator')
  opratorLogin(@Body() body: OperatorLoginDto) {
    return this.authService.opratorLogin(body);
  }

  @Post('login/admin')
  adminLogin(@Body() body: AdminLoginDto) {
    return this.authService.adminLogin(body);
  }
}
