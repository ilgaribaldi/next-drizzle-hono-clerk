ALTER TABLE "video" ALTER COLUMN "width" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "video" ADD COLUMN "height" integer NOT NULL;