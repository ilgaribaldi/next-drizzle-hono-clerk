CREATE TABLE IF NOT EXISTS "video" (
	"id" text PRIMARY KEY NOT NULL,
	"assetId" text,
	"batchId" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"duration" real,
	"etag" text NOT NULL,
	"originalFilename" text,
	"playbackUrl" text,
	"url" text NOT NULL,
	"signature" text,
	"version" integer NOT NULL,
	"versionId" text,
	"width" integer,
	"presaleId" text,
	"format" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video" ADD CONSTRAINT "video_presaleId_presale_id_fk" FOREIGN KEY ("presaleId") REFERENCES "public"."presale"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
