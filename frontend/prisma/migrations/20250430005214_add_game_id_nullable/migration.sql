-- prisma/migrations/20250430005214_add_game_id_nullable/migration.sql

-- 1) Add the new column (nullable)
ALTER TABLE "Favorite"  ADD "gameId" TEXT;
ALTER TABLE "SavedGame" ADD "gameId" TEXT;

-- 2) Delete any rows that had no gameId assigned
DELETE FROM "Favorite"   WHERE "gameId" IS NULL;
DELETE FROM "SavedGame"  WHERE "gameId" IS NULL;
