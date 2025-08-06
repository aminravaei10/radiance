import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as AuthDto from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('admin-login')
  logIn(@Body() signInDto: AuthDto.AdminLogin) {
    return this.authService.adminlogIn(signInDto.username, signInDto.pass);
  }

  @Post('user-login')
  userLogin(@Body() userLogin: AuthDto.UserLogIn) {
    return this.authService.userLogin(userLogin.aiHash);
  }
}
