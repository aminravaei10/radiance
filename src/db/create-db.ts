import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';

export async function ensureDatabaseExists(
  databaseName: string,
): Promise<void> {
  const config = new ConfigService();
  const client = new Client({
    host: config.get<string>('POSTGRES_HOST'),
    user: config.get<string>('POSTGRES_USER'),
    password: config.get('POSTGRES_PASSWORD'),
    port: parseInt(config.get('POSTGRES_PORT') as string, 10),
    database: 'postgres',
  });

  try {
    await client.connect();
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [databaseName],
    );

    if (result.rowCount === 0) {
      console.log(`Database "${databaseName}" does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${databaseName}"`);
      console.log(`Database "${databaseName}" created successfully.`);
    } else {
      console.log(`Database "${databaseName}" already exists.`);
    }
  } catch (error) {
    console.error('Error checking or creating database:', error);
    throw error;
  } finally {
    await client.end();
  }
}
