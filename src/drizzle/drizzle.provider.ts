import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const DrizzleAsyncProvider = 'DrizzleAsyncProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,

    useFactory: () => {
      const pool = new Pool({
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DATABASE,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT as unknown as number,
      });
      return drizzle(pool);
    },
  },
];
