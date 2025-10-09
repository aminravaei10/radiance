import { pgTable, text, uuid, integer } from 'drizzle-orm/pg-core';
import { timestamps } from '../../db/schema.helper';
import { Status } from '../enum/status.enum';
import { userModel } from './user.schema';

export const userLogModel = pgTable('user_log', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  logId: text('log_id').notNull().unique(),
  personId: integer('person_id'),
  detectedTime: text('detected_time'),
  personType: text('status').$type<Status>().notNull().default(Status.Unknown),
  userId: uuid('user_id').references(() => userModel.id),
  ...timestamps,
});

export type UserLogInsert = typeof userLogModel.$inferInsert;
export type UserLogSelect = typeof userLogModel.$inferSelect;
