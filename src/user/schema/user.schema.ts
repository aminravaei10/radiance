import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../../db/schema.helper';
import { role } from '../enum/role.enum';

export const userModel = pgTable('user', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  firstName: text('firs_name'),
  lastName: text('last_name'),
  AIHash: text('ai_hash'),
  role: text('roles').$type<role>().notNull(),
  ...timestamps,
});
