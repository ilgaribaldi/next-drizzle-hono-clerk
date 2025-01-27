ALTER TABLE "organization_like" DROP CONSTRAINT "organization_like_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "presale_like" DROP CONSTRAINT "presale_like_userId_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_like" ADD CONSTRAINT "organization_like_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "presale_like" ADD CONSTRAINT "presale_like_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
