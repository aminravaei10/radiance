import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../../db/schema.helper';
import { Role } from '../enum/role.enum';

export const userModel = pgTable('user', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  firstName: text('firs_name').notNull(),
  lastName: text('last_name').notNull(),
  AIHash: text('ai_hash').unique(),
  username: text('username').unique(),
  password: text('password'),
  mobile: text('mobile').unique(),
  role: text('roles').$type<Role>().notNull(),
  ...timestamps,
});

export type UserInsert = typeof userModel.$inferInsert;
export type UserSelect = typeof userModel.$inferSelect;
