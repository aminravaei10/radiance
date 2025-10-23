import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { userModel, UserSelect } from './schema/user.schema';
import { Role } from './enum/role.enum';
import { eq, and, desc } from 'drizzle-orm';
import { FileService } from 'src/file/file.service';
import { fileModel } from 'src/file/schema/file.schema';
import { EditUserDto } from './dtos/edit-user.dto';
import { UUID } from 'crypto';
import { AddUserLogDto } from './dtos/unknown-log.dto';
import { userLogModel } from './schema/user-log';
import { Status } from './enum/status.enum';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase,
    @Inject(FileService) private fileService: FileService,
    @Inject(AiService) private aiService: AiService,
  ) {}

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

  async getUserByPersonId(personId: string) {
    return await this.db
      .select()
      .from(userModel)
      .where(eq(userModel.personId, personId));
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

  async addUserLog(dto: AddUserLogDto, file?: Express.Multer.File) {
    try {
      const userLog = await this.db
        .insert(userLogModel)
        .values({
          personId: dto.person_id,
          logId: dto.log_id,
          detectedTime: dto.timestamp?.toString() || new Date().toISOString(),
          personType: dto.person_type,
        })
        .returning({ id: userLogModel.id });
      if (!file && dto.person_type === Status.Unknown) {
        throw new BadRequestException(
          'Image file is required for unknown person type',
        );
      }
      if (file && dto.person_type === Status.Unknown) {
        await this.fileService.uploadFile(userLog[0].id, file);
      } else if (dto.person_type === Status.Known && !file) {
        const user = await this.db
          .select()
          .from(userModel)
          .where(eq(userModel.personId, dto.person_id.toString()));
        if (user.length) {
          await this.db
            .update(userLogModel)
            .set({ userId: user[0].id })
            .where(eq(userLogModel.id, userLog[0].id));
        } else {
          throw new BadRequestException('No user found with this person_id');
        }
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.cause?.code === '23505') {
        throw new BadRequestException('Log with this log_id already exists');
      }
      throw new BadRequestException(error);
    }
  }

  async getLogs(pageSize: number = 50, pageNumber: number = 1) {
    return await this.db
      .select()
      .from(userLogModel)
      .leftJoin(fileModel, eq(fileModel.logId, userLogModel.id))
      .leftJoin(userModel, eq(userModel.id, userLogModel.userId))
      .limit(pageSize)
      .offset(pageSize * (pageNumber - 1))
      .orderBy(desc(userLogModel.created_at));
  }

  async upgradeLogToUser(id: UUID, dto: EditUserDto) {
    await this.db.transaction(async (tx) => {
      const log = await tx
        .select()
        .from(userLogModel)
        .where(eq(userLogModel.id, id));

      const user = await tx
        .insert(userModel)
        .values({
          firstName: dto.fName,
          lastName: dto.lName,
          mobile: dto.mobile,
          role: Role.Customer,
        })
        .returning({
          userId: userModel.id,
        });

      const createdUserByAI = await this.aiService.createUser(user[0].userId);
      console.log('log has id:', log[0]);
      console.log('createdUserByAI: ', createdUserByAI);
      await this.aiService.assignLogToPerson(
        parseInt(log[0].logId.toString()),
        createdUserByAI.id,
      );
      await tx
        .update(userModel)
        .set({ personId: createdUserByAI.id.toString() })
        .where(eq(userModel.id, user[0].userId));

      await tx
        .update(userLogModel)
        .set({ userId: user[0].userId, personType: Status.Known })
        .where(eq(userLogModel.id, id));
    });
  }

  async onApplicationBootstrap() {
    await this.db
      .insert(userModel)
      .values({
        username: (process.env.ADMIN_USERNAME as string) || 'admin',
        firstName: 'Admin',
        lastName: 'Admin',
        personId: 'admin-hash',
        password: (process.env.ADMIN_PASSWORD as string) || 'admin',
        role: Role.Admin,
        mobile: '09307003231',
      })
      .onConflictDoNothing();
    console.log('UserService initialized');
  }
}
