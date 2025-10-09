import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { userModel } from '../../user/schema/user.schema';
import { timestamps } from '../../db/schema.helper';
import { userLogModel } from 'src/user/schema/user-log';

export const fileModel = pgTable('file', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  url: text('url'),
  userId: uuid('user_id').references(() => userModel.id),
  logId: uuid('log_id').references(() => userLogModel.id),
  ...timestamps,
});
