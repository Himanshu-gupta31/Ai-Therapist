/*
  Warnings:

  - You are about to drop the column `Coins` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Coins",
ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 0;
