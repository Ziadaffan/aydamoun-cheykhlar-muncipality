-- The auth token table is used with logical replication in hosted Postgres environments
-- (for example Supabase/Neon) and must retain row identity for DELETE operations.
ALTER TABLE "VerificationToken" REPLICA IDENTITY FULL;
