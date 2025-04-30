/*
  Warnings:

  - Made the column `gameId` on table `Favorite` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gameId` on table `SavedGame` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Favorite" ALTER COLUMN "gameId" SET NOT NULL;

-- AlterTable
ALTER TABLE "SavedGame" ALTER COLUMN "gameId" SET NOT NULL;
