import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async adminlogIn(userName: string, pass: string): Promise<any> {
    const user = await this.userService.getUserByUserNameAndPassword(
      userName,
      pass,
    );
    if (user?.password != pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username, roles: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async userLogin(aiHash: string) {
    const user = await this.userService.getUserByAiHash(aiHash);
    if (!user.length) {
      throw new UnauthorizedException();
    }
    return;
  }
}
