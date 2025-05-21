/*
  Warnings:

  - You are about to drop the column `coins` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `screenTime` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "suggestedTarget" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "coins",
DROP COLUMN "screenTime";

-- CreateTable
CREATE TABLE "Coins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "dateAwarded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "habitId" TEXT NOT NULL,

    CONSTRAINT "Coins_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Coins" ADD CONSTRAINT "Coins_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coins" ADD CONSTRAINT "Coins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
