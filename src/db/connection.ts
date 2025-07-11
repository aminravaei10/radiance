import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import { Pool } from 'pg';

export const connection = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: parseInt(process.env.POSTGRES_PORT as string, 10),
});

export const db = drizzle(connection);
