import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, connection } from './connection';
import { ensureDatabaseExists } from './create-db';
import 'dotenv/config';

export async function migrator(): Promise<void> {
  try {
    await ensureDatabaseExists(process.env.POSTGRES_DATABASE as string);
    await migrate(db, { migrationsFolder: 'database' });
    console.log('Migration ended...');
  } catch (error) {
    console.log('Migrator error', error);
  } finally {
    await connection.end();
  }
}
// migrator();

export default migrator;
