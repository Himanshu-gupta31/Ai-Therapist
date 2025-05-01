/*
  Warnings:

  - You are about to drop the `_HabitQuotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_HabitQuotes" DROP CONSTRAINT "_HabitQuotes_A_fkey";

-- DropForeignKey
ALTER TABLE "_HabitQuotes" DROP CONSTRAINT "_HabitQuotes_B_fkey";

-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "quoteId" TEXT;

-- DropTable
DROP TABLE "_HabitQuotes";

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;
