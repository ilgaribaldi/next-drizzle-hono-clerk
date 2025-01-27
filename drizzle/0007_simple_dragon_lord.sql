ALTER TABLE "notification" ADD COLUMN "trendId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification" ADD CONSTRAINT "notification_trendId_trend_id_fk" FOREIGN KEY ("trendId") REFERENCES "public"."trend"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
