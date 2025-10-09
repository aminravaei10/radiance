CREATE TABLE "token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"log_id" text NOT NULL,
	"person_id" integer,
	"detected_time" text,
	"status" text DEFAULT 'unknown' NOT NULL,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_ai_hash_unique";--> statement-breakpoint
ALTER TABLE "file" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "file" ADD COLUMN "log_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "person_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "detected_time" text;--> statement-breakpoint
ALTER TABLE "user_log" ADD CONSTRAINT "user_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_log_id_user_log_id_fk" FOREIGN KEY ("log_id") REFERENCES "public"."user_log"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "ai_hash";