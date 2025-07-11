import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
export const files = pgTable('user', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  url: text('url'),
});
