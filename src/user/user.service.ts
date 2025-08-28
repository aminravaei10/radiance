import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { userModel, UserSelect } from './schema/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { Role } from './enum/role.enum';
import { eq, and } from 'drizzle-orm';
import { FileService } from 'src/file/file.service';
import { fileModel } from 'src/file/schema/file.schema';
import { EditUserDto } from './dtos/edit-user.dto';
import { UUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase,
    @Inject(FileService) private fileService: FileService,
  ) {}
  async createUser(dto: CreateUserDto, file?: Express.Multer.File) {
    try {
      const user = await this.db
        .insert(userModel)
        .values({
          firstName: dto.fName || '',
          lastName: dto.lName || '',
          AIHash: dto.aiHash,
          role: Role.Operator,
          mobile: dto.mobile,
        })
        .returning({
          userId: userModel.id,
        });
      if (file) {
        await this.fileService.uploadFile(user[0].userId, file);
      }
    } catch (error) {
      console.log('error: ', error);
      throw new BadRequestException(error);
    }

    return { message: 'User created successfully' };
  }

  async getUserByUserNameAndPassword(
    username: string,
    password: string,
  ): Promise<UserSelect> {
    const users = await this.db
      .select()
      .from(userModel)
      .where(
        and(eq(userModel.username, username), eq(userModel.password, password)),
      );
    return users[0];
  }

  async getAllUsers() {
    return await this.db
      .select({
        id: userModel.id,
        name: userModel.firstName,
        lastName: userModel.lastName,
        imageUrl: fileModel.url,
        mobile: userModel.mobile,
      })
      .from(userModel)
      .leftJoin(fileModel, eq(fileModel.userId, userModel.id));
  }

  async getUserByAiHash(aiHash: string) {
    return await this.db
      .select()
      .from(userModel)
      .where(eq(userModel.AIHash, aiHash));
  }

  async updateUserById(id: UUID, user: EditUserDto) {
    return await this.db
      .update(userModel)
      .set({
        firstName: user.fName,
        lastName: user.lName,
        mobile: user.mobile,
        role: user.role,
      })
      .where(eq(userModel.id, id));
  }

  async onApplicationBootstrap() {
    await this.db
      .insert(userModel)
      .values({
        username: (process.env.ADMIN_USERNAME as string) || 'admin',
        firstName: 'Admin',
        lastName: 'Admin',
        AIHash: 'admin-hash',
        password: (process.env.ADMIN_PASSWORD as string) || 'admin',
        role: Role.Admin,
      })
      .onConflictDoNothing();
    console.log('UserService initialized');
  }
}
