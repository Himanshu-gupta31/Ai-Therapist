/*
  Warnings:

  - You are about to drop the column `duration` on the `DailyPlanner` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `DailyPlanner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,date,startingtime]` on the table `DailyPlanner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endtime` to the `DailyPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startingtime` to the `DailyPlanner` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DailyPlanner_userId_date_time_key";

-- AlterTable
ALTER TABLE "DailyPlanner" DROP COLUMN "duration",
DROP COLUMN "time",
ADD COLUMN     "endtime" TEXT NOT NULL,
ADD COLUMN     "startingtime" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DailyPlanner_userId_date_startingtime_key" ON "DailyPlanner"("userId", "date", "startingtime");
