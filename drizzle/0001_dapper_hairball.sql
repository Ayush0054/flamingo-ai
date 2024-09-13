ALTER TABLE "chats" RENAME COLUMN "pdf_name" TO "chat_name";--> statement-breakpoint
ALTER TABLE "chats" DROP COLUMN IF EXISTS "pdf_url";--> statement-breakpoint
ALTER TABLE "chats" DROP COLUMN IF EXISTS "file_key";