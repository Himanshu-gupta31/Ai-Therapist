-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastCheckIn" TIMESTAMP(3),
ADD COLUMN     "longestStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0;
