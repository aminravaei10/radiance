import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../../db/schema.helper';
import { role } from '../enum/role.enum';

export const userModel = pgTable('user', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  firstName: text('firs_name').notNull(),
  lastName: text('last_name').notNull(),
  AIHash: text('ai_hash'),
  username: text('username').notNull().unique(),
  password: text('password'),
  role: text('roles').$type<role>().notNull(),
  ...timestamps,
});

export type UserInsert = typeof userModel.$inferInsert;
export type UserSelect = typeof userModel.$inferSelect;
