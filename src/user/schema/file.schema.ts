import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
export const users = pgTable('user', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  firstName: text('firs_name'),
  lastName: text('last_name'),
  AIHash: text('ai_hash'),
});
