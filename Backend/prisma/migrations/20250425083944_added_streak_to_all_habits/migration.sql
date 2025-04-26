/*
  Warnings:

  - You are about to drop the column `checkInDates` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastCheckIn` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `longestStreak` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `streak` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "QuoteType" AS ENUM ('MOTIVATIONAL', 'ROAST');

-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "checkInDates" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "lastCheckIn" TIMESTAMP(3),
ADD COLUMN     "longestStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "checkInDates",
DROP COLUMN "lastCheckIn",
DROP COLUMN "longestStreak",
DROP COLUMN "streak";

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" "QuoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);
