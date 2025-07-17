ALTER TABLE "user" ALTER COLUMN "firs_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "last_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password" text;