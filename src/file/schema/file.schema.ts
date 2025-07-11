import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { users } from '../../user/schema/user.schema';
import { timestamps } from '../../db/schema.helper';

export const files = pgTable('file', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  url: text('url'),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ...timestamps,
});
