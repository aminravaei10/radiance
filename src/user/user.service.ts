import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { userModel } from './schema/user.schema';
import { CtreateUserDto } from './dtos/create-user.dto';
import { role } from './enum/role.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase,
  ) {}
  async createUser(dto: CtreateUserDto) {
    return await this.db.insert(userModel).values({
      firstName: dto.fName,
      lastName: dto.lName,
      AIHash: dto.aiHash,
      role: role.Operator,
    });
  }
}
