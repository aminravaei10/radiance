import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { tokenModel } from './schema/token.schema';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

export interface CreateUserResponse {
  id: number;
  create_by_id: number;
  update_by_id?: null;
  first_name: string;
  last_name: string;
  user_name: string;
  id_card: string;
  phone_number: string;
  is_active: boolean;
  group?: null;
  group_id?: null;
}

export interface assignLogToPerson {
  id: number;
  create_by_id: number;
  update_by_id: null;
  is_active: boolean;
  is_extracted: boolean;
  image_path: 'string';
  thumbnail_path: 'string';
  file_name: null;
  reason: null;
}

@Injectable()
export class AiService {
  baseUrl: string | undefined;
  accessToken: string | undefined;
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.baseUrl = process.env.AI_DASHBOARD_BASE_URL;
  }

  async assignLogToPerson(
    logId: number,
    personId: number,
  ): Promise<assignLogToPerson> {
    try {
      const url = `${this.baseUrl}/api/v5/face-bank/face-image/${personId}/add-image-from-report/${logId}/`;

      const headers = {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      };
      const response = await firstValueFrom(
        this.httpService.post(url, {}, { headers }),
      );

      console.log('assign log to person response.data: ', response.data);
      return response.data as assignLogToPerson;
    } catch (error) {
      console.log(
        'AI dashboard assign log to person error : ',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.response?.data,
      );
      throw error;
    }
  }

  async createUser(userId: string): Promise<CreateUserResponse> {
    try {
      const url = `${this.baseUrl}/api/v5/face-bank/`;
      const body = {
        first_name: 'string',
        last_name: 'string',
        user_name: userId,
        id_card: userId,
        phone_number: userId,
        is_active: true,
        group_id: null,
      };

      const headers = {
        accept: 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      };

      const response = await firstValueFrom(
        this.httpService.post(url, body, {
          headers,
        }),
      );
      console.log(response.data);
      return response.data as CreateUserResponse;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log('AI dashboard create user error: ', error.response.data);
      throw error;
    }
  }

  async aiDashboardLogIn() {
    try {
      const username = process.env.AI_DASHBOARD_USERNAME || 'admin';
      const password = process.env.AI_DASHBOARD_PASSWORD || 'admin';
      const url = `${this.baseUrl}/api/v5/account/login`;
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          new URLSearchParams({ username, password }), // converts to form-data
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'application/json',
            },
          },
        ),
      );
      console.log(response.data);
      await this.db.insert(tokenModel).values({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        accessToken: response?.data?.access_token as string,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        refreshToken: response?.data?.refresh_token as string,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.accessToken = response?.data?.access_token as string;
      console.log(this.accessToken);
      return response;
    } catch (error) {
      console.log('error: ', error);
      throw error;
    }
  }

  async onApplicationBootstrap() {
    console.log('getting token from ai dashboard started');
    await this.aiDashboardLogIn();
    console.log('token fetch from ai dashboard successfully');
  }
}
