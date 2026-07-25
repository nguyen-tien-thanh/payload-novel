import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_users_role" ADD VALUE IF NOT EXISTS 'translator';
  `)
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // Postgres does not support removing a value from an enum type.
}
