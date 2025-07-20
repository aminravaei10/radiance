/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  AdminLoginDto,
  OperatorLoginDto,
  RefreshTokenDto,
} from './dtos/login.dto';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase,
    @Inject(UserService) private userService: UserService,
    private jwtService: JwtService,
  ) {}
  opratorLogin(loginDto: OperatorLoginDto) {
    return { message: 'Login successful', user: loginDto.aiHash };
  }

  // async adminLogin(
  //   adminLoginDto: AdminLoginDto,
  // ): Promise<{ access_token: string; refresh_token: string }> {
  //   const user = await this.userService.getUserByUserNameAndPassword(
  //     adminLoginDto.username,
  //     adminLoginDto.password,
  //   );

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  //   return {
  //     access_token: '',
  //     refresh_token: '',
  //   };
  // }

  async adminLogin(dto: AdminLoginDto) {
    const user = await this.userService.getUserByUserNameAndPassword(
      dto.username,
      dto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
      //
    }

    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    const refreshToken = '';

    return {
      accessToken,
      refreshToken,
    };
  }

  refreshToken(refreshTokenDto: RefreshTokenDto) {
    // Logic for refreshing the token
    return { message: 'Token refreshed', token: refreshTokenDto.refreshToken };
  }
}
