DROP INDEX IF EXISTS "notification_user_conversation_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "notification_org_conversation_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "notification_user_conversation_idx" ON "notification" USING btree ("userId","conversationId","type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "notification_org_conversation_idx" ON "notification" USING btree ("organizationId","conversationId","type");