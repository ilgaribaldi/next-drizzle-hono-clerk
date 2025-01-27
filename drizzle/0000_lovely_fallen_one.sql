DO $$ BEGIN
 CREATE TYPE "public"."category" AS ENUM('RESIDENTIAL', 'COMMERCIAL', 'TERRAIN', 'OFFICES', 'INDUSTRIAL', 'BANK_AUCTION');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."documentType" AS ENUM('PRICE_LIST', 'FLOOR_PLAN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."entityType" AS ENUM('PRESALE', 'ADDRESS', 'ORGANIZATION', 'USER', 'IMAGE', 'DOCUMENT', 'AMENITIES', 'PLACES_OF_INTEREST');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."historyEventType" AS ENUM('CREATED', 'UPDATED', 'DELETED', 'ADDED', 'REMOVED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."imageType" AS ENUM('PRESALE', 'GALLERY', 'UNIT', 'ORGANIZATION', 'MESSAGE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."messageType" AS ENUM('TEXT', 'IMAGE', 'FILE', 'PRESALE_SHARE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."notificationPriority" AS ENUM('LOW', 'MEDIUM', 'HIGH');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."notificationType" AS ENUM('NEW_MESSAGE', 'PRESALE_UPDATE', 'PRICE_CHANGE', 'PRESALE_AVAILABLE', 'UNIT_STATUS_CHANGE', 'NEW_DOCUMENT', 'NEW_TREND', 'SUBSCRIPTION_UPDATE', 'ORGANIZATION_UPDATE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."orgType" AS ENUM('DEVELOPER', 'STAFF');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."regionType" AS ENUM('COUNTRY', 'STATE', 'CITY', 'DISTRICT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."senderType" AS ENUM('USER', 'ORGANIZATION');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."unitStatus" AS ENUM('SOLD', 'AVAILABLE', 'RESERVED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."userRole" AS ENUM('STAFF', 'DEVELOPER', 'INVESTOR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "address" (
	"id" text PRIMARY KEY NOT NULL,
	"fullAddress" text,
	"lat" real,
	"lng" real,
	"city" text,
	"line1" text,
	"line2" text,
	"state" text,
	"country" text,
	"zipCode" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"countryId" text,
	"stateId" text,
	"cityId" text,
	"districtId" text,
	"orgId" text,
	"presaleId" text,
	"userId" text,
	CONSTRAINT "address_orgId_unique" UNIQUE("orgId"),
	CONSTRAINT "address_presaleId_unique" UNIQUE("presaleId"),
	CONSTRAINT "address_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "amenities" (
	"id" text PRIMARY KEY NOT NULL,
	"park" boolean DEFAULT false NOT NULL,
	"swimmingPool" boolean DEFAULT false NOT NULL,
	"gym" boolean DEFAULT false NOT NULL,
	"playground" boolean DEFAULT false NOT NULL,
	"bbqArea" boolean DEFAULT false NOT NULL,
	"lounge" boolean DEFAULT false NOT NULL,
	"petFriendly" boolean DEFAULT false NOT NULL,
	"petPark" boolean DEFAULT false NOT NULL,
	"bikeStorage" boolean DEFAULT false NOT NULL,
	"parking" boolean DEFAULT false NOT NULL,
	"elevator" boolean DEFAULT false NOT NULL,
	"rooftop" boolean DEFAULT false NOT NULL,
	"garden" boolean DEFAULT false NOT NULL,
	"sauna" boolean DEFAULT false NOT NULL,
	"laundryRoom" boolean DEFAULT false NOT NULL,
	"concierge" boolean DEFAULT false NOT NULL,
	"gameRoom" boolean DEFAULT false NOT NULL,
	"businessCenter" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"presaleId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"workPhone" text,
	"cellPhone" text,
	"userId" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"orgId" text,
	CONSTRAINT "contact_userId_unique" UNIQUE("userId"),
	CONSTRAINT "contact_orgId_unique" UNIQUE("orgId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversation" (
	"id" text PRIMARY KEY NOT NULL,
	"lastMessageAt" timestamp DEFAULT now(),
	"userId" text NOT NULL,
	"organizationId" text NOT NULL,
	"presaleId" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	"lastDeletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"type" "documentType" NOT NULL,
	"presaleId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "history" (
	"id" text PRIMARY KEY NOT NULL,
	"presaleId" text,
	"entityType" "entityType" NOT NULL,
	"entityId" text NOT NULL,
	"eventType" "historyEventType" NOT NULL,
	"changes" jsonb,
	"original" jsonb,
	"userId" text,
	"timestamp" timestamp NOT NULL,
	"organizationId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "image" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"type" "imageType" NOT NULL,
	"presaleId" text,
	"unitId" text,
	"organizationId" text,
	"messageId" text,
	"createdBy" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "message" (
	"id" text PRIMARY KEY NOT NULL,
	"conversationId" text NOT NULL,
	"body" text,
	"seenAt" timestamp,
	"metadata" jsonb,
	"senderId" text NOT NULL,
	"senderType" "senderType" NOT NULL,
	"type" "messageType" NOT NULL,
	"receivedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	"editedAt" timestamp,
	"sentAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notification" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"type" "notificationType" NOT NULL,
	"metadata" jsonb,
	"conversationId" text,
	"presaleId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp,
	"priority" "notificationPriority" DEFAULT 'LOW' NOT NULL,
	"global" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_like" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"organizationId" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"slug" text,
	"created_by" text NOT NULL,
	"addressId" text,
	"type" "orgType" DEFAULT 'DEVELOPER' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"imageUrl" text,
	"logoUrl" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "placesOfInterest" (
	"id" text PRIMARY KEY NOT NULL,
	"schools" boolean DEFAULT false NOT NULL,
	"hospitals" boolean DEFAULT false NOT NULL,
	"publicTransport" boolean DEFAULT false NOT NULL,
	"shoppingCenters" boolean DEFAULT false NOT NULL,
	"parks" boolean DEFAULT false NOT NULL,
	"restaurants" boolean DEFAULT false NOT NULL,
	"museums" boolean DEFAULT false NOT NULL,
	"libraries" boolean DEFAULT false NOT NULL,
	"gyms" boolean DEFAULT false NOT NULL,
	"entertainment" boolean DEFAULT false NOT NULL,
	"policeStations" boolean DEFAULT false NOT NULL,
	"pharmacies" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"presaleId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "presale_like" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"presaleId" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "presale_trend" (
	"id" text PRIMARY KEY NOT NULL,
	"presaleId" text NOT NULL,
	"trendId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "presale" (
	"id" text PRIMARY KEY NOT NULL,
	"orgId" text NOT NULL,
	"developer" text,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"deliveryDate" timestamp NOT NULL,
	"phase" integer NOT NULL,
	"visibleByStaff" boolean DEFAULT false NOT NULL,
	"visibleByDeveloper" boolean DEFAULT false NOT NULL,
	"isFeatured" boolean DEFAULT false,
	"finishingMaterial" text,
	"constructionMaterial" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"category" "category",
	"deletedAt" timestamp,
	"createdBy" text,
	"lastUpdatedBy" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "region" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text,
	"country" text NOT NULL,
	"type" "regionType" NOT NULL,
	"geometry" jsonb NOT NULL,
	"parent_id" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"subscriptionId" text NOT NULL,
	"customerId" text NOT NULL,
	"priceId" text NOT NULL,
	"status" text NOT NULL,
	"currentPeriodEnd" timestamp,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"orgId" text,
	CONSTRAINT "subscription_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trend" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"position" integer NOT NULL,
	"visible" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "trend_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "unit" (
	"id" text PRIMARY KEY NOT NULL,
	"exterior" real NOT NULL,
	"interior" real NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"rowIndex" integer NOT NULL,
	"colIndex" integer NOT NULL,
	"status" "unitStatus" DEFAULT 'AVAILABLE' NOT NULL,
	"presaleId" text,
	"bathrooms" integer,
	"bedrooms" integer,
	"parkingSpaces" integer,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_notification" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"notificationId" text,
	"seenAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"orgId" text,
	"role" "userRole" DEFAULT 'INVESTOR',
	"firstName" text,
	"lastName" text,
	"username" text,
	"email" text,
	"emailVerified" timestamp,
	"imageUrl" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"stripeCustomerId" text NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_countryId_region_id_fk" FOREIGN KEY ("countryId") REFERENCES "public"."region"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_stateId_region_id_fk" FOREIGN KEY ("stateId") REFERENCES "public"."region"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_cityId_region_id_fk" FOREIGN KEY ("cityId") REFERENCES "public"."region"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_districtId_region_id_fk" FOREIGN KEY ("districtId") REFERENCES "public"."region"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_orgId_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_presaleId_presale_id_fk" FOREIGN KEY ("presaleId") REFERENCES "public"."presale"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "amenities" ADD CONSTRAINT "amenities_presaleId_presale_id_fk" FOREIGN KEY ("presaleId") REFERENCES "public"."presale"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contact" ADD CONSTRAINT "contact_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contact" ADD CONSTRAINT "contact_orgId_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation" ADD CONSTRAINT "conversation_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation" ADD CONSTRAINT "conversation_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation" ADD CONSTRAINT "conversation_presaleId_presale_id_fk" FOREIGN KEY ("presaleId") REFERENCES "public"."presale"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document" ADD CONSTRAINT "document_presaleId_presale_id_fk" FOREIGN KEY ("presaleId") REFERENCES "public"."presale"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "history" ADD CONSTRAINT "history_presaleId_presale_id_fk" FOREIGN KEY ("presaleId") REFERENCES "public"."presale"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "history" ADD CONSTRAINT "history_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "history" ADD CONSTRAINT "history_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image" ADD CONSTRAINT "image_presaleId_presale_id_fk" FOREIGN KEY ("presaleId") REFERENCES "public"."presale"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image" ADD CONSTRAINT "image_unitId_unit_id_fk" FOREIGN KEY ("unitId") REFERENCES "public"."unit"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image" ADD CONSTRAINT "image_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image" ADD CONSTRAINT "image_messageId_message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image" ADD CONSTRAINT "image_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_conversationId_conversation_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification" ADD CONSTRAINT "notification_conversationId_conversation_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification" ADD CONSTRAINT "notification_presaleId_presale_id_fk" FOREIGN KEY ("presaleId") REFERENCES "public"."presale"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_like" ADD CONSTRAINT "organization_like_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_like" ADD CONSTRAINT "organization_like_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "placesOfInterest" ADD CONSTRAINT "placesOfInterest_presaleId_presale_id_fk" FOREIGN KEY ("presaleId") REFERENCES "public"."presale"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "presale_like" ADD CONSTRAINT "presale_like_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "presale_like" ADD CONSTRAINT "presale_like_presaleId_presale_id_fk" FOREIGN KEY ("presaleId") REFERENCES "public"."presale"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "presale_trend" ADD CONSTRAINT "presale_trend_presaleId_presale_id_fk" FOREIGN KEY ("presaleId") REFERENCES "public"."presale"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "presale_trend" ADD CONSTRAINT "presale_trend_trendId_trend_id_fk" FOREIGN KEY ("trendId") REFERENCES "public"."trend"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "presale" ADD CONSTRAINT "presale_orgId_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "presale" ADD CONSTRAINT "presale_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "presale" ADD CONSTRAINT "presale_lastUpdatedBy_user_id_fk" FOREIGN KEY ("lastUpdatedBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "region" ADD CONSTRAINT "region_parent_id_region_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."region"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_orgId_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "unit" ADD CONSTRAINT "unit_presaleId_presale_id_fk" FOREIGN KEY ("presaleId") REFERENCES "public"."presale"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_notificationId_notification_id_fk" FOREIGN KEY ("notificationId") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_orgId_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_conversations_idx" ON "conversation" USING btree ("userId","lastMessageAt");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_conversation_idx" ON "conversation" USING btree ("userId","organizationId","presaleId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_conversation_created_idx" ON "message" USING btree ("conversationId","createdAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_delivery_status_idx" ON "message" USING btree ("conversationId","receivedAt","seenAt");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "notification_presale_available_idx" ON "notification" USING btree ("presaleId","type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "org_likes_user_idx" ON "organization_like" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_likes_org_user_idx" ON "organization_like" USING btree ("organizationId","userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "organization_like_user_id_organization_id_unique_idx" ON "organization_like" USING btree ("userId","organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "presale_likes_user_idx" ON "presale_like" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "presale_likes_presale_user_idx" ON "presale_like" USING btree ("presaleId","userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "presale_like_user_id_presale_id_unique_idx" ON "presale_like" USING btree ("userId","presaleId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "presale_trend_unique" ON "presale_trend" USING btree ("presaleId","trendId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "presale_visibility_idx" ON "presale" USING btree ("orgId","visibleByStaff","visibleByDeveloper");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_notification_unique_idx" ON "user_notification" USING btree ("userId","notificationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_role_idx" ON "user" USING btree ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_name_idx" ON "user" USING btree ("firstName","lastName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_created_at_idx" ON "user" USING btree ("createdAt");