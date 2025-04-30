-- 1️⃣ Add the new column as nullable
ALTER TABLE "favorites"    ADD "gameId" TEXT;
ALTER TABLE "saved_games"  ADD "gameId" TEXT;

-- 2️⃣ Remove any old rows that don’t yet have a gameId
DELETE FROM "favorites"   WHERE "gameId" IS NULL;
DELETE FROM "saved_games" WHERE "gameId" IS NULL;
