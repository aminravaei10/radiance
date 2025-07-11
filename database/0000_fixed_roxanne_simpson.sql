CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firs_name" text,
	"last_name" text,
	"ai_hash" text
);
