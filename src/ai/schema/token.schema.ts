import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../../db/schema.helper';

export const tokenModel = pgTable('token', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  ...timestamps,
});

export type TokenInsert = typeof tokenModel.$inferInsert;
export type TokenSelect = typeof tokenModel.$inferSelect;
