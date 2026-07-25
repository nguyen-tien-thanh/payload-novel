import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_translator_requests_status" AS ENUM('pending', 'approved', 'rejected');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "translator_requests" (
    	"id" serial PRIMARY KEY NOT NULL,
    	"reason" varchar NOT NULL,
    	"experience" varchar,
    	"sample_link" varchar,
    	"status" "enum_translator_requests_status" DEFAULT 'pending',
    	"admin_note" varchar,
    	"created_by_id" integer NOT NULL,
    	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "translator_requests"
        ADD CONSTRAINT "translator_requests_created_by_id_users_id_fk"
        FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_translator_requests_fk"
        FOREIGN KEY ("translator_requests_id") REFERENCES "public"."translator_requests"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "translator_requests_created_by_idx" ON "translator_requests" USING btree ("created_by_id");
    CREATE INDEX IF NOT EXISTS "translator_requests_updated_at_idx" ON "translator_requests" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "translator_requests_created_at_idx" ON "translator_requests" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_translator_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("translator_requests_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_translator_requests_id_idx";
    DROP INDEX IF EXISTS "translator_requests_created_at_idx";
    DROP INDEX IF EXISTS "translator_requests_updated_at_idx";
    DROP INDEX IF EXISTS "translator_requests_created_by_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_translator_requests_fk";
    DROP TABLE IF EXISTS "translator_requests" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_translator_requests_status";
  `)
}
